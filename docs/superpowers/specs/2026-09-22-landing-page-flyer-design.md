# LinkDrop Landing Page — Flyer World, Neon Voice

**Date:** 2026-09-22
**Status:** Approved for planning
**Branch:** `feat/landing-fresh`

## Context

The previous landing page (merged in `748be0d`) was rejected as generic — the same
centered-hero SaaS skeleton everyone ships. References chosen by the user: **pxxl.app**
(dark, committed color, terse lowercase voice, mascot) and **Partiful** (playful, tape-and-
sticker energy, real content, irreverent copy).

Approved direction: **Flyer world + Neon voice** — Partiful-style paper collage on
cream, written in pxxl-style blunt lowercase with mono `//` labels.

The old landing is replaced wholesale. Only `app/page.tsx` imports
`components/landing/*`, so a full swap is safe.

## Goals

- A landing page that reads like a person made it: flyer collage, stickers, tape,
  marker marks, blunt lowercase copy.
- Truthful: only shipped features are promised. No invented testimonials, counts, or
  capabilities.
- Real conversion path: claim a username → `/register?username=…` (same behavior as today).
- Verify with lint, build, and an SSR smoke test.

## Non-Goals

- No analytics, QR, custom domain, team seats, or badge-removal features (not in schema).
- No phone mockup, no fake persona profile, no fabricated reviews or press.
- No changes to product/dashboard/register flows.
- No new test framework.

## Visual Language

| Token | Value | Use |
|---|---|---|
| Cream / paper | `#f5f2e9`, `#efe9da` | page background, cards |
| Deep green | `#1b3a1b` | text, blocks, buttons |
| Gold | `#c8963e` | tape, badges, secondary CTA shadow |
| Coral | `#e2603f` | marker marks, small stickers only |
| Ink | `#1b3a1b`, muted `#5a5a48`, `#8a8a76` | text hierarchy |

- **Type:** Syne (900 display), DM Sans (body), JetBrains Mono (labels/specs),
  Georgia/system serif italic for handwritten captions.
- **Motifs:** 2–3px borders, hard offset shadows, rotated taped cards, dashed receipt
  edges, sticker pills, paper grain (subtle radial-dot texture).
- **Blob mascot:** a simple green ink-stamp blob (rounded body, two cream eyes,
  antenna) used decoratively in the hero only. `aria-hidden`.

Add to `globals.css`:

- `--color-accent-coral: #e2603f`, `--color-background-paper: #efe9da`
- Utilities: `.paper-grain`, `.tape`, `.sticker-shadow`, `.font-hand` (serif italic)

Update `landingFontClass` in `lib/fonts.ts` to
`[syne.className, dmSans.className, jetbrains.className].join(" ")`.
Do not modify product font instances or the appearance editor's font list.

## Page Structure & Copy

Copy below is final unless implementation reveals a conflict. Lowercase, blunt, no
marketing register.

### 1. Nav (sticky, 2px bottom border)

- Wordmark: `LinkDrop`
- Right: `log in` (mono, links `/login`), button `claim your name` (links `/register`)

### 2. Hero

- Gold sticker: `100% FREE. ACTUALLY.`
- H1: `stop looking like everyone else's link-in-bio.` — coral marker strike through
  `everyone else's` (inline SVG, decorative)
- Sub: `your colors, your fonts, your links. group them how you want. one minute, tops.`
- `ClaimForm` variant `hero`: prefix `linkdrop.bio/`, button `go`
- Note: `free forever · no card · nothing to cancel`
- Right: two taped theme cards, rotated:
  - `// theme 01` `@theo.codes` — pill buttons `github`, `blog`; caption `syne + forest`
  - `// theme 02` `@lume.studio` — sharp buttons `book a session`, `portfolio`;
    caption `dm serif + gold`; coral `new` sticker
- Blob ink stamp + handwritten `blob keeps an eye on it`
- Mono specs strip under a dashed rule:
  `// 18 fonts · any color · collections · multiple cards · backgrounds · free forever`

### 3. ThemeWall

- Label: `// pick a look. any look.`
- Four taped cards with pure-CSS profile previews: `neon forest`, `gold rush`,
  `ink & coral`, `pale garden` (rotations alternate, some offset vertically)
- Side note: `← or build your own from the editor. 18 fonts, any hex color, buttons, backgrounds.`
- Cards are decorative previews (no links); the side note carries the message.

### 4. HowItWorks

- Label: `// how it works`
- Dashed receipt card, three rows separated by dashed rules:
  1. `claim your name` — mono aside `linkdrop.bio/you`
  2. `pick a theme, or wreck it` — `any color. any font.`
  3. `paste your links` — `done. go outside.`
- Numbered circles: green, gold, coral.

### 5. FeatureStickers

- Label: `// what you get`
- Sticker pills/cards, each rotated slightly, hover lift: `18 fonts`, `any hex color`,
  `collections`, `multiple cards`, `background images`, `button shapes`, `live editor`

