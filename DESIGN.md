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
  - Body size 15px, line-height 1.7
  - Measure capped ~72ch
  - Headings tighter: line-height ~1.15, letter-spacing -0.01em
- **Scale (px):** h1 40 / h2 28 / h3 20 / body 15 / small 13 / code 13.5

## Color
Dark-first. The canvas, surfaces, and borders are a neutral near-black grayscale
(matching the dashboard's oklch scale exactly); green is the only chroma and is
used sparingly as signal.

### Dark mode (primary)
- **Canvas / background:** `#0A0A0A` (oklch 0.145 0 0)
- **Surface / card / code block:** `#1A1A1A` (oklch 0.205 0 0)
- **Border / hairline:** `rgba(255,255,255,0.10)`
- **Text primary:** `#FAFAFA` (oklch 0.985 0 0)
- **Text muted:** `#A1A1A1` (oklch 0.708 0 0)
- **Signal green (accent):** `#18E299` — the logo fill. Active nav, links, inline
  code accent, focus rings, "live" badges, primary buttons. Target ≤ ~2% of
  surface area; it is signal, not decoration.
- **Deep green:** `#0C8C5E` — hover/pressed states, success, filled-button base.

### Light mode (secondary, supported not primary)
- Background `#FFFFFF`, surface `#FAFAFA`, border `rgba(0,0,0,0.10)`
- Text primary `#0A0A0A`, muted `#5C5C5C`
- **Links/accent on white:** `#0C8C5E` (the electric `#18E299` fails contrast on
  white — never use it for text/links in light mode; reserve it for badges/fills)

### Semantic
- success `#18E299` · warning `#F5BE41` · error `#FF6B5F` · info `#5FB7FF`

### Retired
- `#7bcab0` (the old pale mint) — removed. It is not a brand color.

## Spacing
- **Base unit:** 4px
- **Density:** comfortable, slightly tight (technical, not airy)
- **Scale:** 2xs 2 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64

## Layout
- **Approach:** grid-disciplined, left-aligned. Technical content is never
  centered.
- **Max content width:** ~720px measure for prose; full width for tables/code.
- **Border radius:** small and consistent — sm 4px / md 6px / lg 8px. No pill
  shapes, no uniformly-bubbly corners.
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

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-27 | Adopt dark-first IBM Plex Mono + #18E299 system | Match the existing brand on axilio.ai and axilio/frontend; the docs were the only off-brand surface |
| 2026-06-27 | Retire #7bcab0 | Not a real brand color; logo fill is #18E299 |
