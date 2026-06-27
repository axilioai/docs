# `.spec/` — docs drift marker

`backend-version` records the production backend API version this repo's
reference docs have been reviewed against. It is **not** a Mintlify page.

## How it works

1. A production backend deploy ships a new API version and fires a
   `docs-spec-updated` dispatch at this repo (only when `info.version`
   actually changed).
2. `.github/workflows/api-spec-drift.yml` opens a PR on `docs-drift/v<version>`
   that bumps this marker and lists the backend PRs that drove the change.
3. A human edits the affected `api-reference/` MDX on that branch and merges.
   Merging advances the marker, which the backend uses as the floor for the
   next version's PR list.

Don't hand-edit `backend-version`; the workflow owns it.
