# Landing Page — Flyer World, Neon Voice: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Dropcard landing page with the approved "Flyer world, Neon voice" design — cream paper collage, taped cards, stickers, blunt lowercase copy.

**Architecture:** Full replacement of `components/landing/*` plus `app/page.tsx`. New components are built alongside the old ones (build stays green), then the page is swapped and old files deleted. One shared client `ClaimForm` serves the hero and final CTA; everything else is a server component.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4 (`@theme` tokens + plain CSS utilities in `app/globals.css`), `next/font` (Syne, DM Sans, JetBrains Mono), lucide-react not required by this design.

**Spec:** `docs/superpowers/specs/2026-09-22-landing-page-flyer-design.md`
**Visual reference (approved):** `docs/superpowers/specs/2026-09-22-landing-page-flyer-mock.html` — open in a browser; colors, rotations, stickers, and density come from it.

## Global Constraints

- **No test framework additions.** This repo has no component-test setup and the spec forbids adding one. Each task's gate is `npm run lint` (0 errors; 4 pre-existing warnings allowed) + `npm run build`.
- **Copy is final and verbatim from the spec.** Lowercase, blunt. Do not add marketing copy, testimonials, user counts, analytics, QR, custom-domain, or team features.
- **Palette:** cream `#f5f2e9` / paper `#efe9da`, deep green `#1b3a1b`, gold `#c8963e`, coral `#e2603f` (decoration and large text only), darkened coral `#b8401f` token `accent-coral-dark` for small stickers with white text.
- **Fonts:** Syne = display (`var(--font-syne)`), DM Sans = body (`var(--font-dm-sans)`), JetBrains Mono = labels (`var(--font-jetbrains)`), Georgia italic = handwritten (`.font-hand`).
- **Landing is cream/light only** — no `dark:` variants in landing components.
- **Real routes only:** `/login`, `/register`, `/`. No placeholders, no dead links.
- **Reduced motion** is handled globally in `globals.css`; do not add per-component media queries.
- **Commit after each task** on `feat/landing-fresh`.

---

### Task 1: Tokens, landing utilities, fonts

**Files:**
- Modify: `app/globals.css` (theme block ~line 6–17; append after the noise section at end)
- Modify: `lib/fonts.ts:120` (`landingFontClass` export)

**Interfaces:**
- Produces: Tailwind colors `accent-coral`, `accent-coral-dark`, `background-paper`; CSS classes `.paper-grain`, `.tape`, `.sticker-shadow`, `.sticker-shadow-gold`, `.font-hand`; `landingFontClass` string that defines `--font-syne`, `--font-dm-sans`, `--font-jetbrains` for a subtree.

- [ ] **Step 1: Add theme tokens**

In `app/globals.css` inside `@theme`, after `--color-accent-gold: #c8963e;`, add:

```css
  --color-accent-coral: #e2603f;
  --color-accent-coral-dark: #b8401f;
  --color-background-paper: #efe9da;
```

- [ ] **Step 2: Append landing utilities**

At the end of `app/globals.css`, add:

```css
/* ── Flyer landing ───────────────────────────────────────── */
.paper-grain {
  background-image: radial-gradient(rgba(27, 58, 27, 0.05) 1px, transparent 1px);
  background-size: 7px 7px;
}

.tape {
  background: rgba(200, 150, 62, 0.55);
  pointer-events: none;
}

.sticker-shadow {
  box-shadow: 3px 3px 0 rgba(27, 58, 27, 0.2);
}

.sticker-shadow-gold {
  box-shadow: 3px 3px 0 #c8963e;
}

.font-hand {
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
}
```

- [ ] **Step 3: Update landing font variables**

In `lib/fonts.ts`, replace:

```ts
export const landingFontClass = [dmSerif.className, dmSans.className].join(" ");
```

with:

```ts
export const landingFontClass = [
  syne.variable,
  dmSans.variable,
  jetbrainsMono.variable,
].join(" ");
```

This defines the CSS variables on the element it is applied to; components reference them via `font-(family-name:var(--font-syne))` etc.

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

