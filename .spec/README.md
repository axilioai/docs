# `.spec/` — API drift baseline

`openapi.json` here is **not** consumed by Mintlify and does not render as a
docs page. It is the baseline that `.github/workflows/api-spec-drift.yml`
diffs the production OpenAPI spec against to decide whether the
hand-written `api-reference/` pages need a human edit.

## How it stays current

1. A production backend deploy (in the `axilioai/axilio` repo) regenerates
   the customer-facing OpenAPI spec, syncs it into
   `axilioai/platform-python`, and fires a `docs-spec-updated`
   `repository_dispatch` at this repo.
2. The **API Spec Drift** workflow fetches that fresh spec, diffs it against
   this file, and — if the customer-facing surface moved — opens a
   `docs-drift/api` PR that advances this baseline and lists the changed
   endpoints.
3. A human writes the actual MDX changes on that PR branch, then merges.
   Merging advances the baseline so the next deploy diffs from here.

## Don't hand-edit

Treat `openapi.json` as machine-owned. Editing it by hand will skew the next
diff (changes will look already-applied and won't be flagged). If it ever
drifts, re-run the workflow with **Run workflow** (workflow_dispatch) to
reseed it from the live production spec.
