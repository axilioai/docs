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
**Mintlify's native type system — Inter for everything, mono for code only —
at the metrics the best docs sites ship.** Measured from Browserbase's and
Kernel's live pages: both run Inter at 18px/28px body, 36px h1 (600), 24px h2
with 48px above. Premium dev-docs typography *is* this system executed cleanly;
a custom reading font is a cost, not a differentiator. Axilio's identity lives
in the canvas (dark, sharp corners, hairlines), the emerald accent system, and
the wordmark — not in the paragraph font. IBM Plex Mono remains the brand
typeface on the marketing site and dashboard; in the docs it appears where mono
belongs: code blocks and inline-code chips.

- **No `fonts` key in `docs.json`** — the theme's Inter stack loads by default.
- **Display / headings:** Inter 600, letter-spacing -0.015 to -0.02em.
- **Code:** the theme's mono stack, code blocks and inline chips only. No mono
  in labels, table headers, or navigation.
- **Scale (implemented in `style.css`, vendor-measured):** h1 36px (2.25rem) ·
  subtitle/framer line 18px muted · h2 24px (1.5rem) · h3 20px · body 18px
  (1.125rem), line-height 1.6 · code 14px · card title 16px / card body 15px.
- **Measure:** content column capped at 46rem on lg+.
- **Rhythm:** h2 opens a section with 3rem (48px) above / 1rem below; h3
  2rem/0.6rem; paragraphs 1rem. Premium is mostly air — when in doubt, add
  space above headings, not below.

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
- No custom reading font in the docs — the theme's Inter stack at
  vendor-standard metrics; identity comes from canvas, accent, and wordmark
- No filled color-slab callouts — callouts are neutral panels with a 2px left
  accent and a tinted icon; body text stays normal foreground
- No terminal costume on the reading surface — no mono labels, no uppercase
  tracked table headers, no `//` heading prefixes in content (the wordmark and
  code keep the terminal voice)

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
  Signatures and tables, near-zero prose. The REST/OpenAPI reference lives in the
  **API Reference tab**; the **Python SDK reference is class-based** (Playwright
  model) and lives in the Drivers tab's Reference group — one page per object
  (`Client`, `Driver`, `Element`, `Screen`, `Key`).
  - **Class-based, always qualified.** The page *is* the class, and every member
    is written qualified — `element.center`, `driver.find_text()`, never bare
    `center`/`find_text`. This is the rule: a reader landing on any fragment
    (search, deep link, the TOC) must know what object it belongs to. Bare member
    names ("## Fields" with a `center` row) are the anti-pattern — they read as
    "fields of *what*?".
  - **Entry anatomy** (per method, Playwright-style): a qualified `###` heading
    with empty parens (`### \`driver.find_text()\`` — empty parens keep the auto
    anchor clean, e.g. `#driver-find_text`); a one-line imperative description;
    a signature code block; an Arguments table (`Parameter | Type | Default |
    Description`) when there's more than one arg; and a bold **Returns** line that
    links the return type to its class page. Note exceptions inline (**Raises**).
  - **Guides teach, reference lists.** Task pages (Basics) never document full
    signatures — they show the one call they're about and link the method mention
    into its reference entry (`[\`find_text\`](/driver/reference#driver-find_text)`).
    The reference never teaches the model; it points back to the guides for that.

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
| 2026-08-12 | Prose to IBM Plex Sans; mono confined to code/labels; restore display scale; quiet callouts | Side-by-side against Browserbase and Kernel, mono body + compressed scale + filled callout slabs read "terminal readme," not premium docs. Supersedes both the mono-everywhere rule and the 2026-06-27 scale shrink: the sans/mono alternation (not mono itself) is what makes dev docs scannable, and hierarchy drama (34px h1, 17px deck, 3rem section air) is what makes a page feel authored. Mono stays the signature in chrome: code, inline chips, sidebar group labels, table headers, `//` eyebrows, badges. Callouts became neutral panels with a 2px left accent. Same pass fixed pricing-tables.js id collisions with Mintlify heading anchors (`div#…` selectors) |
| 2026-08-12 | Go the rest of the way: Inter at vendor-measured metrics; mono = code only; retire the content-area terminal costume | Plex Sans at 15px with mono chrome accents still read "different" next to the vendors. Measured their live pages: both Browserbase and Kernel run Inter 18px/28px body, 36px h1 (600), 24px h2 with 48px above — Mintlify's native system. Removed the `fonts` key, matched those numbers exactly, and dropped the mono sidebar labels, mono/uppercase table headers, and `//` heading eyebrows from content. Docs identity now = dark canvas + sharp corners + hairlines + per-surface accents + wordmark; the reading surface is standard premium docs typography. Supersedes the same-day Plex Sans decision and the "No Inter" anti-slop rule |
| 2026-08-12 | Retire per-surface rainbow accents → single emerald; lift dark code surface; brighten dark body text | Side-by-side audit against the vendors found three concrete dark-mode defects: body text rendered at the maple default `rgb(159,164,162)` (dim, low-contrast, faintly green), code surfaces sat one shade off the canvas (invisible), and the violet/amber/cyan per-surface accents read as AI-slop (no premium docs site colors sections differently). Fixed: body `#d4d4d4`, code surface lifted to `#16181c` with a firmer border (repointing the copy-button fade var to match), single emerald accent everywhere. Also imposed a deliberate, consistent vertical rhythm (even block spacing, asymmetric heading margins) since the theme defaults read as choppy against our terse content |
| 2026-08-12 | Adopt Playwright's two-layer doc model for the SDK; add a class-based reference | Studied Playwright vs Browserbase. Browserbase's thin-SDK-page-plus-pointer model fits only because their SDK is a thin session client (real driving is Playwright's API). Ours, like Playwright, *is* the driving API, so it needs Playwright's model: task guides (Basics) that teach + a complete class-based reference (`Client`, `Driver`, `Element`, `Screen`, `Key`) that lists. Root-caused the "Fields for what?" confusion to bare, unqualified members on the old element/screen/key pages; the fix is class-qualified members everywhere. See the Reference-page rules in the IA section |
| 2026-06-27 | One page, one job — split dense pages into many focused ones | Pages averaged 1,000–1,900 words and mixed concept + tutorial + full API reference + essay, forcing a full read to find one thing. `concepts/*` and `guides/*` were ~90% duplicates of each other and of the API Reference tab. New model: three page types (concept / task / reference), never mixed; lead with the answer; ~150–400 words; link instead of repeat. The "Under the hood" and exhaustive-example patterns were a primary cause of bloat and are now restricted to concept pages / one recipes location |
