# Axilio Docs — Writing & Structure Guide

> The source of truth for **how we write and organize documentation**.
> `DESIGN.md` covers the visual system (theme, colors, fonts, CSS); this covers
> information architecture, page structure, voice, and components.
>
> Derived from a deep teardown of the Browserbase documentation (a gold-standard
> Mintlify reference and a near-1:1 analog: browser cloud -> phone cloud). The
> goal is not to clone every Browserbase page. The goal is to adopt the patterns
> that make the docs feel coherent while preserving enough flexibility for
> reference pages, tutorials, landing pages, and edge-case guides to do their jobs.

---

## 0. The one-paragraph summary

Great product docs separate **three modes of reading** into three top-level tabs:
*learn* (Docs), *integrate with my stack* (Integrations), and *look up an exact
signature* (API & SDK). Within the learn tab, groups are ordered by the user's
**journey and capability maturity**, not alphabetically or by internal team.
Every hand-written Axilio page must lead with a clear payoff, use second-person
present-tense language, and point readers to a useful next action. Most concept
and task pages should follow the standard arc: **payoff -> concept ->
implementation -> tradeoffs -> next step**. Reference pages are generated from
an OpenAPI spec where possible, with hand-written prose reserved for overviews,
SDK guides, and high-search workflows. URL changes are absorbed by an
ever-growing **redirects** table so links never break.

### Consistency model

Consistency comes from shared decisions, not identical page shapes. Use this
guide in three layers:

| Layer | Meaning | Examples |
|---|---|---|
| **Required** | Every hand-written Axilio docs page must do this unless technically impossible. | Clear frontmatter, payoff-first opening, contextual links, no broken URLs. |
| **Default** | Use this unless the page type has a better established shape. | Next-step cards, multi-language tabs, bold-led bullets, callouts. |
| **Optional** | Use when it helps the reader; skip when it adds ceremony. | Accordions, screenshots, CodeGroup nesting, SEO `keywords`/`boost`. |

---

## 1. Macro-organization: tabs = reader intent

Split the whole site by *why someone showed up*, not by how the company is organized.

| Tab | Reader's intent | Content type | Update cadence |
|---|---|---|---|
| **Docs** | "Teach me the platform / help me do a thing" | Conceptual + task guides | Frequent, hand-written |
| **Integrations** | "Make it work with *my* stack" | Templated per-partner guides | Per partner |
| **API & SDK** | "Give me the exact signature" | Auto-generated reference + curated SDK pages | Generated from spec |
| **Changelog / Dashboard ↗** | "Take me elsewhere" | External links (mark with ↗) | n/a |

**Why it matters:** these three have completely different shapes, voices, and
update rhythms. Mixing them is the #1 cause of docs that feel incoherent. Keep
them physically separate.

