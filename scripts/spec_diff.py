#!/usr/bin/env python3
"""Diff two OpenAPI specs and emit a Markdown drift report.

Used by .github/workflows/api-spec-drift.yml to turn a production spec
change into a human-readable checklist of what moved on the customer-facing
API surface — so a docs author knows exactly which endpoints to re-check
against the hand-written MDX in api-reference/.

This intentionally does NOT try to rewrite the docs. The api-reference pages
are hand-authored prose shaped around the Python SDK, not generated from the
spec, so the most this can do is point a human at the right pages.

Usage:
    python3 scripts/spec_diff.py OLD_SPEC NEW_SPEC > report.md

Exit status:
    0  report written (whether or not anything changed)
    2  bad arguments / unreadable spec

The report's first line is a machine-readable marker:
    DRIFT: yes   — the customer-facing surface moved
    DRIFT: no    — only info.version (or nothing) changed
The workflow greps that line to decide whether to open a PR.
"""

from __future__ import annotations

import json
import sys
from typing import Any

# Best-effort map from OpenAPI tag → the docs pages most likely to need an
# edit when an operation under that tag changes. Tags come from the backend
# routers; pages are the hand-written MDX in this repo. A tag with no entry
# falls back to "review the API Reference tab".
TAG_TO_PAGES: dict[str, list[str]] = {
    "api-keys": ["api-reference/api-keys-resource.mdx", "platform/api-keys.mdx"],
    "billing": ["api-reference/billing-resource.mdx", "platform/billing.mdx"],
    "phone-rental": ["api-reference/billing-resource.mdx", "platform/billing.mdx"],
    "history": ["api-reference/billing-resource.mdx", "platform/billing.mdx"],
    "usage": ["api-reference/usage-resource.mdx", "platform/usage.mdx"],
    "devices": [
        "api-reference/mobile-resource.mdx",
        "concepts/devices.mdx",
        "guides/allocating-devices.mdx",
    ],
    "runs": ["api-reference/runs-resource.mdx", "concepts/workflows-and-runs.mdx"],
    "workflows": [
        "api-reference/workflows-resource.mdx",
        "concepts/workflows-and-runs.mdx",
    ],
    "organizations": ["api-reference/org-resource.mdx", "platform/organizations.mdx"],
    "members": ["api-reference/org-resource.mdx", "platform/organizations.mdx"],
    "invitations": ["api-reference/org-resource.mdx", "platform/organizations.mdx"],
    "user": ["api-reference/client.mdx", "authentication.mdx"],
    "user-settings": ["api-reference/client.mdx"],
    "code": ["api-reference/client.mdx"],
}

HTTP_METHODS = {"get", "put", "post", "delete", "patch", "options", "head", "trace"}


def load(path: str) -> dict[str, Any]:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"spec_diff: cannot read {path}: {exc}", file=sys.stderr)
        sys.exit(2)


def operations(spec: dict[str, Any]) -> dict[tuple[str, str], dict[str, Any]]:
    """Flatten paths into {(METHOD, path): operation}."""
    out: dict[tuple[str, str], dict[str, Any]] = {}
    for path, item in (spec.get("paths") or {}).items():
        if not isinstance(item, dict):
            continue
        for method, op in item.items():
            if method.lower() in HTTP_METHODS and isinstance(op, dict):
                out[(method.upper(), path)] = op
    return out


def op_tags(op: dict[str, Any]) -> list[str]:
    tags = op.get("tags")
    return tags if isinstance(tags, list) and tags else ["(untagged)"]


def op_signature(op: dict[str, Any]) -> Any:
    """The parts of an operation a docs author cares about: params, body,
    responses. Deliberately ignores descriptions/summaries so a pure prose
    tweak in the backend doesn't read as a surface change here."""
    return {
        "parameters": op.get("parameters"),
        "requestBody": op.get("requestBody"),
        "responses": op.get("responses"),
        "deprecated": op.get("deprecated", False),
    }


