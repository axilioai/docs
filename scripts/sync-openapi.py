#!/usr/bin/env python3
"""Fetch the public Axilio OpenAPI specs and clean them for the docs API reference.

As of the AXI-1124 backend curation the live public spec is already the customer
surface — trimmed to ~45 ops, renamed to the verb+noun scheme, `phones` noun,
and every op carrying an `x-required-role`. So this no longer re-curates or
renames; it just does the few things Mintlify needs that the spec can't express:

  1. servers   - the spec ships a relative server ("/api/v1"); Mintlify can't
                 override servers in docs.json, so the "Try it" panel needs the
                 absolute URL baked in.
  2. $schema   - the OpenAPI 3.1 spec carries JSON-Schema $schema markers that
                 Mintlify renders as noise in every response body.
  3. tag case  - the backend ships lowercase tags ("phones"); we Title-Case them
                 (and collapse to one tag per op) for a clean sidebar.
  4. role badge - lift `x-required-role` (viewer/member/admin) into an x-mint
                 badge rendered above each endpoint (AXI-1123).

DROP is retained only as a thin safety net: the backend's openapi_guard_test now
locks the surface at the source, but if a management/destructive route ever
regresses back into the public spec, dropping it here keeps it out of the docs.

Run from the docs repo root:  python scripts/sync-openapi.py
Outputs: api-reference/openapi-backend.json, api-reference/openapi-argus.json
"""
import json
import urllib.request

# A default Python UA gets a 403 from the edge; a browser-ish UA is fine.
_UA = {"User-Agent": "Mozilla/5.0 (compatible; axilio-docs-spec-sync)"}

_METHODS = ("get", "post", "put", "patch", "delete")


def fetch(url: str) -> dict:
    req = urllib.request.Request(url, headers=_UA)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)


def strip_schema(node):
    """Drop every JSON-Schema $schema marker (OpenAPI 3.1 noise in Mintlify)."""
    if isinstance(node, dict):
        node.pop("$schema", None)
        for v in node.values():
            strip_schema(v)
    elif isinstance(node, list):
        for v in node:
            strip_schema(v)


# Safety net only. The backend curates the public surface at the source
# (AXI-1124) and openapi_guard_test locks it, so this normally matches nothing.
# It's the management/destructive routes that would be a genuine exposure if the
# split ever regressed — drop them here too so a backend slip can't publish them
# to the customer docs. (Plumbing/duplicate-list ops aren't security-sensitive,
# so they're not worth a parallel list.)
_DROP: set[tuple[str, str]] = {
    ("post", "/organizations"),
    ("patch", "/organizations/{org_id}"),
    ("post", "/organizations/{org_id}/invitations"),
    ("delete", "/organizations/{org_id}/invitations/{invitation_id}"),
    ("post", "/organizations/{org_id}/members"),
    ("delete", "/organizations/{org_id}/members/{user_id}"),
    ("patch", "/organizations/{org_id}/members/{user_id}"),
    ("delete", "/users/me"),
    ("get", "/user-settings"),
    ("put", "/user-settings"),
    ("post", "/billing/add-funds"),
    ("post", "/billing/customer-portal"),
    ("post", "/billing/subscription/checkout"),
    ("post", "/billing/subscription/cancel"),
    ("post", "/billing/subscription/downgrade"),
    ("delete", "/billing/subscription/downgrade"),
    ("post", "/billing/phone-rental-subscription/checkout"),
    ("post", "/billing/phone-rental-subscriptions/cancel"),
    ("post", "/billing/phone-rental-subscriptions/renew"),
}


def drop_internal(spec: dict):
    for path in list(spec.get("paths", {})):
        ops = spec["paths"][path]
        for method in [m for m in list(ops) if (m, path) in _DROP]:
            del ops[method]
        if not any(m in ops for m in _METHODS):
            del spec["paths"][path]


def nice_tag(tag: str) -> str:
    return tag.replace("-", " ").title().replace("Api", "API")  # api-keys -> API Keys


def titlecase_tags(spec: dict):
    # Collapse each operation to its primary (first) tag and Title-Case it, so the
    # sidebar reads cleanly and a stray secondary tag can't spawn a phantom group.
    mapping: dict[str, str] = {}
    for ops in spec.get("paths", {}).values():
        for op in ops.values():
            if isinstance(op, dict) and op.get("tags"):
                first = op["tags"][0]
                op["tags"] = [mapping.setdefault(first, nice_tag(first))]
    spec["tags"] = [{"name": name} for name in dict.fromkeys(mapping.values())]


# The backend emits x-required-role (viewer/member/admin) per op (AXI-1123). Org
# roles are HIERARCHICAL — viewer < member < admin — so the value is a *minimum*,
# not an exclusive role: a member can call any viewer endpoint, an admin can call
# anything. We render it as a "or higher" pill (Viewer+ / Member+ / Admin) with a
# tooltip spelling out who can call it, so the badge doesn't read as "only this
# role." The role model is explained on api-reference/overview.mdx. .api-role* is
# styled in style.css.
_ROLE_BADGE = {
    "viewer": ("Minimum role required: Viewer", "Any org member (viewer, member, or admin) can call this."),
    "member": ("Minimum role required: Member", "Members and admins can call this; viewers cannot."),
    "admin": ("Minimum role required: Admin", "Admins only."),
}


def badge_roles(spec: dict):
    for ops in spec.get("paths", {}).values():
        for op in ops.values():
            if not isinstance(op, dict):
                continue
            role = op.get("x-required-role")
            if role in _ROLE_BADGE:
                label, tip = _ROLE_BADGE[role]
                # Inline HTML in x-mint.content renders as MDX above the generated
                # endpoint body. title= gives an on-hover explanation of "minimum".
                op.setdefault("x-mint", {})["content"] = (
                    f'<span class="api-role api-role-{role}" title="{tip}">{label}</span>'
                )


def build(url: str, server: str, out: str):
    spec = fetch(url)
    spec["servers"] = [{"url": server, "description": "Production"}]
    strip_schema(spec)
    drop_internal(spec)   # safety net only; backend curates at the source
    titlecase_tags(spec)
    badge_roles(spec)
    with open(out, "w") as f:
        json.dump(spec, f, indent=2)
    roles = {}
    for ops in spec.get("paths", {}).values():
        for op in ops.values():
            if isinstance(op, dict) and op.get("x-required-role"):
                roles[op["x-required-role"]] = roles.get(op["x-required-role"], 0) + 1
    print(f"{out}: {len(spec.get('paths', {}))} paths, {len(spec.get('tags', []))} tags, roles={roles}")


if __name__ == "__main__":
    build("https://api.axilio.ai/openapi.json", "https://api.axilio.ai/api/v1",
          "api-reference/openapi-backend.json")
    build("https://argus.axilio.ai/openapi.json", "https://argus.axilio.ai",
          "api-reference/openapi-argus.json")
