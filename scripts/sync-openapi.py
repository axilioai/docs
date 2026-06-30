#!/usr/bin/env python3
"""Fetch the public Axilio OpenAPI specs and clean them for the docs API reference.

Three reasons we can't point Mintlify straight at the live specs:
  1. servers   - both ship relative/missing servers (backend "/api/v1", argus
                 none) and Mintlify can't override servers in docs.json, so the
                 "Try it" panel needs absolute URLs baked in.
  2. $schema   - the OpenAPI 3.1 specs carry JSON-Schema $schema markers that
                 Mintlify renders as noise in every response body.
  3. tag case  - the backend spec ships lowercase tags ("api-keys"), which read
                 inconsistently next to the properly-cased argus tags.

This normalizes all three so the REST and Vision references render consistently.

Run from the docs repo root:  python scripts/sync-openapi.py
Outputs: api-reference/openapi-backend.json, api-reference/openapi-argus.json
"""
import json
import re
import urllib.request

# A default Python UA gets a 403 from the edge; a browser-ish UA is fine.
_UA = {"User-Agent": "Mozilla/5.0 (compatible; axilio-docs-spec-sync)"}


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


_METHODS = ("get", "post", "put", "patch", "delete")

# ─────────────────────────────────────────────────────────────────────────────
# Public-surface curation (audit: API_SURFACE_AUDIT.md, decisions 2026-06-30).
#
# The backend serves its full dashboard/console API at /openapi.json. That's the
# wrong surface for a customer SDK reference: it leaks runtime/editor plumbing,
# ships duplicate "simple GET + rich POST" list pairs, and exposes billing and
# org-management flows that live in the dashboard. Until the backend splits these
# at the source (AXI-1124), we curate here so the docs render the customer API.
#
# DROP removes an operation before Mintlify sees it. Grouped by reason so the
# rationale travels with the list.
_DROP: set[tuple[str, str]] = {
    # Runtime / dashboard / editor plumbing — a customer never calls these; the
    # descriptions say so ("Powers the dashboard's 'last active' column", etc.).
    ("patch", "/workflows/{workflowID}/run"),       # bumps last_run_at after a run starts
    ("post", "/phones/{phone_id}/interaction"),     # last-active telemetry
    ("post", "/phones/connect"),                     # WebRTC session init (SDK plumbing)
    ("post", "/phones/{phone_id}/command"),          # raw driver primitive (SDK wraps it)
    ("get", "/phones/allocation-status"),            # editor check
    ("get", "/phones/available/by-location"),        # editor location picker
    ("get", "/phones/user/for-workflow"),            # editor allocation picker
    ("get", "/phones/counts"),                       # fleet/admin view
    ("post", "/billing/history/sync"),               # invoice reconciliation
    # Duplicate list endpoints — keep the cleaner twin, drop the other.
    ("post", "/api-keys/list"),                       # keep GET /api-keys
    ("post", "/workflows/list"),                      # keep GET /workflows
    ("post", "/usage/metrics"),                       # keep GET /usage/metrics
    ("get", "/billing/phone-rental-subscriptions/list"),  # keep GET /billing/phone-rental-subscriptions
    ("post", "/usage/sessions"),                      # keep GET /phones/sessions
    # Billing: read-only in the SDK (balance/history/plan/rentals). Checkout,
    # portal, and subscription/rental management stay in the dashboard.
    ("post", "/billing/add-funds"),
    ("post", "/billing/customer-portal"),
    ("post", "/billing/history/download"),
    ("post", "/billing/phone-rental-subscription/checkout"),
    ("post", "/billing/phone-rental-subscriptions/cancel"),
    ("post", "/billing/phone-rental-subscriptions/renew"),
    ("get", "/billing/subscription/plan-change/validate"),
    ("post", "/billing/subscription/cancel"),
    ("post", "/billing/subscription/checkout"),
    ("delete", "/billing/subscription/downgrade"),
    ("post", "/billing/subscription/downgrade"),
    # Console management — dashboard-only. SDK keeps reads (whoami, list orgs,
    # list members, list invitations); org/member mutations + account deletion +
    # user settings live in the console.
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
}

