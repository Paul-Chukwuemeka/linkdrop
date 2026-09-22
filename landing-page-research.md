# LinkDrop — Landing Page Design Research

Best-in-class landing page patterns for link-in-bio SaaS (Linktree, Beacons, Bio.link, Stan,
Campsite, Kōmi, Later, Milkshake, Solo, Taplink), with actionable recommendations for
LinkDrop's Next.js 16 / Tailwind 4 / React 19 build.

**Research date: accessed 2026-09-22.** All observations below come from fetching the live
pages on that date (raw HTML/CSS via `curl` with a desktop browser UA where possible;
`webfetch` and a render proxy where Cloudflare blocked curl). Every claim is cited inline.

## Method and limitations (read this first)

- **Verified live:** linktr.ee, linktr.ee/s/pricing, campsite.bio, campsite.bio/pricing,
  komi.io, komi.io/pricing, later.com/link-in-bio/, milkshake.app, solo.to/pricing,
  bio.link (via render proxy), beacons.ai (via render proxy), taplink.cc (partial SSR).
- **Not verified — do not treat as evidence:** `beacons.ai` and `solo.to` home pages return
  Cloudflare 403 to some clients; `stan.store` is a JS shell whose bundle 404s and whose
  `/pricing` route reports "under construction"; `taplink.cc/pricing` serves "blocked".
  Claims about those pages are marked UNVERIFIED or omitted.
- **Dead/repurposed:** `bento.me` now `301 → linktr.ee`; `koji.com` now serves an unrelated
  restaurant site. Both are absent from the comparison set.
- **Fold placement** is inferred from DOM order relative to the `<h1>`, not measured
  viewport pixels. Treat "above/below fold" as "before/after the hero section in DOM order".
- **Prices and copy change.** All figures are as observed on 2026-09-22.

---

## Executive summary — the 10 highest-signal findings

1. Linktree's hero is a **username-claim field with the URL prefix visibly pre-filled**
   (`value="linktr.ee/"`, placeholder `linktr.ee/yourname`, `aria-label="Claim your Linktree
   username"`) submitting to "Get started for free". LinkDrop's current `HeroForm` already
   mirrors this — it is the category's proven lowest-friction entry.
2. **No competitor hero uses an email field.** Every fetched hero either claims a username
   or pushes a single button into a separate signup app. LinkDrop's username-first form is
   correct.