### 6. Pricing

- Label: `// pricing. no asterisks.`
- Three paper tickets (2px dashed edges, slight rotations). Pro is solid green with
  gold hard shadow and coral `most picked` sticker.
- `Free — $0` (forever): one card · all themes & fonts · collections · unlimited links
- `Pro — $9/mo` (most picked): everything in free · multiple cards · background images ·
  priority support · click analytics `(soon)` · QR codes `(soon)`
- `Business — $29/mo`: everything in pro · custom domain `(soon)` · team seats `(soon)` ·
  early access to new features
- "coming soon" is rendered as a small tag, not fine print. Nothing else may be claimed.
- CTA buttons → `/register`

### 7. FinalCta

- Green block, taped corner, headline: `your name is still available.`
- `ClaimForm` variant `final`: prefix `linkdrop.bio/`, button `claim it`
- Handwritten aside, rotated: `probably. check fast.`
- Blob stamp optional here.

### 8. Footer

- 2px top border, mono: `linkdrop — for people who hate ugly link pages`
- Links **only to routes that exist**: `log in` (`/login`), `claim your name` (`/register`).
  No terms/privacy links until those pages exist.

## Component Architecture

New or rewritten in `components/landing/`:

| File | Role |
|---|---|
| `Nav.tsx` | sticky nav, server component |
| `Hero.tsx` | hero collage + taped cards + specs strip |
| `ClaimForm.tsx` | **client** — shared claim input, `variant: "hero" \| "final"` |
| `ThemeWall.tsx` | taped theme previews, data-driven from a local array |
| `HowItWorks.tsx` | dashed receipt steps |
| `FeatureStickers.tsx` | sticker sheet |
| `Pricing.tsx` | ticket tiers, data-driven |
| `FinalCta.tsx` | green claim block |
| `Footer.tsx` | mono footer |
| `Blob.tsx` | decorative ink stamp, `aria-hidden` |

Delete (unused after swap): `ExampleModal.tsx`, `FeatureBento.tsx`, `HeroForm.tsx`
(superseded by `ClaimForm`), `PhoneMockup.tsx`, `SocialProof.tsx`,
`TemplatePreview.tsx`, `TrustBar.tsx`.

`ClaimForm` logic: identical to today's `HeroForm` — trims username, pushes
`/register?username=…` or `/register`. Each instance gets a unique input id
(`hero-username`, `final-username`) via prop.

`app/page.tsx`: compose the eight sections; wrapper gets `landingFontClass`,
paper background, and text color.

## Behavior

- Sticky nav keeps the CTA reachable.
- Hover: stickers and taped cards lift/tilt slightly (`transition-transform`).
- Coral stickers with small text (e.g. `new`, `most picked`) use a **darkened coral**
  background that reaches 4.5:1 with their text; base coral is only for decoration
  and large text.
- All motion is CSS-only and disabled by the existing `prefers-reduced-motion`
  kill-switch in `globals.css`.
- Responsive: hero two-column at `lg`, stacked below (taped cards become normal flow
  on small screens, not absolutely positioned); theme wall wraps; tickets wrap;
  nav collapses to wordmark + button on mobile.

## Accessibility

- Contrast: base coral (`#e2603f`) is for decoration, marker marks, and text no
  smaller than 18.66px bold / 24px regular. Any smaller text on coral needs a
  darkened coral that reaches 4.5:1 with its text color. Verify every pairing with
  a contrast checker during implementation and adjust the background, not the size.
- Decorative elements (`Blob`, taped-card artwork, marker SVG) are `aria-hidden`.
- Semantic structure: one `h1`, section `h2`s, `nav`/`main`/`footer` landmarks.
- Focus-visible rings on every interactive element; inputs have `sr-only` labels.
- Theme preview cards are non-interactive decoration until they become links.

## Verification

1. `npm run lint` — 0 errors (4 pre-existing warnings allowed).
2. `npm run build` — must pass.
3. SSR smoke test: `npm run start` + curl `/` and assert key strings
   (`stop looking like`, `linkdrop.bio/`, `// pick a look`, `// pricing`);
   confirm the old copy is gone.
4. Manual check of `/` in a browser at mobile and desktop widths against the
   approved mock, plus keyboard tab-through of nav, claim forms, pricing CTAs.
5. Existing tests untouched: 5 pre-existing `lib/auth-merge.test.ts` failures are
   unrelated and remain.

## Commit Plan

One commit per phase on `feat/landing-fresh`:

1. `feat(landing): add flyer tokens, utilities and fonts`
2. `feat(landing): rebuild hero, nav and shared claim form`
3. `feat(landing): add theme wall, how-it-works and feature stickers`
4. `feat(landing): add pricing tickets, final CTA and footer`
5. `chore(landing): remove old landing components`
6. Verification-fix commits if needed.

Merge to `main` only after the user reviews the final page.
