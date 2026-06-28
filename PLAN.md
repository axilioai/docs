# Docs Plan — Browserbase study → Axilio

Working doc (not published; see `.mintignore`). What Browserbase docs do well,
what it means for Axilio, and the IA we're moving to. Reference:
https://docs.browserbase.com (also Mintlify — every pattern is reproducible here).

## Why Browserbase is the right model
Their product maps almost 1:1 to ours:
- **browser session ≈ phone/device session** (the core resource, lifecycle-driven)
- **Stagehand ≈ MobileDriver** (natural-language, self-healing element control)
- **identity/proxies ≈ carrier/SIM/network identity**
- **concurrency/cost/latency ≈ our parallel execution + per-second billing**
- **session replay/live-view ≈ our session replay + traces** (we sell this and
  don't document it at all today)

## What they do well

### 1. IA: one core concept, exploded into a shallow subtree
Their entire "Browser" concept is ~25 small, focused pages under `/platform/browser/`:
`getting-started/` (create / use / manage / deploy / what-is-headless / managed-vs-self-hosted)
→ `core-features/` (contexts, viewports, metadata, extensions)
→ `files/` (downloads, uploads, screenshots, pdfs)
→ `long-sessions/` (keep-alive, timeouts)
→ `observability/` (live-view, recording, replay)
→ `techniques/`.
**Ours is the opposite:** `concepts/mobile-driver` is a single ~10,000px monster.
The fix is to explode each concept into a lifecycle subtree.

### 2. Lifecycle framing for the core resource
Browser session reads as a verb chain: **create → use → manage → keep-alive/timeout
→ observe**. Every page is one step. Our device session is: **allocate → drive →
manage → release**, plus long sessions, plus observability.

### 3. Page-level pattern (every concept page)
- Eyebrow + H1 + one-line subtitle
- **Definition first:** "A browser session is X, the fundamental building block of Y."
- Multi-language **code tabs** (Node / Python / cURL)
- Cross-link relentlessly instead of duplicating (links to API ref, SDK ref, related concepts)
- "Basic settings" / "Advanced features" as scannable bullet lists with bold term + one line + link
- **"Next steps"** (numbered, action-oriented) at the bottom of every page
- **Decision guidance** ("When to use Browser?" / "Search → Fetch → Browsers")
- Callouts for related-approach + warnings (rate limits)

### 4. Landing = intent-routing hub (not a wall)
Four bands, each a card row with a **custom illustration**:
entry points (Quickstart / Skills / Templates / SDKs) → platform capabilities →
use cases → build tools (Playwright / Puppeteer / Stagehand + agent frameworks).
Cards work here because they carry imagery + clear sectioning, not line-icon soup.

### 5. Use cases as a first-class section, organized by outcome
`/use-cases/`: agents, browser automation, data retrieval, automated testing.
Outcome-shaped ("what do you want to build"), not feature-shaped.

### 6. Two distinct reference surfaces
- **SDK reference** (per language: Node / Python) — hand-authored.
- **REST API reference** under `/reference/api/` — **one page per endpoint,
  OpenAPI-auto-generated** (3-pane: method badge + "Try it", typed params with
  required/ranges/child-attrs, sticky cURL + JSON response).

### 7. Optimization section
`/optimizations/`: concurrency, cost (measuring-usage, cost-optimization),
latency (multi-region, speed). Frames perf/cost as a guided topic, not scattered notes.

### 8. Mintlify features they turn on
"Copy page", AI "Ask a question" search, per-page "Was this helpful", prev/next,
"Try it" API playground, deep right-rail TOC. All free to us.

## What it means for Axilio — proposed IA

**Tab: Documentation**
- **Get started:** Introduction (single hero hub — kill the index/introduction
  dupe), Quickstart, Authentication
- **Devices & sessions** (core concept, exploded):
  - Getting started: What is a device session · Allocate a device · Drive a session
    · Manage a session · Release & lifecycle
  - Capabilities: Pinned vs shared devices · Apps & device prep · Screenshots & files
  - Long sessions: keep-alive · timeouts · rentals
  - Observability: Session replay · Traces · Live view
- **MobileDriver** (explode the monster):
  - Overview · Text selectors (find_text) · Vision selectors (find/query) ·
    Actions (tap/type/swipe) · Waits · Screen & observe · The Element type · Keys
- **Argus (vision):** Overview · Infer · Locate · Models
- **Carrier & identity:** Overview · SIMs & carriers · Networks
- **Workflows & runs:** Overview · Authoring · Triggering · Variables
- **Optimization:** Parallel execution / concurrency · Cost & usage · Latency

> Note: Browserbase has a strong outcome-shaped "Use cases" section. We are
> **not** adopting it for now (per direction) — keep the docs concept/reference/
> guide shaped, not use-case shaped.
- **Platform:** Billing · Usage · Organizations · API keys
- **Reference:** Errors · Configuration · Changelog

**Tab: API Reference**
- SDK reference (Client, MobileResource, MobileDriver, Workflows, Runs) — hand-authored
- **REST API** — OpenAPI-generated from our spec (the same spec the drift pipeline
  syncs). Add `openapi` to docs.json → per-endpoint pages + "Try it".
- Argus Vision API

## Design carry-over (already underway, AXI-1090)
Browserbase is light/orange; we are dark/IBM Plex Mono/#18E299. Keep our brand,
borrow their *structure*. The one design lesson to adopt: cards are fine when they
carry **real device imagery** (screencaps with carrier status bars), not line icons.

## Execution order (iterate on PR #2)
1. Landing hub (intro) + kill index/intro dupe.  ← highest impact
2. Explode `concepts/mobile-driver` monster into the MobileDriver subtree.
3. Build the Devices & sessions lifecycle subtree (+ Observability: replay/traces — net-new).
4. Add Optimization (concurrency / cost / latency).
5. OpenAPI-generated REST API reference tab.
6. Per-page polish pass: definition-first intros, Next steps, decision callouts,
   device imagery in cards. Design QA (cards/callouts/light/mobile) throughout.