3. **Social proof goes in the hero**: hard counts in the subheadline (Linktree "Join 70M+…",
   Bio.link "Join 3M+ creators…"), or a ratings cluster (Milkshake "5M+ Downloads / 4.9
   Stars* / 70K+ Reviews") or a creator wall (Kōmi, Bio.link) immediately after the CTA.
4. **No fetched competitor hero says "no credit card required" or "free forever"** — that's
   an open differentiator LinkDrop already uses. Keep it, but only while true.
5. **The hero visual is an animated product mockup, not a stock illustration** — Linktree
   Lottie, Campsite animated profile stack with `campsite.bio/` labels inside, Later autoplay
   muted video, Milkshake card webp mockups.
6. **Every leader owns a non-default palette and a licensed display face.** Linktree
   `#EFF0EC`/`#1E2330` + `mencken`; Later cream `#FFFAEE` + orange `#FE5629` +
   `swear-display`; Kōmi lime `#E3F331` + `ABC Gravity Xcompressed`. White/slate/Inter is
   the "default template" tell.
7. **Feature stories are job-named, not noun-named**: "Analyze your audience and keep them
   engaged" (Linktree), "Convert & Monetize" (Campsite tab), "MEASURE WHAT MATTERS – Track
   every sale" (Later).
8. **Pricing is annual-default, 3–4 tiers, mid-tier badged**, with explicit free-tier limits,
   trial length on paid CTAs, a compare-all-features matrix, and 8–12 FAQs.
9. **Mobile: don't block zoom; keep the primary CTA out of the hamburger; respect
   `prefers-reduced-motion`.** Linktree does all three; Bio.link and Taplink disable zoom
   and ship animations without reduced-motion rules — accessibility regressions LinkDrop
   should not copy.
10. **Trends to skip for now:** React `<ViewTransition>` (Next flag is experimental and
    React 19.2.4 here does not export it), scroll-driven CSS animations as a dependency
    (MDN marks them Experimental and zero competitors ship them), 3D/WebGL (mobile cost).
    Safe wins: product-UI-as-hero, fluid type, one CSS signature animation, real bento proof,
    dark mode.

---

## 1. Hero section patterns

### What each competitor put in the hero (verbatim, 2026-09-22)

| Site | H1 | Hero CTA | Hero visual | Claim field |
|---|---|---|---|---|
| Linktree (linktr.ee) | "A link in bio built for you." | "Get started for free" | Lottie animation, split `md:grid-cols-2` | Yes: prefix `linktr.ee/` + placeholder `linktr.ee/yourname` |
| Campsite (campsite.bio) | "Create your space on the web" | "Get Started for Free" | Animated social-profile stack; mock buttons read `campsite.bio/` | No — links to `app.campsite.bio/create-account` |
| Bio.link | "Your link-in-bio, now with a brain" | "Get started for free" (→ `app.bio.link/signup`) | Two static hero images (`hero1.png`, `hero2.png`) | Not observed |
| Later (later.com/link-in-bio/) | "Turn followers into customers with Later's link in bio tool." | "Get your free link in bio" | Autoplay, loop, muted, `playsInline` video with poster | No |
| Milkshake | "Build a free website on your phone with Milkshake." | App Store / Google Play badges | Two static card mockups | No |
| Kōmi (komi.io) | "Unleash the power of creator" | Two equal CTAs: "for brands" / "for creators" | Full-bleed background + celebrity creator-card wall | No |
| Taplink (taplink.cc) | "Drive more leads and sales on Instagram" | "Get started for free" | Static phone screenshots `s1–s3.png` | No |

Sources: https://linktr.ee/, https://campsite.bio/, https://bio.link/, https://later.com/link-in-bio/,
https://milkshake.app/, https://komi.io/, https://taplink.cc/ (all accessed 2026-09-22).

### Patterns that matter

- **Username-claim is the hero CTA of the category.** Linktree repeats the same field lower
  on the page with a stronger verb ("Claim your Linktree"), so scroll-depth-ready users get a
  second chance.
- **Split layout (copy left, visual right) is the default** for full product demos; full-bleed
  media suits single-message brands (Later, Kōmi).
- **Headline structures that appear repeatedly:**
  - *Benefit + ownership*: "A link in bio built for you." (Linktree)
  - *Outcome / transformation*: "Turn followers into customers…" (Later); "Drive more leads
    and sales on Instagram" (Taplink)
  - *Product announcement / differentiator*: "…now with a brain" (Bio.link)
  - *Platform framing*: "Build a free website on your phone…" (Milkshake)
  - Subheads consistently add a **hard number + breadth**: "Join 70M+ people using Linktree
    for their link in bio. One link to help you share everything you create, curate and sell
    from your Instagram, TikTok, Twitter, YouTube and other social media profiles."
- **Setup-time claims convert**: Taplink "in 10 minutes", Milkshake "in minutes".
- **Dead ends to avoid:** Bento is now a Linktree redirect, Koji's domain is a restaurant.
  The category consolidates; don't model a page on a dead product.

### Takeaways for LinkDrop's hero

1. Keep the `linkdrop.co/` + username + "Get started for free" form (`components/landing/HeroForm.tsx`).
   Add a **debounced availability check** in the hero so the field does real work before
   `/register` — the register flow already checks availability (per `project.md`); surface it.
2. Replace the static-feeling `PhoneMockup` content with a **CSS-only animated link-card
   demo** — cards appearing/stacking on a loop, `linkdrop.co/yourname` printed inside the
   mock (the Campsite trick that teaches the output format before signup). Keep the existing
   `animate-float` and the global `prefers-reduced-motion` kill-switch in `app/globals.css`.
3. Put a **real number in the hero subheadline** once there is one ("X pages created"), not
   in a later trust bar. Until then, use a truthful non-numeric claim.
4. Two headline options worth A/B-ing:
   - Ownership: "Your work deserves a better link-in-bio. Make it unmistakably yours."
     (current — on-strategy)
   - Outcome: "Turn followers into a following you own." (Later-style, pairs with email capture)

---

## 2. Above-the-fold conversion elements

### Observed facts

- **Signup friction:** the only inline claim field observed in a hero is Linktree's username
  field. Campsite, Bio.link, and Later all use a single button that hands off to a separate
  signup app. Milkshake uses app-store badges. Kōmi splits by audience. No email-only hero
  was observed on any fetched page (https://linktr.ee/, https://campsite.bio/,
  https://bio.link/, https://later.com/link-in-bio/, https://milkshake.app/, https://komi.io/,
  https://taplink.cc/, accessed 2026-09-22).
- **CTA wording is consistently "free" + verb:** "Get started for free" (Linktree, Bio.link,
  Taplink), "Get Started for Free" (Campsite), "Get your free link in bio" (Later),
  "Claim your Linktree" (Linktree bottom), "Try for free" / "Start my free trial" (Bio.link).
- **CTA count:** one primary action in every inspected hero except Kōmi (two equal
  audience-routing CTAs). No hero observed with three competing CTAs.
- **Social proof placement:**
  - In the subheadline: Linktree "Join 70M+ people…"; Bio.link "Join 3M+ creators and brands…"
  - Immediately after the hero CTA: Milkshake "5M+ Downloads / 4.9 Stars* / 70K+ Reviews"
    (backed by schema.org ratings 4.9/41,988 iOS, 4.7/28,040 Android); Kōmi celebrity wall
    (Taylor Hill, Alicia Keys, Amelia Dimoldenberg, The Rock, Kim Kardashian, Usher, Olivia
    Palermo) linking to real profiles; Bio.link "Loved by top creators" wall of 14 named
    creators linking to real bio.link pages.
  - Below the fold: Linktree "trusted by 70M+" carousel, "As featured in…" press logos
    (TechCrunch, Forbes, Fortune, Insider, Mashable); Campsite "Join over 250k creators…".
- **Microcopy:** "No credit card required" and "free forever" were **not found on any fetched
  page** (scan across all raw HTML, 2026-09-22). Linktree's free plan is labelled "Free with
  restrictions" on its pricing page. Treat risk-reversal microcopy as a testable
  differentiator, not a category norm.
- **Nav:** 4–7 items typical (Features, Pricing, Templates/Inspiration, Blog, Log in, Sign up).
  Linktree's SSR nav exposes Log in / Get started / Marketplace; Campsite: Pricing, Blog,
  Support, Contact, Log in, Sign Up Free.

### Takeaways

1. Keep one primary CTA above the fold. LinkDrop's current hero does this correctly.
2. Upgrade `TrustBar` from icon slogans ("Secure & private") to **verifiable proof**: real
   creator/profile links, a press logo row, or a counter that is actually true. Do not ship
   invented numbers.
3. Add the risk-reversal line directly under the CTA (current HeroForm microcopy is good:
   "No credit card required. Free forever.") — but make sure "free forever" is a policy
   commitment, because the research shows competitors avoid that exact phrase.
4. Repeat the claim form at the page bottom with a stronger ownership verb ("Claim your
   LinkDrop"), mirroring Linktree's second field.

---

## 3. Visual and branding execution

### Verified brand systems (hex values and fonts extracted from live CSS, 2026-09-22)

| Brand | Surface / ink | Accents | Type | Signature device |
|---|---|---|---|---|
| Linktree | `#EFF0EC` surface, `#1E2330` ink | `#7008E7` purple, `#D2E823` lime, `#502274`, `#CC01DD` | Licensed `mencken` + pixel face `thatThat` + `DM Mono` | Product screenshots only, hero video + tower animation, `motion-reduce` rules |
| Later | `#FFFAEE` cream, `#0D0C0B` ink | `#FE5629` orange, `#FC7CFA` pink, `#5124C1` | `swear-display` headlines, `Inter Tight` body | Noise texture (`background-clip:text`), video-led story, editorial feel |
| Kōmi | black/white | `#E3F331` lime, `#253CE8` blue, `#FF82DE` pink | `ABC Gravity Xcompressed` display, `ABC Repro` body | Compressed uppercase headlines, 50s celebrity marquee, Swiper carousel |
| Campsite | cream/sage | `#647D5E` sage, `#E48D5C` orange, `#F2BA43` yellow | Open Sans | Tiled `mark-pattern-white.svg`, hand-drawn dotted-line animation, custom profile-card illustrations |
| Bio.link | `#0D0D0D` ink | coral `#FF5858` → purple `#C058FF` gradient, `#00DFD8`, `#F9CB28` | Inter across all weights | Coral→purple signature gradient, AI-first copy |
| Solo | `#F4F4F7`, ink `#1a1a1a` | `#3673FC` | Graphik | Single restrained SVG line-draw animation |
| Beacons | white/`#FAFAFA` | blue `rgb(40,72,240)`, orange gradient asset | Figtree, Poppins, Fragment Mono, Special Gothic Condensed One | 3D object PNG collages, creator face wall, flip cards, animated GIF for "Beam" |

Sources: Linktree CSS chunks linked from https://linktr.ee/ and https://linktr.ee/s/pricing;
https://later.com/link-in-bio/; Kōmi Webflow CSS linked from https://komi.io/;
https://campsite.bio/; Bio.link Nuxt CSS linked from https://bio.link/; https://solo.to/;
https://beacons.ai/ (render proxy). All accessed 2026-09-22.

### What makes them not look generic

- **An owned surface color, not white.** Every leader uses a warm off-white, cream, or tinted
  surface with near-black ink. LinkDrop already has `#f5f2e9` background and `#1b3a1b`
  brand green in `app/globals.css` — that is an owned palette. Protect it.
- **One licensed/custom display face.** Linktree, Later, Kōmi, and Stan all ship licensed
  display fonts alongside a neutral body face. Inter-only reads as "starter template".
- **Real product UI as imagery.** Linktree uses `.avif` product screenshots
  (`all-your-things-1.avif`, `analyze-your-audience-and-keep-them-engaged.avif`); Bio.link
  ships `mob-view.png`, `performance.png`, `theme-view.png`. No stock photography.
- **Exactly one signature animation**, restrained, reduced-motion aware: Linktree's hero
  tower animation (`home-hero-tower-up`, paused on hover, `motion-reduce:[animation:none]`);
  Campsite's dotted connector line (`dash-38281725` 1s infinite, `reveal-38281725` 7s);
  Solo's logo draw (`circle 3s cubic-bezier(0,.2,.6,.85) infinite`).
- **Texture, used once.** Later's noise PNG, Campsite's tiled mark pattern. LinkDrop's
  `.bg-noise` overlay at 3.5% opacity and the gold headline underline already fit this.

### Takeaways

1. Add a **display face** for H1/H2s via `next/font/google` or `next/font/local`, paired with
   the body sans. Candidates that read distinct without looking trendy-generic: `Fraunces`,
   `Instrument Serif`, `Bricolage Grotesque`, `Space Grotesk`. (Note: this repo has font-stack
   churn history — Syne/Plus Jakarta — so make it a deliberate, documented choice.)
2. Keep product screenshots as the only imagery; replace any abstract placeholders with real
   dashboard/profile captures.
3. Consolidate motion to **one ownable signature** (the animated phone mockup) plus feedback
   states; remove scattered fades.

---

## 4. Feature showcase sections

### Verified layouts

- **Linktree** (https://linktr.ee/): alternating image + text rows using product screenshots,
  organised as three outcome H3s — "Share every type of content in limitless ways", "Sell
  products, collect payments and make monetization simple", "Grow, own and engage your
  audience across all of your channels" — then a creator carousel, press logos, testimonials,
  FAQ. Pricing page groups features by outcome: "Your growth starts here." / "Get more ways
  to earn." / "Everything you need, and then some." (https://linktr.ee/s/pricing).
- **Campsite** (https://campsite.bio/): a tab switcher with six jobs — **Organize,
  Personalize, Engage, Auto-Pilot, Convert & Monetize, Insights** — with a muted looping
  demo video inside the Organize tab (`organize.6da3351.mp4`).
- **Later** (https://later.com/link-in-bio/): all-caps section labels ("MEASURE WHAT MATTERS –
  Track every sale", "SET UP LINK IN BIO – Drive traffic and clicks") with autoplay
  `-960.mp4` clips and sticky/pinned scroll (`pin-spacer`); customization is an accordion of
  expandable rows ("Custom design", "Featured banner", "Mailchimp integration", "Custom SEO").
- **Beacons** (https://beacons.ai/, render proxy): headline fragments as a narrative —
  "Build your presence." / "Monetize your work." / "Land your dream partnership." / "Own your
  audience." — with image-cluster collages and a GIF demo of the "Beam" AI teammate.
- **Bio.link** (https://bio.link/, render proxy): alternating screenshot + text rows, then an
  8-item feature grid ("Use the domain name of your choice", "Real time stats, track your
  site's performance", "Create as many websites as you want", "Embed your favorite apps…",
  "Build an email list of subscribers", "Publish posts and alert your subscribers", "Share
  your QR code anywhere", "Everything you need for a complete site").
- **Kōmi** (https://komi.io/): audience toggle ("for brands" / "for creators") switches the
  feature story; pricing comparison table groups rows as Mini Site, Add Content, Add Data
  Capture, Custom Domain, Analytics, Support, CRM, Brand Hub.

### Takeaways

1. **Alternating text+visual rows for the core story, then one tab switcher for depth.**
   Rows are Server Components; the tab switcher is the only client island.
2. **Name every section as a job-to-be-done**, not "Features" or "Analytics". For LinkDrop:
   "Build your page", "Know what's working", "Own your audience" (email capture), "Make it
   yours" (themes), "Sell and share" (collections).
3. **Use muted looping screen recordings** for the appearance editor and analytics — 5–10s
   captures, lazy-loaded, `muted playsInline loop preload="none"`, with a poster. Videos
   outperform static screenshots in this category (Later, Campsite, Linktree all ship them).
4. **No scroll-jacking, no fake charts.** The tab/depth section can be built with CSS only.

---

## 5. Pricing section patterns

### Verified pricing pages (2026-09-22)

| Brand | Tiers | Prices observed | Toggle / badge | Trial & CTA | Compare table / FAQ |
|---|---|---|---|---|---|
| Linktree | Free, Starter, Pro, Premium (+Agency) | $6, $12, $30/mo billed annually; $8, $15, $35 monthly | Annual default, monthly inline; Pro "Recommended" | "Try free for 7 days", "Start a free trial. Cancel anytime." | Yes + 8 FAQs |
| Beacons | Free, Creator, Creator Plus, Creator Max | $8.33, $25, $83.3/mo annual; $10, $30, $100 monthly | Monthly/Annual, "2 months free"; Plus badged "MOST POPULAR" on home | "Try for free" / "Upgrade" | "Compare all plans" + 12 FAQs |
| Campsite | Free, Pro, Pro+ (Personal and Organizations tabs) | Pro $7, Pro+ $24; Org Pro $14, Org Pro+ $29 /mo | Monthly/Yearly "Save 16%"; "Popular" ribbon on Pro | "10-day trial included" on every paid card | "Compare Our Plans" + FAQ |
| Solo | Beginner, Personal, Entrepreneur, Professional | $0, $1 (annual only), $5, $10/mo annual; $6, $15 monthly | Annual default; Entrepreneur "Most Popular" | "Start with …" | None |
| Bio.link | Single plan | $7.49/mo, "Yearly (Save 50%)" | — | "Try for free" | Value-stack: "$84/mo otherwise" |
| Kōmi | Starter (free), Pro | $16/mo annual, $20/mo monthly | Annual "Save 20%" | "Start Free Trial" | "Compare plans and features" + 9 FAQs |

Sources: https://linktr.ee/s/pricing, https://beacons.ai/i/pricing (render proxy),
https://campsite.bio/pricing, https://solo.to/pricing, https://bio.link/ (render proxy),
https://komi.io/pricing. All accessed 2026-09-22. Taplink and Stan pricing could not be
verified (blocked / JS-only).

### Cross-cutting patterns

1. **3–4 tiers plus an enterprise card**, with the mid-tier badged (Recommended / Popular /
   Most Popular).
2. **Annual billing is the default.** Monthly price shown inline as a comparison ("Billed
   annually, or $8 monthly"; struck-through monthly prices; "Save 16%/20%/50%").
3. **Free tier limits are explicit**, never asterisked. Linktree: "Free with restrictions"
   plus an entitlement matrix showing which features begin at Starter/Pro. Campsite marks
   excluded features with an "X". Beacons contrasts 9% seller fees on Free/Creator with 0%
   on Creator Plus.
4. **Trial length sits on the paid CTA** ("Try free for 7 days", "10-day trial included"),
   with a cancel-anytime line in the section header.
5. **Every serious page ends with a compare-all-features matrix and 8–12 FAQs.** Bio.link,
   as a single-plan product, replaces the matrix with a value-stack (six tools worth
   "$84/mo" vs "$7.49/mo").
6. **Home-page teaser + dedicated pricing page** (Beacons) is the norm; render both from the
   same data source so they cannot drift.

### Takeaway for LinkDrop

LinkDrop currently has no pricing section on the landing page or a pricing page. Minimum
viable version: a Free / Pro (badged) / Business layout, annual-default toggle with monthly
inline, explicit free-tier limits ("3 cards, 50 links, LinkDrop branding"), 7-day trial on
Pro, compare table, and an 8-question FAQ. If shipping one paid plan only, use Bio.link's
value-stack instead of a table.

---

## 6. Mobile-first considerations

### What competitors do (verified)

- **Viewport/zoom:** Linktree keeps zoom enabled (`width=device-width, initial-scale=1`).
  Bio.link (`maximum-scale=1, user-scalable=0`) and Taplink (`user-scalable=no,
  maximum-scale=1`) disable pinch-zoom — a WCAG 1.4.4 problem. Next 16's `generateViewport`
  supports `maximumScale`/`userScalable`; simply don't set them
  (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-viewport.md`).
- **Navigation:** Linktree collapses to a full-screen panel below `lg` with
  `max-lg:h-[100dvh]`, a `sticky top-0 z-[999]` header, and explicit
  `motion-reduce:max-lg:transition-none`. Bio.link uses a floating pill nav that narrows on
  mobile. No true sticky bottom CTA bar was found on any inspected landing page.
- **Hero typography:** Linktree uses fluid `clamp(40px,5.417vw,78px)` with `text-balance`;
  Bio.link steps `text-7xl → max-lg:text-5xl → max-sm:text-4xl`. The username form stacks
  (`max-sm:flex-col`) and centers.
- **Tap targets:** Linktree leans large (`h-12` = 48px appears 46×). NN/g's research-backed
  minimum is **1cm × 1cm** with spacing (https://www.nngroup.com/articles/touch-target-size/).
- **Reduced motion:** Linktree pauses marquees/animations under
  `prefers-reduced-motion: reduce`; Bio.link and Taplink ship **zero** reduced-motion rules
  in their fetched CSS.

### Authoritative guidance

- **Core Web Vitals targets:** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 (https://web.dev/articles/vitals).
  2025 Web Almanac: only 48% of mobile sites pass all three vs 56% of desktop; home pages are
  the worst page type (https://almanac.httparchive.org/en/2025/performance).
- **Hidden menus cost discoverability:** mobile users used a hidden-only menu in 57% of
  cases vs 86% for combined visible + menu navigation; hidden nav produced >20% drop in
  discoverability (https://www.nngroup.com/articles/hamburger-menus/). Keep the primary CTA
  visible.
- **Mobile reading is harder:** keep hero copy short, one idea per line; attention is still
  highest above the fold (https://www.nngroup.com/articles/mobile-content-is-twice-as-difficult/,
  https://www.nngroup.com/articles/scrolling-and-attention/).
- **Next 16 specifics:** `next/image` requires `sizes` on responsive/`fill` images or the
  browser assumes `100vw`; `priority` is deprecated in favour of `preload`
  (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`,
  `01-app/02-guides/upgrading/version-16.md`). `next/font` self-hosts with `display: swap`
  and preload on by default; use variable fonts
  (`01-app/01-getting-started/13-fonts.md`, `01-app/03-api-reference/02-components/font.md`).

### LinkDrop mobile checklist

1. Never disable zoom; set `themeColor` via `generateViewport`.
2. Primary CTA always visible; hamburger only for secondary links.
3. Hero: headline ≤ 2 lines, one input + one button, a proof point in the first viewport.
4. Targets ≥ 44–48px with spacing; current `py-3` form controls are close — verify at 375px.
5. Fluid `clamp()` type instead of many breakpoints; `text-balance` headlines.
6. Keep the global `prefers-reduced-motion` block in `app/globals.css`; extend it to every
   new animation.
7. CSS-first animation (no Lenis/Lottie) to protect INP on low-end phones.

---

## 7. Recent design trends 2025–2026

| Trend | Status on 2026-09-22 | Verdict for LinkDrop |
|---|---|---|
| **Bento grids** | Curated examples at https://bentogrids.com/ (neon.tech, novu.co/inbox, useparagon.com); no link-in-bio competitor ships a named bento section | Use for **proof**, not slogans: 4–8 cells, ≥3 containing real product UI. Pure CSS Grid, Server Component. High AI-template risk if it's icon cards |
| **Scroll-driven CSS animations** | MDN module marked **Experimental** (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations); **0 competitor CSS** uses `animation-timeline`; demos at https://scroll-driven-animations.style/ | Progressive enhancement only, behind `@supports (animation-timeline: view())`, default = content visible, no motion |
| **View Transitions** | Chrome 111 (SPA) / 126 (MPA); Next 16 flag is experimental and its own docs say "we strongly advise against using this feature in production"; React 19.2.4 in this repo does **not** export `ViewTransition` | **Skip.** Next 16 `<Link transitionTypes>` exists but needs React Canary |
| **AI-generated/personalized demo content** | Vendor claims on Bio.link ("AI Chat doubles engagement" — marketing claim); NN/g on generative UI (https://www.nngroup.com/articles/generative-ui/); adoption is tiny — Prompt API on 0.1% of sites (https://almanac.httparchive.org/en/2025/generative-ai) | Legit as a **product demo** (type your handle → see a mocked profile). Don't claim conversion effects without a test |
| **Motion restraint** | NN/g: motion should be feedback, not ambient decoration (https://www.nngroup.com/articles/animation-purpose-ux/); Linktree enforces reduced motion, Bio.link/Taplink don't | Follow Linktree. "Fade-up on every section" is the new AI-template tell |
| **Dark mode** | Mechanism via `prefers-color-scheme` (https://web.dev/articles/prefers-color-scheme); no adoption stats verified | Ship for the marketing site if the product supports it; it also demos the product |
| **Noise/grain textures** | Technique via CSS-Tricks grainy gradients / SVG `feTurbulence`; LinkDrop already ships `.bg-noise` | Keep, at low opacity. "Gradient + grain" is becoming its own template look — one texture only |
| **Fluid/oversized type** | Verified: Linktree `clamp()`, Bio.link stepped sizes; variable fonts on 39–41% of sites (https://almanac.httparchive.org/en/2025/fonts) | Adopt via `clamp()` + `next/font` variable font |
| **Product-UI-as-hero** | Verified on Linktree, Bio.link, Taplink, Milkshake, Campsite | **Highest-value trend for this category.** Build the mock from real components, not a PNG |
| **Anti-template brutalism** | Gallery https://brutalistwebsites.com/; risk of reading try-hard to creator audiences | Identity choice, not a conversion tactic |
| **3D/WebGL** | Capability verified; usage in this category unverified; real mobile battery/INP cost | Skip; CSS 3D transforms cover small effects (Bio.link uses `perspective` + `rotateY`) |

---

## 8. Five landing-page structures LinkDrop could implement

Shared baseline for all five: Server Components by default with client islands only for the
menu toggle, tabs, and forms (`node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`);
Tailwind 4 via `@tailwindcss/postcss`; `next/image` with `sizes` and `preload` (not
`priority`); `next/font` variable fonts; every animation behind `motion-reduce:`.

### Structure 1 — "Claim-Your-Name, Show-The-Product" (recommended)

1. Sticky header: logo, 2–3 anchors, always-visible "Claim your LinkDrop" button.
2. Hero: `clamp()` H1 + subhead + `linkdrop.co/` username claim + trust microcopy.
3. Product-as-hero: phone-framed profile built in real HTML/CSS beside/below the form.
4. Social-proof row (real profiles or press).
5. Bento proof grid (4–6 cells: analytics, collections, themes, custom domain…).
6. Template gallery strip.
7. How it works (3 steps).
8. Pricing teaser.
9. FAQ + final claim form + footer.

**Why:** mirrors Linktree's highest-signal pattern; the username claim *is* the aha moment.
**Implementation:** only the form (and optional mobile menu) is `'use client'`; LCP element
likely the H1, so keep the mock CSS-only and no hero image preload needed.

### Structure 2 — "Creator Story Scroll"

1. Minimal nav. 2. Type-led hero (statement + CTA, no visual). 3. Three full-width scroll
beats: chaos → order, your brand, your audience. 4. Before/after profile comparison.
5. Feature proof grid. 6. Testimonial band. 7. Pricing. 8. FAQ + CTA.

**Why:** sells the transformation, which a static hero can't show.
**Implementation:** CSS `animation-timeline: view()` behind `@supports`; no scroll listeners,
no client components; `min-height: 100svh` per beat; content readable with animation off.

### Structure 3 — "Bento Proof Board"

1. Compact header + CTA. 2. One-line hero (grid is the hero). 3. Asymmetric bento grid
(6–8 cells with real numbers/screenshots). 4. "Built for" row. 5. Pricing. 6. CTA + footer.

**Why:** the product is a grid of blocks; the layout mirrors the metaphor and is scannable.
**Implementation:** pure CSS Grid, Server Component; per-cell `sizes`; no info hidden behind
hover; contrast check per card.

### Structure 4 — "Own-Your-Audience" (conversion-led)

1. Sticky header "Start free". 2. Hero: outcome headline + single email capture + privacy
line. 3. Ownership explainer (algorithm risk / email list / export anytime). 4. Product mock
with capture block highlighted. 5. Creator quotes with follower counts. 6. Comparison vs
plain link pages. 7. Integrations row. 8. Pricing + guarantee. 9. FAQ + CTA.

**Why:** differentiates LinkDrop on audience ownership rather than "another link list".
**Implementation:** email capture posts to a Route Handler or Server Action with pending and
`aria-live` success state; `inputMode="email"`; no exit-intent popups on mobile.

### Structure 5 — "Template-First Gallery"

1. Minimal header. 2. Short hero "Pick a page. Make it yours." 3. Horizontally scrollable /
masonry gallery of real profile screenshots with free/paid badges. 4. One template spotlight
with theme variants. 5. Feature strip. 6. Creator showcase. 7. Pricing. 8. FAQ + CTA.

**Why:** templates are the fastest route to "I can see mine".
**Implementation:** gallery data via `'use cache'`; `overflow-x: auto` + `scroll-snap` (no JS
carousel); `next/image` with accurate `sizes` and blur placeholders.

---

## 9. LinkDrop-specific action plan (mapped to current code)

| Current file | Observation from research | Action |
|---|---|---|
| `components/landing/HeroForm.tsx` | Matches Linktree's winning username-claim pattern, prefix + "Get started for free" | Add debounced availability check; keep one CTA; keep microcopy while true |
| `components/landing/PhoneMockup.tsx` | Static; leaders animate the mock and print their URL inside it | Add a CSS-only link-card loop; label cards `linkdrop.co/…`; keep reduced-motion |
| `components/landing/TrustBar.tsx` | Icon slogans are weaker than all observed social proof | Replace with real profile links / press logos / a true counter |
| `components/landing/Hero.tsx` | Split hero, gold underline, noise — on-strategy | A/B outcome headline; add setup-time claim; consider `clamp()` type |
| `components/landing/TemplatePreview.tsx` | Category treats templates as a primary demo surface | Use real screenshots; `next/image` + `sizes`; horizontal snap scroll on mobile |
| `app/page.tsx` | No feature showcase, pricing, or FAQ sections | Add alternating feature rows, pricing teaser, FAQ, and a final claim form |
| `app/globals.css` | Owned cream/green/gold palette + grain + reduced-motion kill-switch — good | Add one display font token; extend reduced-motion to all new animation |
| Fonts | Single body sans (Inter); leaders pair a display face | Add a deliberate display face via `next/font` |
| Pricing | No pricing page or section exists | Ship Free / Pro / Business with annual-default, explicit limits, compare table, FAQ |

### What to copy

Owned palette, username-claim hero, animated product mockup, hard proof numbers, job-named
feature sections, alternating rows + one tab switcher, muted demo videos, annual-default
pricing with explicit free limits, visible mobile CTA, reduced-motion discipline.

### What to avoid

Email-only hero, broken "free forever" promises, fake counters, icon-card bento filler,
scroll-jacking, React View Transitions on this stack, WebGL, zoom-blocking, sticky
bottom bars stacked on top of sticky headers.

---

## Sources

All URLs accessed **2026-09-22**. Full raw HTML/CSS snapshots captured during research are
under `/tmp/opencode/competitors/` and `/tmp/opencode/sources/` (session-local).

Competitors: https://linktr.ee/ · https://linktr.ee/s/pricing · https://beacons.ai/ ·
https://beacons.ai/i/pricing · https://bio.link/ · https://stan.store/ ·
https://campsite.bio/ · https://campsite.bio/pricing · https://taplink.cc/ · https://solo.to/ ·
https://solo.to/pricing · https://komi.io/ · https://komi.io/pricing ·
https://later.com/link-in-bio/ · https://milkshake.app/ · https://bento.me/ · https://koji.com/

Platform and design guidance: web.dev (vitals, INP, prefers-reduced-motion, images) ·
https://almanac.httparchive.org/en/2025/ (performance, fonts, accessibility, generative-ai) ·
NN/g (touch targets, hamburger menus, mobile content, scrolling, animation, generative UI,
personalization) · MDN (scroll-driven animations, View Transitions, media queries,
feTurbulence) · developer.chrome.com (scroll-driven animations, view transitions, Lighthouse) ·
https://bentogrids.com/ · https://brutalistwebsites.com/ · https://scroll-driven-animations.style/

Repo-specific (Next 16.2.1 docs shipped in `node_modules/next/dist/docs/`):
`01-app/03-api-reference/02-components/image.md` (sizes, `priority` → `preload`) ·
`01-app/01-getting-started/13-fonts.md` and `01-app/03-api-reference/02-components/font.md` ·
`01-app/03-api-reference/04-functions/generate-viewport.md` ·
`01-app/03-api-reference/05-config/01-next-config-js/viewTransition.md` (experimental) ·
`01-app/01-getting-started/05-server-and-client-components.md` ·
`01-app/01-getting-started/08-caching.md`
