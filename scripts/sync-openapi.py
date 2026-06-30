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


def nice_tag(tag: str) -> str:
    return tag.replace("-", " ").title().replace("Api", "API")  # api-keys -> API Keys


def titlecase_tags(spec: dict):
    mapping: dict[str, str] = {}
    for ops in spec.get("paths", {}).values():
        for op in ops.values():
            if isinstance(op, dict) and op.get("tags"):
                op["tags"] = [mapping.setdefault(t, nice_tag(t)) for t in op["tags"]]
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
    titlecase_tags(spec)
    badge_roles(spec)
    with open(out, "w") as f:
        json.dump(spec, f, indent=2)
    print(f"{out}: {len(spec.get('paths', {}))} paths, {len(spec.get('tags', []))} tags")


if __name__ == "__main__":
    build("https://api.axilio.ai/openapi.json", "https://api.axilio.ai/api/v1",
          "api-reference/openapi-backend.json")
    build("https://argus.axilio.ai/openapi.json", "https://argus.axilio.ai",
          "api-reference/openapi-argus.json")
