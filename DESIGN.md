# Design System — Axilio Docs

The documentation site is one surface of Axilio. It must look like the product,
not like a docs template. This file is the source of truth for every visual
decision. Read it before changing anything visual; flag any code that deviates.

## Product Context
- **What this is:** Documentation for Axilio — programmatic access to real,
  physical Android phones on live carrier networks, driven by a vision-native
  Python SDK. "The phone cloud for agents."
- **Who it's for:** Developers building mobile automation and AI agents.
  Terminal-comfortable, read code fluently, skeptical of marketing.
- **Sibling surfaces (the brand already exists here):**
  - Marketing site `axilio.ai` — dark, IBM Plex Mono throughout, electric green,
    device-firmware chrome (`AXL-R1 // STANDBY`, `//SECTION` markers).
  - Dashboard `axilio/frontend` — Next.js + Tailwind v4 + shadcn. `app/layout.tsx`
    sets IBM Plex Mono on the whole `<body>` and `defaultTheme="dark"`. Surface
    tokens are the neutral shadcn oklch scale.
- **The rule:** the docs match these. They are the reference, not this file's
  invention.

## Aesthetic Direction
- **Direction:** operations console for real infrastructure. Dark, precise,
  terminal-native. Reads like an instrument panel, not a brochure.
- **Decoration level:** minimal. Type, hairline rules, and one electric green do
  the work. No gradients, glassmorphism, blobs, or decorative illustration.
- **Mood:** you are looking at live hardware on the other end of an API call.
- **Reference:** https://axilio.ai (match it)

## Typography
IBM Plex Mono everywhere — it is the Axilio typeface (both sibling surfaces use
it for their entire body). Monospaced body is the deliberate, on-brand choice for
this terminal-comfortable audience; tune it for readability rather than replacing
it.

- **Display / headings:** IBM Plex Mono, 600 (700 for the hero `h1`).
- **Body / UI / labels:** IBM Plex Mono, 400.
- **Code:** IBM Plex Mono, 400. Distinguished from prose by the code block
  surface + syntax color, not by a different family.
- **Loading:** IBM Plex Mono is a Google Font — load via Mintlify's font config
  (`docs.json` → `fonts`). The previous `font` block was silently ignored; verify
  the computed font is actually IBM Plex Mono, not Inter.
- **Readability tuning (required, since body is mono):**
  - Root stepped down to **15px** (from the maple 16px default) so the whole
    surface matches the dense sizing on axilio.ai + the dashboard, which run
    mostly `text-xs` (12px) / `text-sm` (14px) mono. The maple defaults read
    "blown up" against the rest of the brand.
  - Body size **14px**, line-height 1.65
  - Measure capped ~72ch
  - Headings tighter: line-height ~1.15, letter-spacing -0.01em
- **Scale:** h1 ~29px (1.95rem) / h2 ~22px (1.45rem) / h3 ~17px (1.15rem) /
  body 14px / code 13px. Implemented in `style.css`, not just specified here.