**Axilio mapping:** We already have `Docs` + `API Reference`. Keep that split.
Add an `Integrations` tab only when we actually have partner/framework guides to
template (don't create an empty shell).

---

## 2. Group order = the user's journey

Inside the **Docs** tab, order groups by capability maturity so a new reader can
read top-to-bottom and naturally level up. Browserbase:

`Welcome → Platform → Use cases → Optimization → Account`

(get in → learn the primitives → see what to build → make it good → manage the relationship)

**Axilio's current order is already journey-shaped — keep it:**

`Get Started → Devices → Controlling the Device → Workflows & Runs → Scaling → Guides → Account & Billing → Reference`

Rules:
- Every group gets an **icon** (`rocket`, `mobile`, `hand-pointer`, `diagram-project`, `bolt`, `book`, `credit-card`, `code`).
- Nest at most **three levels** of grouping.
- Each leaf cluster is a **noun the product actually has**; the pages inside it are **verbs/tasks** on that noun.
  - e.g. `Devices` (noun) → `Allocate`, `Discover`, `Timeouts` (tasks).

---

## 3. The title / sidebarTitle split

Two different jobs, two potentially different strings. **Diverge when the H1
needs more context than the sidebar can carry.**

```yaml
title: "Find an element with vision"   # the H1 + SEO title — descriptive, searchable
sidebarTitle: "Find with vision"        # the nav label — short, positional
```

- `title` — descriptive and keyword-rich. This is what Google and the page H1 show.
- `sidebarTitle` — short and positional. This is what the sidebar shows; keep it
  scannable next to its siblings.
- It is fine for `title` and `sidebarTitle` to match when the title is already
  short and unambiguous (`Screenshots`, `Timeouts`, `Python SDK`).
- A section's **landing page** is titled with the concept but its `sidebarTitle`
  is `"Overview"`. So the sidebar reads `Identity > Overview, Proxies, Auth…`
  while the page/SEO title is "Agent Auth & Identity."

### Frontmatter fields we use

| Field | When | Notes |
|---|---|---|
| `title` | always | descriptive H1 / SEO |
| `sidebarTitle` | always | short nav label |
| `description` | always | 1 sentence, **value-first**, doubles as meta description (SEO) |
| `icon` | optional | for pages surfaced as cards / nav with icons |
| `mode: "wide"` | homepage only | full-width card-grid landing pages |
| `keywords` | high-traffic pages | synonyms users search ("close session, end session, terminate") |
| `boost` | high-traffic pages | bumps search ranking (e.g. `boost: 4`) |

Write `description` value-first and specific, e.g.
*"Extract structured data from any website at scale — with Verified, proxy
rotation, and CAPTCHA solving."* Not *"This page is about data extraction."*

If a generated API page only contains `openapi:` frontmatter, the generated
reference can omit `title`/`sidebarTitle`/`description`. Hand-written pages should
include all three.

---

## 4. Voice — how we write

Required across **every hand-written** page:

- **Second person, imperative, present tense.** "Create a session," "you'll
  receive a connection URL." Never "the user can."
- **Lead with the payoff, then the mechanism.** Open every page with 1–3
  sentences of *what this is and why you care* before any UI or code.
  > *"A browser session represents a single browser instance running in the
  > cloud. It's the fundamental building block of Browserbase, providing an
  > isolated environment for your web automation tasks."*
- **Short declarative sentences.** Keep paragraphs tight. Use bullets for
  parallel facts and numbered lists for sequences.
- **Bold-led bullets** — `- **Stay logged in**: sessions persist across runs…`
  The bold is the scannable claim; the rest is the proof. Use this when bullets
  need scanning, not for every list.
- **Systems voice, zero hype.** Explain *trade-offs*
  ("reserve this optimization for sites where bot protection is not present"),
  not adjectives. Marketing voice appears **only** in CTA cards.
- **Every cross-reference is a contextual link** — `[contexts](/path)`, never
  "click here." Pages should be densely interlinked when there are useful
  related pages; do not force links that add no context.
- **State the thesis with a number or contrast.** Browserbase:
  *"Agents need the full web. Traditional APIs only cover ~15% of it."*
  Axilio's equivalent: the mobile app surface that has **no API at all**.

---

## 5. Page shapes (internalize this most)

Most **concept/feature pages** follow this default arc:

1. **Frontmatter** — `title`, `sidebarTitle`, `description` (+ optional `icon`/`mode`/`keywords`/`boost`).
2. **One-paragraph hook** — what + why, with inline links.
3. **Optional callout up top** — `<Info>` for an alternate path/upsell, or
   `<Warning>` for a gotcha (rate limits, prerequisites).
4. **`<CardGroup>` of sub-features** — if this is a section landing page, the
   page *is* a navigation hub.
5. **Concept section** — prose + often a `<Frame>` screenshot/video + a
   bold-led benefit list.
6. **Implementation sections** — each is `prose -> code -> explanation` or
   `prose -> <Tabs>(Python / Node / cURL) -> code` when multiple supported
   languages exist. Primary examples must be copy-pasteable: full imports,
   `os.environ[...]` for keys, and no `...` elisions.
7. **Best practices** — dos/don'ts and edge cases; use `<Accordion>` for
   progressive disclosure of the long tail.
8. **Next action** — usually a closing `<CardGroup cols={2-3}>` of 2-6
   contextual links. Short task pages can use a sentence or numbered list. The
   invariant is: **no dead ends**.

Different page types have different shapes:

| Page type | Required shape | Notes |
|---|---|---|
| **Homepage** (`mode: "wide"`) | Short positioning paragraph + task/platform/use-case cards | Use prose sparingly; cards should carry most navigation. |
| **Section landing** | Hook + `<CardGroup>` hub + short overview | Optimize for orientation and routing. |
| **Concept page** | Hook + mental model + tradeoffs + next action | Code is optional unless the reader naturally needs it. |
| **Task page** | Prerequisites + `<Steps>` or numbered sections + code/screenshots + next action | Prefer a working path over exhaustive explanation. |
| **SDK guide** | Install + basic usage + configuration + links to package/source | Hand-written narrative, Python first for Axilio. |
| **Generated API page** | `openapi:` frontmatter | Add hand-written prose only for high-search workflows. |
| **Troubleshooting/reference page** | Symptom/key -> explanation -> fix | Tables and accordions are often better than the default arc. |

### Naming conventions (so the structure scales)

| Purpose | Filename | sidebarTitle |
|---|---|---|
| Section landing / concept hub | `overview.mdx` | `Overview` |
| Per-partner concept page | `introduction.mdx` | `Introduction` |
| Procedure | `quickstart.mdx` / `setup.mdx` | `Quickstart` / `Setup` |
| Language-specific | `python.mdx` / `nodejs.mdx` | the language |
| Specific tutorial | verb-noun, e.g. `build-a-flight-booker.mdx` | descriptive |

---

## 6. The component toolkit

Ranked by frequency in the Browserbase corpus (use this as your palette):

| Component | ~Count | Use for |
|---|---|---|
| `Card` / `CardGroup` | 380 / 116 | navigation hubs + "next steps" — the workhorse |
| `Tab` / `Tabs` | 295 / 135 | language/framework switching on **code** |
| `Step` / `Steps` | 182 / 47 | numbered procedures |
| `CodeGroup` | 106 | multiple code blocks behind tabs (nested *inside* a `<Tab>`) |
| `Note` / `Info` / `Warning` / `Tip` | 104 / 53 / 27 / 16 | callouts, by severity |
| `Accordion` / `AccordionGroup` | 87 / 13 | progressive disclosure of edge cases |
| `Frame` | 66 | wraps every screenshot/video |
| `Columns` | 6 | homepage-only wide grids |

### Idioms

- **Callout semantics are stable — choose the component by reader need:**
  - `Info` = alternate path / upsell ("Looking to deploy? Functions let you…")
  - `Note` = helpful context
  - `Warning` = gotcha / security / rate-limit
  - `Tip` = pro move
  - `Callout` = custom CTA, template link, or integration-specific callout when
    Mintlify's standard severities do not fit.
- **Code-fence labels are tab labels:** ```` ```python Stagehand ```` — the word
  after the language names the tab inside a `CodeGroup`.
- **Nesting axis:** `Tabs(language) → CodeGroup(library/variant) → fenced code`.
  Language is the outer axis, library the inner. If there is only one language or
  one meaningful variant, skip the extra component.
- **`<Frame>` wraps product media.** Videos are `autoPlay loop muted playsInline controls`.
  Images live at `/images/<category>/<name>.png`; no caption unless the context is
  ambiguous and surrounding prose cannot carry it.
- **Primary code is copy-pasteable in full:** real imports,
  `os.environ["AXILIO_API_KEY"]`, no `...` elisions in the first working example.
  Later snippets can be partial when they clearly build on the primary example.

### Canonical snippets

**Concept landing page (hub):**
```mdx
---
title: "Agent Auth & Identity"
sidebarTitle: "Overview"
description: "How Axilio works with … to give your agents verified access."
---

<CardGroup cols={2}>
  <Card title="Proxies" icon="server" href="/platform/identity/proxies">
    Route traffic through residential or datacenter proxies for reliability.
  </Card>
  <Card title="Authentication" icon="lock" href="/platform/identity/authentication">
    Handle 2FA, OAuth, and other auth challenges in automated sessions.
  </Card>
</CardGroup>

## Overview

<one-paragraph hook, value-first, with inline links>
```

**Multi-language code block:**
```mdx
<Tabs>
  <Tab title="Python">
    ```python
    from axilio.platform import Client
    client = Client()  # reads AXILIO_API_KEY from env
    ```
  </Tab>
  <Tab title="Node.js">
    ```typescript
    import { Client } from "@axilio/sdk";
    const client = new Client();
    ```
  </Tab>
</Tabs>
```

**Closing "Next steps":**
```mdx
## Next steps

<CardGroup cols={3}>
  <Card title="MobileDriver" icon="mobile" href="/driver/overview">
    Explore the full selector and action API.
  </Card>
  <Card title="Workflows & Runs" icon="diagram-project" href="/workflows/overview">
    Package your automation as a reusable workflow.
  </Card>
</CardGroup>
```

---

## 7. Reference is generated first

API reference pages are generated from an OpenAPI spec wherever the public API
has a stable spec entry. A generated endpoint page is usually one line of
frontmatter:

```yaml
---
openapi: post /v1/sessions
---
```

Mintlify renders params, request body, responses, and language examples from the
spec. Hand-write prose **only** on high-traffic endpoints or workflows where the
raw signature is not enough. When you do, add `keywords:` (synonyms) and `boost:`
to win search.

Splits to copy:
- **API pages = generated** from the spec (single source of truth).
- **SDK pages = hand-written narrative**: install → basic usage → config examples
  with inline comments → `CardGroup` to GitHub/PyPI/npm.
- **An API overview page** does the one thing generated pages can't: explains
  **auth** (the header/key), the **base URL**, and the mental model, with a
  `CodeGroup` of Python/Node/cURL.

**Axilio:** We already have `.spec/` + an API-drift CI workflow. Wire `openapi:`
frontmatter for API endpoints that exist in the spec, and keep SDK guides,
overview pages, and conceptual reference hand-written.

---

## 8. The integrations template (when we add it)

Every partner = a folder with `introduction.mdx` (+ `quickstart.mdx` / `setup.mdx` / `<language>.mdx`).

**Introduction formula:**
> *"[Service] is [one-line what-it-is]. With [Service] and Axilio, you can
> [concrete outcome]."* → key-features `CardGroup` → CTA `CardGroup` to the quickstart.

**Quickstart:** `<Steps>` (optionally inside `<Tabs>` for language). Each step =
explanation + code/screenshot. End with a useful next action, usually a "Next
steps" `CardGroup`.

**Hub page** (`get-started.mdx`): lists all integrations as cards + a "request an
integration" link.

New partner = copy the template, fill two files.

---

## 9. Infrastructure discipline

- **Redirects are a first-class asset.** Browserbase keeps a large number of
  redirect entries in `docs.json`. Every reorg adds redirects instead of breaking links —
  this is why their IA could evolve freely without SEO damage. **Add a redirect
  for every URL we change during the rewrite.**
- **Snippets for reused messaging.** Put shared chunks in `/snippets/*.mdx` and
  import them (`import X from "/snippets/x.mdx"` → `<X/>`). Reuse *messaging*
  (e.g. "get your API key", region warnings), not code.
- **`description` is SEO.** Write it value-first; it's the meta description.
- **Check links before shipping.** Run `mintlify broken-links` in the
  contributing flow.
- **Auth-aware nav + analytics** can be injected via `scripts` in `docs.json`
  (e.g. swap a "Sign up" CTA based on a session cookie; wire PostHog/GTM).

---

## 10. Axilio content requirements

These are the consistency guarantees. Do these even when the page shape varies.

- **Prerequisites before action.** Before code or UI steps, state the required
  account, API key, SDK/package, device availability, app install, permissions,
  or third-party credential.
- **Tradeoffs over claims.** Explain when to use the feature and when not to:
  real device vs emulator, workflow vs direct driver control, text selector vs
  vision selector, sandbox run vs production run.
- **Limits are visible.** Surface beta/private-preview status, plan limits,
  rate limits, device/platform constraints, region constraints, timeout behavior,
  and billing impact near the first relevant action.
- **Examples match the actual SDK.** Python is primary. Do not invent method
  names, imports, package names, environment variables, or response shapes. Link
  to generated reference when the example depends on a formal API contract.
- **Screenshots prove UI-dependent steps.** Use product screenshots when the
  reader must recognize a dashboard state, live device view, workflow run, or
  error surface. Keep them in `/images/<category>/<name>.*`.
- **Every page has a next action.** A card grid is the default for concept and
  landing pages. A sentence, list, or link can be better for reference and short
  task pages.

---

## 11. Rewrite checklist (per page)

- [ ] `title` descriptive/searchable; `sidebarTitle` short/positional when needed.
- [ ] `description` is one value-first sentence, unless generated from `openapi:`.
- [ ] Opens with a payoff hook in second-person present tense, unless generated from `openapi:`.
- [ ] Prerequisites and limits are stated before the reader can hit them.
- [ ] Concepts before mechanics; trade-offs over adjectives.
- [ ] Bold-led bullets; short sentences.
- [ ] Primary code examples are copy-pasteable in full; multi-language tabs are used only when supported.
- [ ] Callouts use stable `Info`/`Note`/`Warning`/`Tip`/`Callout` semantics.
- [ ] Contextual inline links are used where they help; no "click here."
- [ ] Ends with a useful next action — no dead end.
- [ ] If a URL moved, a redirect was added to `docs.json`.

---

## Appendix — Axilio-specific notes

- **Thesis line to write:** the mobile/app surface agents need has **no API at
  all** — phrase it with a concrete, contrarian, numeric claim like Browserbase's
  "~15% of the web has an API."
- **Primary language is Python** (the `axilio` SDK); make Python the first/default
  tab, Node/cURL secondary where they exist.
- **Reuse the journey order already in `docs.json`** — it's correct; the work is
  in the page *content*, not the nav.
- **Keep all styling** (`docs.json` theme, `style.css`, `DESIGN.md`) — this guide
  governs words and structure only.