Expected: lint 0 errors; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css lib/fonts.ts
git commit -m "feat(landing): add flyer tokens, utilities and fonts"
```

---

### Task 2: Blob, ClaimForm, Nav, Hero

**Files:**
- Create: `components/landing/Blob.tsx`
- Create: `components/landing/ClaimForm.tsx`
- Modify (replace): `components/landing/Nav.tsx`
- Modify (replace): `components/landing/Hero.tsx`

**Interfaces:**
- Consumes: Task 1 tokens/utilities/fonts.
- Produces:
  - `Blob({ className }: { className?: string })` — decorative, `aria-hidden`.
  - `ClaimForm({ variant }: { variant: "hero" | "final" })` — client component; submits to `/register?username=…`; input ids `hero-username` / `final-username`.
  - `Nav()`, `Hero()` — default exports, no props.

- [ ] **Step 1: Create `components/landing/Blob.tsx`**

```tsx
export default function Blob({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="relative h-[68px] w-[78px] -rotate-[8deg] rounded-[52%_48%_46%_54%] bg-brand-green/90">
        <span className="absolute left-[20px] top-[26px] h-3 w-2 rounded-full bg-background-primary" />
        <span className="absolute right-[20px] top-[26px] h-3 w-2 rounded-full bg-background-primary" />
        <span className="absolute -top-[10px] left-1/2 h-3 w-0.5 -translate-x-1/2 bg-brand-green" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/landing/ClaimForm.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Variant = "hero" | "final";

const BUTTON_LABEL: Record<Variant, string> = { hero: "go", final: "claim it" };

const BUTTON_CLASS: Record<Variant, string> = {
  hero: "bg-brand-green text-background-primary sticker-shadow-gold",
  final: "bg-accent-gold text-brand-green sticker-shadow",
};

export default function ClaimForm({ variant }: { variant: Variant }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const inputId = `${variant}-username`;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = username.trim();
    router.push(name ? `/register?username=${encodeURIComponent(name)}` : "/register");
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[420px] gap-2">
      <label
        htmlFor={inputId}
        className="flex min-w-0 flex-1 items-center rounded-md border-2 border-brand-green bg-white px-3.5 py-2.5 shadow-[3px_3px_0_rgba(27,58,27,0.15)] focus-within:ring-2 focus-within:ring-brand-green/30 focus-within:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className="font-(family-name:var(--font-jetbrains)) text-xs text-[#8a8a76] sm:text-sm"
        >
          dropcard.bio/
        </span>
        <input
          id={inputId}
          type="text"
          placeholder="yourname"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-brand-green placeholder:text-[#8a8a76] focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className={`shrink-0 rounded-md px-5 py-2.5 font-(family-name:var(--font-syne)) text-sm font-extrabold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 ${BUTTON_CLASS[variant]}`}
      >
        {BUTTON_LABEL[variant]}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Replace `components/landing/Nav.tsx`**

```tsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b-2 border-brand-green bg-background-primary">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5 md:px-9">
        <Link
          href="/"
          className="font-(family-name:var(--font-syne)) text-lg font-extrabold tracking-tight text-brand-green"
        >
          Dropcard
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden font-(family-name:var(--font-jetbrains)) text-xs text-[#5a5a48] hover:text-brand-green sm:block"
          >
            log in
          </Link>
          <Link
            href="/register"
            className="rounded bg-brand-green px-4 py-2 font-(family-name:var(--font-syne)) text-sm font-extrabold text-background-primary shadow-[3px_3px_0_#c8963e] transition-transform hover:-translate-y-0.5"
          >
            claim your name
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Replace `components/landing/Hero.tsx`**

```tsx
import Blob from "@/components/landing/Blob";
import ClaimForm from "@/components/landing/ClaimForm";

type CardLink = { label: string; className: string };

function TapedCard({
  label,
  handle,
  caption,
  links,
  className = "",
  badge,
}: {
  label: string;
  handle: string;
  caption: string;
  links: CardLink[];
  className?: string;
  badge?: string;
}) {
  return (
    <div
      className={`relative rounded bg-white p-[13px] shadow-[0_12px_30px_rgba(27,58,27,0.16)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="tape absolute -top-2 left-1/2 h-[18px] w-16 -translate-x-1/2 -rotate-3"
      />
      {badge ? (
        <span className="absolute -right-2 -top-2 z-10 rotate-[8deg] rounded-full bg-accent-coral-dark px-2.5 py-1.5 text-[10px] font-extrabold text-white">
          {badge}
        </span>
      ) : null}
      <div className="font-(family-name:var(--font-jetbrains)) text-[10px] text-accent-gold">
        // {label}
      </div>
      <strong className="block text-[13px] text-brand-green">{handle}</strong>
      <div className="mt-2 flex flex-col gap-1.5">
        {links.map((link) => (
          <div
            key={link.label}
            className={`px-2.5 py-1.5 text-[10px] font-bold ${link.className}`}
          >
            {link.label}
          </div>
        ))}
      </div>
      <div className="font-hand mt-2 text-[10px] text-[#8a8a76]">{caption}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-6 pt-10 md:px-9 lg:grid-cols-[56fr_44fr] lg:gap-6 lg:pt-14">
        <div>
          <span className="inline-block -rotate-2 rounded-[3px] bg-accent-gold px-2.5 py-1.5 text-[11px] font-extrabold tracking-[0.08em] text-brand-green">
            100% FREE. ACTUALLY.
          </span>
          <h1 className="mt-3.5 font-(family-name:var(--font-syne)) text-4xl font-extrabold leading-[0.99] tracking-tight text-brand-green sm:text-5xl lg:text-6xl">
            stop looking like{" "}
            <span className="relative inline-block">
              everyone else&apos;s
              <svg
                aria-hidden="true"
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute -bottom-0.5 left-0 h-3.5 w-full"
              >
                <path
                  d="M2 9 C 60 3, 130 12, 198 5"
                  fill="none"
                  stroke="#e2603f"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />
            link-in-bio.
          </h1>
          <p className="mt-3 max-w-[430px] text-[15px] text-[#5a5a48]">
            your colors, your fonts, your links. group them how you want. one
            minute, tops.
          </p>
          <div className="mt-4">
            <ClaimForm variant="hero" />
          </div>
          <p className="mt-2.5 font-(family-name:var(--font-jetbrains)) text-[11px] text-[#8a8a76]">
            free forever · no card · nothing to cancel
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:block lg:h-[360px]">
          <TapedCard
            label="theme 01"
            handle="@theo.codes"
            caption="syne + forest"
            className="lg:absolute lg:right-6 lg:top-0 lg:rotate-3"
            links={[
              {
                label: "github",
                className: "rounded-full bg-brand-green text-background-primary",
              },
              {
                label: "blog",
                className: "rounded-full bg-[#f7efdd] text-brand-green",
              },
            ]}
          />
          <TapedCard
            label="theme 02"
            handle="@lume.studio"
            caption="dm serif + gold"
            badge="new"
            className="lg:absolute lg:left-8 lg:top-24 lg:-rotate-3"
            links={[
              {
                label: "book a session",
                className: "rounded-sm bg-accent-gold text-brand-green",
              },
              {
                label: "portfolio",
                className: "rounded-sm bg-[#eef4ea] text-brand-green",
              },
            ]}
          />
          <Blob className="hidden lg:absolute lg:bottom-2 lg:right-0 lg:block" />
          <p className="font-hand text-[11px] text-[#5a5a48] lg:absolute lg:bottom-4 lg:left-24">
            blob keeps an eye on it
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1200px] flex-wrap gap-x-6 gap-y-1 border-t-2 border-dashed border-[#c9c2ad] px-6 pt-3 font-(family-name:var(--font-jetbrains)) text-[11px] text-[#5a5a48] md:px-9">
        <span className="text-accent-coral">//</span>
        <span>18 fonts</span>
        <span>any color</span>
        <span>collections</span>
        <span>multiple cards</span>
        <span>backgrounds</span>
        <span>free forever</span>
      </div>
    </section>
  );
}
```

Note: `// {label}` and `//` in JSX render literally — fine.

- [ ] **Step 5: Verify**

```bash
npm run lint
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add components/landing/Blob.tsx components/landing/ClaimForm.tsx components/landing/Nav.tsx components/landing/Hero.tsx
git commit -m "feat(landing): rebuild hero, nav and shared claim form"
```

---

### Task 3: ThemeWall, HowItWorks, FeatureStickers

**Files:**
- Create: `components/landing/ThemeWall.tsx`
- Modify (replace): `components/landing/HowItWorks.tsx`
- Create: `components/landing/FeatureStickers.tsx`

**Interfaces:**
- Consumes: Task 1 utilities.
- Produces: `ThemeWall()`, `HowItWorks()`, `FeatureStickers()` — default exports, no props. Not referenced by `app/page.tsx` until Task 5.

- [ ] **Step 1: Create `components/landing/ThemeWall.tsx`**

```tsx
type ThemePreview = {
  name: string;
  rotate: string;
  offset?: string;
  tape?: boolean;
  surface: string;
  avatar: string;
  bar: string;
  link: string;
  linkAlt: string;
};

const themes: ThemePreview[] = [
  {
    name: "neon forest",
    rotate: "-rotate-2",
    tape: true,
    surface: "bg-brand-green",
    avatar: "bg-[#b6f04a]",
    bar: "bg-[#b6f04a]",
    link: "rounded-full bg-[#b6f04a]",
    linkAlt: "rounded-full border border-[#b6f04a]",
  },
  {
    name: "gold rush",
    rotate: "rotate-1",
    offset: "mt-2",
    surface: "border border-[#e6ddc6] bg-[#f7efdd]",
    avatar: "bg-accent-gold",
    bar: "bg-accent-gold",
    link: "rounded-sm bg-accent-gold",
    linkAlt: "rounded-sm border border-[#d8cba8] bg-white",
  },
  {
    name: "ink & coral",
    rotate: "-rotate-1",
    tape: true,
    surface: "bg-[#0f1210]",
    avatar: "bg-accent-coral",
    bar: "bg-background-primary",
    link: "rounded-md bg-background-primary",
    linkAlt: "rounded-md border border-background-primary",
  },
  {
    name: "pale garden",
    rotate: "rotate-2",
    offset: "mt-2",
    surface: "border border-[#d5e2cf] bg-[#eef4ea]",
    avatar: "bg-brand-green",
    bar: "bg-brand-green",
    link: "rounded-full bg-brand-green",
    linkAlt: "rounded-full border border-[#cfe0c8] bg-white",
  },
];

export default function ThemeWall() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pt-10 md:px-9">
      <h2 className="font-(family-name:var(--font-jetbrains)) text-[11px] text-[#8a8a76]">
        // pick a look. any look.
      </h2>
      <div className="mt-3 flex flex-wrap items-start gap-3.5">
        {themes.map((theme) => (
          <div
            key={theme.name}
            className={`relative w-[150px] rounded bg-white p-[11px] shadow-[0_10px_24px_rgba(27,58,27,0.14)] ${theme.rotate} ${theme.offset ?? ""}`}
          >
            {theme.tape ? (
              <span
                aria-hidden="true"
                className="tape absolute -top-2 left-4 h-4 w-14 -rotate-3"
              />
            ) : null}
            <div className={`rounded-xl p-2.5 ${theme.surface}`}>
              <div className={`mx-auto h-[26px] w-[26px] rounded-full ${theme.avatar}`} />
              <div className={`mx-auto mt-2 h-1.5 w-3/5 rounded-full ${theme.bar}`} />
              <div className={`mt-2 h-3.5 ${theme.link}`} />
              <div className={`mt-1.5 h-3.5 ${theme.linkAlt}`} />
            </div>
            <div className="font-hand mt-2 text-center text-[10px] text-[#5a5a48]">
              {theme.name}
            </div>
          </div>
        ))}
        <p className="font-hand max-w-[180px] self-center text-xs text-[#5a5a48]">
          ← or build your own from the editor. 18 fonts, any hex color, buttons,
          backgrounds.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace `components/landing/HowItWorks.tsx`**

```tsx
const steps = [
  {
    n: "1",
    circle: "bg-brand-green text-background-primary",
    title: "claim your name",
    aside: "dropcard.bio/you",
  },
  {
    n: "2",
    circle: "bg-accent-gold text-brand-green",
    title: "pick a theme, or wreck it",
    aside: "any color. any font.",
  },
  {
    n: "3",
    circle: "bg-accent-coral-dark text-white",
    title: "paste your links",
    aside: "done. go outside.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pt-10 md:px-9">
      <h2 className="font-(family-name:var(--font-jetbrains)) text-[11px] text-[#8a8a76]">
        // how it works
      </h2>
      <div className="mt-3 max-w-[560px] rounded-lg border-2 border-dashed border-[#b9b19b] bg-background-primary px-5 py-1.5">
        {steps.map((step, index) => (
          <div
            key={step.n}
            className={`flex items-center gap-3.5 py-3 ${
              index < steps.length - 1
                ? "border-b border-dashed border-[#d5cdb8]"
                : ""
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ${step.circle}`}
            >
              {step.n}
            </span>
            <span className="text-sm font-extrabold text-brand-green">
              {step.title}
            </span>
            <span className="ml-auto font-(family-name:var(--font-jetbrains)) text-[11px] text-[#8a8a76]">
              {step.aside}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/landing/FeatureStickers.tsx`**

```tsx
const stickers = [
  {
    label: "18 fonts",
    className:
      "-rotate-2 rounded-full bg-brand-green text-background-primary sticker-shadow-gold",
  },
  {
    label: "any hex color",
    className:
      "rotate-1 rounded border-2 border-brand-green bg-white text-brand-green sticker-shadow",
  },
  {
    label: "collections",
    className:
      "-rotate-1 rounded-full bg-accent-gold text-brand-green sticker-shadow",
  },
  {
    label: "multiple cards",
    className:
      "rotate-2 rounded-full border-2 border-brand-green bg-white text-brand-green sticker-shadow",
  },
  {
    label: "background images",
    className:
      "-rotate-1 rounded border-2 border-brand-green bg-[#eef4ea] text-brand-green sticker-shadow",
  },
  {
    label: "button shapes",
    className:
      "rotate-1 rounded-full bg-accent-coral-dark text-white sticker-shadow-gold",
  },
  {
    label: "live editor",
    className:
      "-rotate-1 rounded border-2 border-brand-green bg-white text-brand-green sticker-shadow",
  },
];

export default function FeatureStickers() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pt-10 md:px-9">
      <h2 className="font-(family-name:var(--font-jetbrains)) text-[11px] text-[#8a8a76]">
        // what you get
      </h2>
      <div className="mt-3 flex max-w-[760px] flex-wrap gap-3">
        {stickers.map((sticker) => (
          <span
            key={sticker.label}
            className={`px-3.5 py-2 text-[13px] font-extrabold transition-transform hover:-translate-y-0.5 ${sticker.className}`}
          >
            {sticker.label}
          </span>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add components/landing/ThemeWall.tsx components/landing/HowItWorks.tsx components/landing/FeatureStickers.tsx
git commit -m "feat(landing): add theme wall, how-it-works and feature stickers"
```

---

### Task 4: Pricing, FinalCta, Footer

**Files:**
- Modify (replace): `components/landing/Pricing.tsx`
- Create: `components/landing/FinalCta.tsx`
- Modify (replace): `components/landing/Footer.tsx`

**Interfaces:**
- Consumes: `ClaimForm` from Task 2.
- Produces: `Pricing()`, `FinalCta()`, `Footer()` — default exports, no props. `Footer` is referenced by `app/page.tsx` immediately (swap must keep the build green); `FinalCta` is referenced in Task 5.

- [ ] **Step 1: Replace `components/landing/Pricing.tsx`**

```tsx
import Link from "next/link";

type Feature = { text: string; soon?: boolean };
type Tier = {
  name: string;
  price: string;
  cadence: string;
  cta: string;
  features: Feature[];
  recommended?: boolean;
};

const tiers: Tier[] = [
  {
    name: "free",
    price: "$0",
    cadence: "forever",
    cta: "start free",
    features: [
      { text: "one card" },
      { text: "all themes & fonts" },
      { text: "collections" },
      { text: "unlimited links" },
    ],
  },
  {
    name: "pro",
    price: "$9",
    cadence: "/mo",
    cta: "choose pro",
    recommended: true,
    features: [
      { text: "everything in free" },
      { text: "multiple cards" },
      { text: "background images" },
      { text: "priority support" },
      { text: "click analytics", soon: true },
      { text: "QR codes", soon: true },
    ],
  },
  {
    name: "business",
    price: "$29",
    cadence: "/mo",
    cta: "choose business",
    features: [
      { text: "everything in pro" },
      { text: "custom domain", soon: true },
      { text: "team seats", soon: true },
      { text: "early access to new features" },
    ],
  },
];

export default function Pricing() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pt-10 md:px-9">
      <h2 className="font-(family-name:var(--font-jetbrains)) text-[11px] text-[#8a8a76]">
        // pricing. no asterisks.
      </h2>
      <div className="mt-3 flex flex-wrap gap-4">
        {tiers.map((tier, index) => {
          const isPro = Boolean(tier.recommended);
          const cardClass = isPro
            ? "relative w-[210px] rotate-[0.8deg] rounded-[10px] bg-brand-green p-4 text-background-primary shadow-[6px_6px_0_#c8963e]"
            : `relative w-[210px] rounded-[10px] border-2 border-dashed border-[#b9b19b] bg-background-primary p-4 ${
                index === 0 ? "-rotate-1" : "-rotate-[0.6deg]"
              }`;
          const soonClass = isPro ? "text-accent-gold" : "text-[#5a5a48]";
          const buttonClass = isPro
            ? "bg-accent-gold text-brand-green"
            : "bg-brand-green text-background-primary";
          return (
            <div key={tier.name} className={cardClass}>
              {isPro ? (
                <span className="absolute -right-2.5 -top-3 rotate-[7deg] rounded-[3px] bg-accent-coral-dark px-2.5 py-1.5 text-[10px] font-extrabold text-white">
                  most picked
                </span>
              ) : null}
              <div className="font-(family-name:var(--font-syne)) text-[15px] font-extrabold">
                {tier.name}
              </div>
              <div className="font-(family-name:var(--font-syne)) text-3xl font-extrabold tracking-tight">
                {tier.price}
                <span className="text-xs font-bold opacity-70">
                  {tier.cadence}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-[11px] leading-snug">
                {tier.features.map((feature) => (
                  <li key={feature.text}>
                    {feature.text}
                    {feature.soon ? (
                      <span
                        className={`ml-1.5 text-[9px] font-extrabold uppercase tracking-wide ${soonClass}`}
                      >
                        (soon)
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-4 block rounded-md px-4 py-2.5 text-center font-(family-name:var(--font-syne)) text-xs font-extrabold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 ${buttonClass}`}
              >
                {tier.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/landing/FinalCta.tsx`**

```tsx
import ClaimForm from "@/components/landing/ClaimForm";

export default function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pb-10 pt-9 md:px-9">
      <div className="relative flex flex-wrap items-center gap-5 rounded-xl bg-brand-green p-7 text-background-primary">
        <span
          aria-hidden="true"
          className="tape absolute -top-3 left-4 h-5 w-16 -rotate-3"
        />
        <h2 className="font-(family-name:var(--font-syne)) text-2xl font-extrabold tracking-tight sm:text-[26px]">
          your name is
          <br />
          still available.
        </h2>
        <ClaimForm variant="final" />
        <p className="font-hand -rotate-2 text-xs text-background-primary/75">
          probably. check fast.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Replace `components/landing/Footer.tsx`**

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-brand-green">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-3.5 font-(family-name:var(--font-jetbrains)) text-[11px] text-[#5a5a48] sm:flex-row sm:items-center sm:justify-between md:px-9">
        <span>dropcard — for people who hate ugly link pages</span>
        <div className="flex gap-4">
          <Link href="/login" className="hover:text-brand-green">
            log in
          </Link>
          <Link href="/register" className="hover:text-brand-green">
            claim your name
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

`app/page.tsx` still imports the old landing components (`HowItWorks`, `FeatureBento`, `TemplatePreview`, `TrustBar`, etc.) — those files still exist at this point, so the build stays green.

- [ ] **Step 5: Commit**

```bash
git add components/landing/Pricing.tsx components/landing/FinalCta.tsx components/landing/Footer.tsx
git commit -m "feat(landing): add pricing tickets, final CTA and footer"
```

---

### Task 5: Swap `app/page.tsx` and delete the old landing

**Files:**
- Modify (replace): `app/page.tsx`
- Delete: `components/landing/ExampleModal.tsx`, `components/landing/FeatureBento.tsx`, `components/landing/HeroForm.tsx`, `components/landing/PhoneMockup.tsx`, `components/landing/SocialProof.tsx`, `components/landing/TemplatePreview.tsx`, `components/landing/TrustBar.tsx`

**Interfaces:**
- Consumes: every component from Tasks 2–4.
- Produces: the final landing composition.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import ThemeWall from "@/components/landing/ThemeWall";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureStickers from "@/components/landing/FeatureStickers";
import Pricing from "@/components/landing/Pricing";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import { landingFontClass } from "@/lib/fonts";

export default function Home() {
  return (
    <div
      className={`${landingFontClass} paper-grain min-h-dvh bg-background-primary font-(family-name:var(--font-dm-sans)) text-brand-green`}
    >
      <Nav />
      <main>
        <Hero />
        <ThemeWall />
        <HowItWorks />
        <FeatureStickers />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Delete the old components**

```bash
git rm components/landing/ExampleModal.tsx components/landing/FeatureBento.tsx components/landing/HeroForm.tsx components/landing/PhoneMockup.tsx components/landing/SocialProof.tsx components/landing/TemplatePreview.tsx components/landing/TrustBar.tsx
```

- [ ] **Step 3: Confirm nothing still references them**

```bash
rg -n "ExampleModal|FeatureBento|HeroForm|PhoneMockup|SocialProof|TemplatePreview|TrustBar" --glob '!node_modules' --glob '!landing-page-research.md' .
```

Expected: no matches (the research doc may mention names historically; code must be clean).

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(landing): compose flyer landing page and remove old components"
```

---

### Task 6: SSR smoke test, manual/a11y pass, review gate

**Files:** none by default (fix commits only if issues are found).

**Interfaces:**
- Consumes: the composed page from Task 5.

- [ ] **Step 1: Build and serve**

```bash
npm run build
npm run start -- -p 3123 &
sleep 3
curl -s http://localhost:3123/ > /tmp/landing-ssr.html
```

- [ ] **Step 2: Assert new copy is present**

```bash
for s in "stop looking like" "dropcard.bio/" "// pick a look" "// how it works" "// what you get" "// pricing" "your name is" "most picked" "(soon)" "18 fonts"; do
  grep -q "$s" /tmp/landing-ssr.html && echo "OK: $s" || echo "MISSING: $s"
done
```

Expected: every line `OK`.

- [ ] **Step 3: Assert old copy is gone**

```bash
for s in "unmistakably" "Trusted by" "See an example profile" "Get started for free"; do
  grep -q "$s" /tmp/landing-ssr.html && echo "STILL PRESENT: $s" || echo "gone: $s"
done
```

Expected: every line `gone`.

- [ ] **Step 4: Stop the server**

```bash
kill %1 2>/dev/null || pkill -f "next start -p 3123"
```

- [ ] **Step 5: Manual browser + a11y pass (user-visible)**

Run `npm run dev`, open `/` at mobile (375px) and desktop widths, and compare against `docs/superpowers/specs/2026-09-22-landing-page-flyer-mock.html`. Check:

- keyboard tab order: nav → claim input → go → theme note (skipped, decorative) → pricing CTAs → final claim form → footer links;
- focus rings visible on every interactive element;
- coral pairings: `new` sticker, `most picked` sticker, `button shapes` sticker, step-3 circle all use `accent-coral-dark` with white text (verify ≥4.5:1 in a contrast checker; if any fails, darken `--color-accent-coral-dark` until it passes);
- hover lift/tilt works and is disabled by `prefers-reduced-motion` (OS setting);
- no horizontal scroll at 375px (rotated and absolutely positioned cards are the risk).

- [ ] **Step 6: Fix-as-needed commits, then hand to user for review**

Any fixes: commit with `fix(landing): …`. Then post the dev-server URL to the user and wait for review before merging to `main` (merge only on explicit approval).

---

## Self-Review

**Spec coverage:** tokens/utilities/fonts → Task 1; nav, hero, taped cards, blob, specs strip, claim form → Task 2; theme wall, how-it-works, stickers → Task 3; pricing with `(soon)` tags, final CTA, footer with real links only → Task 4; page composition + deletions → Task 5; verification incl. SSR, contrast, reduced motion, review gate → Task 6. Pricing truthfulness and no-fake-content constraints are enforced by the exact copy in Tasks 3–4.

**Placeholder scan:** none — every step carries its file content or exact command.

**Type consistency:** `ClaimForm` variant union `"hero" | "final"` used identically in Tasks 2 and 4; `landingFontClass` updated once in Task 1 and consumed once in Task 5; `.tape`/`.sticker-shadow*`/`.paper-grain`/`.font-hand` defined in Task 1 and referenced with those exact names in Tasks 2–4; token names `accent-coral`, `accent-coral-dark`, `background-paper` consistent throughout.