def pages_for_tags(tags: set[str]) -> list[str]:
    pages: list[str] = []
    for tag in sorted(tags):
        for page in TAG_TO_PAGES.get(tag, []):
            if page not in pages:
                pages.append(page)
    return pages


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: spec_diff.py OLD_SPEC NEW_SPEC", file=sys.stderr)
        return 2

    old, new = load(sys.argv[1]), load(sys.argv[2])
    old_ops, new_ops = operations(old), operations(new)

    old_keys, new_keys = set(old_ops), set(new_ops)
    added = sorted(new_keys - old_keys)
    removed = sorted(old_keys - new_keys)
    changed = sorted(
        k
        for k in old_keys & new_keys
        if op_signature(old_ops[k]) != op_signature(new_ops[k])
    )

    # Schema-level churn often drives request/response shape changes that
    # the operation-level diff above already catches via $ref, but surfacing
    # the schema names helps a human grep the MDX response tables.
    old_schemas = (old.get("components") or {}).get("schemas") or {}
    new_schemas = (new.get("components") or {}).get("schemas") or {}
    added_schemas = sorted(set(new_schemas) - set(old_schemas))
    removed_schemas = sorted(set(old_schemas) - set(new_schemas))
    changed_schemas = sorted(
        s
        for s in set(old_schemas) & set(new_schemas)
        if old_schemas[s] != new_schemas[s]
    )

    old_ver = (old.get("info") or {}).get("version", "?")
    new_ver = (new.get("info") or {}).get("version", "?")

    surface_moved = bool(
        added or removed or changed or added_schemas or removed_schemas or changed_schemas
    )

    # First line: machine-readable gate the workflow greps on.
    lines = [f"DRIFT: {'yes' if surface_moved else 'no'}", ""]

    lines.append(f"Backend API version: `{old_ver}` → `{new_ver}`")
    lines.append("")

    if not surface_moved:
        lines.append(
            "No customer-facing operation or schema changed between these "
            "specs (only metadata such as `info.version`). No docs edit is "
            "likely required, but give the changelog a glance."
        )
        sys.stdout.write("\n".join(lines) + "\n")
        return 0

    # Collect the tags touched so we can suggest pages up front.
    touched_tags: set[str] = set()
    for key in added + changed:
        touched_tags.update(op_tags(new_ops[key]))
    for key in removed:
        touched_tags.update(op_tags(old_ops[key]))

    suggested = pages_for_tags(touched_tags)
    if suggested:
        lines.append("## Pages to review")
        lines.append("")
        lines.append(
            "Based on the tags of the changed operations, these hand-written "
            "pages most likely need an edit:"
        )
        lines.append("")
        for page in suggested:
            lines.append(f"- [ ] `{page}`")
        lines.append("")

    def render(title: str, keys: list[tuple[str, str]], src: dict) -> None:
        if not keys:
            return
        lines.append(f"## {title}")
        lines.append("")
        for method, path in keys:
            tags = ", ".join(op_tags(src[(method, path)]))
            lines.append(f"- [ ] `{method} {path}`  _(tags: {tags})_")
        lines.append("")

    render("Added endpoints", added, new_ops)
    render("Removed endpoints", removed, old_ops)
    render("Changed endpoints (params / body / responses)", changed, new_ops)

    if added_schemas or removed_schemas or changed_schemas:
        lines.append("## Schema changes")
        lines.append("")
        lines.append(
            "These component schemas moved — check any request/response field "
            "tables in the MDX that reference them:"
        )
        lines.append("")
        for name in added_schemas:
            lines.append(f"- [ ] `{name}` _(added)_")
        for name in removed_schemas:
            lines.append(f"- [ ] `{name}` _(removed)_")
        for name in changed_schemas:
            lines.append(f"- [ ] `{name}` _(changed)_")
        lines.append("")

    sys.stdout.write("\n".join(lines) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