## Color
Dark-first. The canvas, surfaces, and borders are a neutral near-black grayscale
(matching the dashboard's oklch scale exactly); green is the only chroma and is
used sparingly as signal.

The accent is the **product UI emerald**, taken from the dashboard + landing code
(`text-[#10b981]`, emerald-500), not the logo fill. The logo mark is `#18E299`;
the *interface* green everywhere in `axilio/frontend` is `#10B981` with `#34D399`
hover. The docs match the interface.

### Dark mode (primary)
- **Canvas / background:** `#0A0A0A` (oklch 0.145 0 0) — `bg-[#0a0a0a]` in the app
- **Surface / card / code block:** `#1A1A1A` (oklch 0.205 0 0); hairline borders
  use `#1A1A1A` or `rgba(255,255,255,0.10)`
- **Hover surface:** `#0D0D0D`
- **Text primary:** `#FAFAFA` (oklch 0.985) · **muted:** `#A3A3A3` / `#737373`
- **Accent (emerald-500):** `#10B981` — active nav, links, inline-code accent,
  focus rings, "live" badges, primary buttons. ≤ ~2% of surface area; signal,
  not decoration.
- **Accent hover/light:** `#34D399` (emerald-400)
- **Accent deep:** `#059669` (emerald-600) — pressed/filled base, light-mode links

### Light mode (secondary, supported not primary)
- Background `#FFFFFF`, surface `#FAFAFA`, border `rgba(0,0,0,0.10)`
- Text primary `#0A0A0A`, muted `#5C5C5C`
- **Links/accent on white:** `#059669` (emerald-500 is too light on white for text)

### Semantic (from the dashboard status pills)
- running `#60A5FA` (blue-400) · success `#10B981` · failed `#F87171` (red-400)
  · queued/warning `#FBBF24` (amber-400) · neutral `#262626`/`#A3A3A3`

### Retired
- `#7bcab0` (old pale mint) and `#18E299` as a UI accent — the logo keeps `#18E299`,
  but the interface accent is `#10B981`.

## Signature motifs (port from axilio/frontend)
These are the patterns that make the product look like Axilio. Reproduce in docs
CSS/MDX:
- **`//section` eyebrows** — green code-comment prefix on section labels/headers.
  Marketing: `<span opacity-50>//</span> THE PHONE CLOUD`, uppercase, `tracking-[0.15em]`,
  emerald. Docs: prose `h2` is prefixed with a muted-green `// ` via CSS.
- **Hairline everything** — 1px borders in `#1A1A1A` / `neutral-800` / `white/10%`.
- **`gap-px` card grids** — cards on a `neutral-800` background with `gap-px` so the
  gaps read as seamless hairline dividers (no heavy card borders).
- **Status dots** — 2px circles: emerald (online), amber (busy, pulsing), red
  (offline), blue (running).
- **Mono uppercase labels** with `tracking-[0.1em–0.15em]` for eyebrows/metadata.
- **Soft green glow** on accent hover: `0 0 20px rgba(16,185,129,0.2)`.
- **Terminal chrome** — block header with three 2px dots (one emerald) + an
  uppercase mono title.
- **Active border-left** — `border-l-2 border-l-emerald-500` on the selected item.
- **Device-firmware chrome** — `AXL-…` / `SIM-…` codes, `// STANDBY` status (use on
  device-state strips / imagery).

## Spacing
- **Base unit:** 4px
- **Density:** comfortable, slightly tight (technical, not airy)
- **Scale:** 2xs 2 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64

## Layout
- **Approach:** grid-disciplined, left-aligned. Technical content is never
  centered.
- **Max content width:** ~720px measure for prose; full width for tables/code.
- **Border radius:** zero, everywhere. Sharp corners site-wide are Axilio's bold
  global signature. Reinforces the instrument-panel read: no pill shapes, no
  rounded SaaS chrome. Enforced once in `style.css` with a global
  `border-radius: 0` rule, not per-element.
- **Signature patterns:**
  - **`//section` markers** — section headers prefixed with a muted `//` comment,
    matching the marketing site (`//PRODUCT`, `//WHY AXILIO`).
  - **Device-state strips** replace card grids: a row showing a real Android
    screencap + session/carrier metadata + the exact SDK call that produced it.
    Reach for rows, tables, code blocks, and strips before cards.
  - **Real device imagery only** — Android screencaps with real carrier status
    bars. Never abstract/floating phone mockups or stock illustration.
  - **Hairline dividers** between sections instead of heavy cards.

## Motion
- **Approach:** minimal-functional. Only transitions that aid comprehension.
- **Easing:** enter ease-out, exit ease-in, move ease-in-out
- **Duration:** micro 80ms · short 160ms · medium 240ms. No scroll choreography.

## Anti-slop (do not ship)
- No card-soup grids as the primary layout element
- No purple/blue gradients, neon glows, or gradient buttons
- No centered-everything marketing hero that buries the docs
- No pale mint as body text; green is accent only
- No abstract phone illustrations — real device screencaps only
- No Inter/Roboto/system fonts — IBM Plex Mono is the typeface

## Information architecture — one page, one job
The single most important rule, and the one the docs most often broke: **every
page does exactly one job.** A reader who wants one thing must never have to read
two other things to find it. Pages are short (one scroll, ~150–400 words) and
plentiful — many focused pages beat a few dense ones.

There are exactly three page types. Never mix them on one page.

- **Concept page** — explains *one* idea and its mental model, for the evaluator
  who wants to understand X before committing. ~250–400 words. A diagram or a
  3-bullet loop, a "when to use what" comparison, and links out to the tasks that
  use it. **No full API surface, no step-by-step tutorial.**
- **Task page** — walks *one* outcome, for the builder. ~150–350 words. Lead with
  the canonical snippet; one or two sentences on the key parameter or gotcha;
  done. One job per page — if it needs a second `##` for a genuinely different
  task, that's a second page.
- **Reference page** — pure lookup, for the experienced user who forgot a param.
  Signatures and tables, near-zero prose. Most reference lives in the **API
  Reference tab**; Docs-tab pages link into it rather than repeating it.

**Hard rules that keep pages honest:**
- **Lead with the answer.** First screen = what the page does + the canonical
  snippet. No backstory, no "in this guide we will…", before the code.
- **Don't repeat the API.** The API Reference tab is the source of truth for full
  signatures and field tables. A task page shows the one call it's about and links
  to the reference for the rest. Never re-document a whole resource in a guide.
- **One "complete example" for the whole product**, in a single recipes/quickstart
  location — not pasted at the bottom of every page.
- **"Under the hood" is opt-in and lives only on concept pages**, as a short final
  section for the curious. Never wedge mechanism essays into a task page.
- **If two pages would say the same thing, write it once and link.** The old
  `concepts/*` and `guides/*` overlap is the anti-pattern: same content, three
  places. Concept explains; tasks link to the concept.

## Voice & content patterns
The look is the instrument panel; the *writing* is the operator's manual — plain,
direct, and confident, written by someone who has actually run this in production.

- **Framer line.** Every page opens with one tight sentence under the title that
  says what the page is and who it's for — not a marketing paragraph. Then get to
  the work. ("Allocate a device and guarantee it's released." not "In this
  comprehensive guide we will explore…")
- **Second person, active voice, present tense.** "You allocate a device." Use
  "we" for platform behavior ("we bill per second"). Contractions are fine.
- **Explain the why in one line, not a paragraph.** State the mechanism behind the
  one thing this page does, so the reader can reason past the docs — but keep it
  to a sentence on a task page. Deep mechanism goes on the concept page's "Under
  the hood", never on tasks.
- **Numbered `<Steps>` for procedures**, with a bolded lead per step, one action
  each. Inline-comment code so each line earns its place.
- **`## Common issues`** — optional short troubleshooting near the end of a task
  page: symptom → cause → fix, as a tight list or `<AccordionGroup>`. Real failure
  modes only. Keep it to the issues specific to *this* task.
- **Pro tips** — a `<Tip>` for one piece of non-obvious earned advice; a short
  bulleted list (bolded lead + one sentence) for several. Don't pad.
- **Callouts:** use Mintlify's themed components (`<Note>`, `<Tip>`, `<Warning>`,
  `<Info>`, `<Check>`). Reserve `<Warning>` for things that cost money, leak
  secrets, or strand a device.
- **Reference tables** for anything enumerable (errors, statuses, params). Tables
  over prose whenever the data is structured.
- **Cross-link generously.** Every concept the reader might not know links to its
  page on first mention. Dead-ends are a bug — but a link is how you keep a page
  short, so link instead of re-explaining.
- **Code is the source of truth.** Show the real call, runnable, with the import.
  Use `<CodeGroup>` tabs for genuine variants (lifecycle styles), never to pad.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-27 | Adopt dark-first IBM Plex Mono + #18E299 system | Match the existing brand on axilio.ai and axilio/frontend; the docs were the only off-brand surface |
| 2026-06-27 | Retire #7bcab0 | Not a real brand color; logo fill is #18E299 |
| 2026-06-27 | Sharp corners site-wide (radius 0) | One bold global move; mono + sharp is Axilio's signature. Supersedes the earlier 4/6/8px radius scale |
| 2026-06-27 | Principled CSS over !important soup | Identity comes from config + a few global rules (no-radius) + minimal targeted fixes. Reset our aggressive overrides to match this discipline |
| 2026-06-27 | Operator's-manual voice + content patterns | Studied a set of production engineering runbooks: direct voice, framer lines, explain-the-why, "Under the hood", "Common issues", pro tips. Codified as the writing standard; keep Mintlify themed callouts over raw GitHub blockquotes |
| 2026-06-27 | Shrink the type scale to match the front-end | The maple defaults (~16px body, large headings) rendered "blown up" next to axilio.ai + the dashboard, whose UI text is mostly 12–14px mono. The prescribed scale was never actually implemented in CSS. Stepped root to 15px + explicit 14px body / smaller headings in `style.css`; updated the scale here to match what ships |
| 2026-06-27 | One page, one job — split dense pages into many focused ones | Pages averaged 1,000–1,900 words and mixed concept + tutorial + full API reference + essay, forcing a full read to find one thing. `concepts/*` and `guides/*` were ~90% duplicates of each other and of the API Reference tab. New model: three page types (concept / task / reference), never mixed; lead with the answer; ~150–400 words; link instead of repeat. The "Under the hood" and exhaustive-example patterns were a primary cause of bloat and are now restricted to concept pages / one recipes location |