# Operation summaries describe the customer's action — no implementation suffixes
# ("(simple)", "(rich body)"), one verb per CRUD, and "phone" as the one noun.
_RENAME: dict[tuple[str, str], str] = {
    ("get", "/api-keys"): "List API keys",
    # Phones
    ("post", "/phones/allocate"): "Allocate a phone",
    ("post", "/phones/user/deallocate"): "Release a phone",
    ("get", "/phones/available"): "List available phones",
    ("get", "/phones/my"): "List your phones",
    ("get", "/phones/{phone_id}"): "Get a phone",
    ("get", "/phones/sessions"): "List sessions",
    ("get", "/phones/sessions/{id}"): "Get a session",
    ("get", "/phones/sessions/{id}/recording"): "Get a session recording",
    ("get", "/phones/sessions/active"): "List active sessions",
    ("patch", "/phones/{phone_id}/nickname"): "Rename a phone",
    ("post", "/phones/{phone_id}/wipe"): "Wipe a phone",
    ("get", "/phones/device-apps/supported"): "List supported apps",
    # Runs
    ("post", "/runs/{workflowID}"): "Start a run",
    ("post", "/runs"): "List runs",
    ("post", "/runs/history"): "List run history",
    ("post", "/runs/events"): "List run events",
    ("get", "/runs/stats/{workflowID}"): "Get workflow stats",
    ("get", "/runs/user/{runID}"): "Get a run",
    ("patch", "/runs/{runID}"): "Cancel a run",
    # Workflows
    ("get", "/workflows"): "List workflows",
    ("post", "/workflows/from-code"): "Create a workflow from code",
    ("post", "/workflows/{workflowID}/code"): "Save workflow code",
    # Usage
    ("post", "/usage/inferences"): "List inference calls",
    ("get", "/usage/metrics"): "Get usage metrics",
    # Billing (reads)
    ("get", "/billing/subscription"): "Get current plan",
    ("get", "/billing/phone-rental-subscriptions"): "List phone rentals",
    # Organizations (reads)
    ("get", "/organizations"): "List organizations",
    ("get", "/organizations/{org_id}/members"): "List members",
    # User
    ("get", "/users/me"): "Get your profile",
}

# Customer-facing noun is "phone" (brand: The Phone Cloud); the backend tag is
# still "devices".
_TAG_OVERRIDE = {"devices": "Phones"}


def drop_internal(spec: dict):
    for path in list(spec.get("paths", {})):
        ops = spec["paths"][path]
        for method in [m for m in list(ops) if (m, path) in _DROP]:
            del ops[method]
        # Prune a path that has no operations left.
        if not any(m in ops for m in _METHODS):
            del spec["paths"][path]


def rename_ops(spec: dict):
    for path, ops in spec.get("paths", {}).items():
        for method, op in ops.items():
            if isinstance(op, dict) and (method, path) in _RENAME:
                op["summary"] = _RENAME[(method, path)]


def nice_tag(tag: str) -> str:
    return tag.replace("-", " ").title().replace("Api", "API")  # api-keys -> API Keys


def titlecase_tags(spec: dict):
    # Collapse each operation to its primary (first) tag. The backend cross-tags
    # ops with sub-group labels (Code, Members, Phone Rental…); keeping them would
    # spawn phantom sidebar groups, so we group by the first tag only.
    mapping: dict[str, str] = {}
    for ops in spec.get("paths", {}).values():
        for op in ops.values():
            if isinstance(op, dict) and op.get("tags"):
                first = op["tags"][0]
                op["tags"] = [mapping.setdefault(first, _TAG_OVERRIDE.get(first, nice_tag(first)))]
    # Mirror into top-level tag declarations so labels/order are explicit.
    spec["tags"] = [{"name": name} for name in dict.fromkeys(mapping.values())]


# Role gates are expressed as prose in the backend spec ("Admin only.", "Org
# admin only."). We lift them out of the description and render them as a badge
# above each endpoint so the access requirement reads as a tag, not a sentence
# buried mid-paragraph. Most specific first so "Org admin" wins over "Admin".
# NOTE: this only surfaces the *admin* gates the spec actually states in prose.
# Per-route viewer/member requirements aren't in the spec yet — that needs the
# backend to emit a structured x-required-role per operation (AXI-1123), after
# which this drops the prose-grep and badges every endpoint off that field.
# Until then, no badge == no admin-level gate, which is accurate to what we know.
_ROLE_PHRASES = [
    ("Org admin only.", "Org admin"),
    ("Admin only.", "Admin"),
]


def _role_badge(label: str) -> str:
    # Inline HTML in x-mint.content renders as MDX above the generated endpoint
    # body; .api-role* is styled in style.css.
    return f'<span class="api-role api-role-admin">{label}</span>'


def badge_roles(spec: dict):
    for ops in spec.get("paths", {}).values():
        for op in ops.values():
            if not isinstance(op, dict):
                continue
            desc = op.get("description") or ""
            for phrase, label in _ROLE_PHRASES:
                if phrase in desc:
                    # Strip the phrase (and any leftover double spaces) so the
                    # description no longer states the role inline.
                    desc = re.sub(r"\s*" + re.escape(phrase), "", desc).strip()
                    op["description"] = desc
                    op.setdefault("x-mint", {})["content"] = _role_badge(label)
                    break


def build(url: str, server: str, out: str):
    spec = fetch(url)
    spec["servers"] = [{"url": server, "description": "Production"}]
    strip_schema(spec)
    drop_internal(spec)   # curate the customer surface before anything else reads it
    rename_ops(spec)
    titlecase_tags(spec)  # rebuilds spec["tags"] from the surviving operations
    badge_roles(spec)
    with open(out, "w") as f:
        json.dump(spec, f, indent=2)
    print(f"{out}: {len(spec.get('paths', {}))} paths, {len(spec.get('tags', []))} tags")


if __name__ == "__main__":
    build("https://api.axilio.ai/openapi.json", "https://api.axilio.ai/api/v1",
          "api-reference/openapi-backend.json")
    build("https://argus.axilio.ai/openapi.json", "https://argus.axilio.ai",
          "api-reference/openapi-argus.json")
