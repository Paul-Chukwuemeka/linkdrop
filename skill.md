---
name: linktree-clone
description: >
  Build a Linktree-style link-in-bio page builder product. Use this skill whenever
  the user asks to build, scaffold, design, or extend a link-in-bio app, Linktree
  clone, bio page builder, or any feature within one (e.g., public profile page,
  link editor dashboard, theme picker, analytics). Also trigger for adjacent tasks
  like designing the landing page, auth flow, or API schema for such a product.
  Covers full-stack implementation with Next.js 16 (App Router with API routes) +
  Prisma + Auth.js v5 + PostgreSQL, with a design language derived from Linktree's
  bold visual identity.
---

# Linktree Clone — Build Skill

A full guide for scaffolding and extending a production-grade Linktree clone,
covering design language, architecture, component patterns, data models, and API
contracts.

---

## 1. Design Language

Derived directly from Linktree's visual identity. Honour it faithfully on the
landing page; adapt it (or swap the accent) on user-customised profile pages.

### Colour Palette

```css
:root {
  /* Brand */
  --color-lime:      #C5F135;   /* primary accent — Linktree's signature green */
  --color-dark:      #1A1A1A;   /* near-black — headings, buttons */
  --color-dark-alt:  #243010;   /* deep forest green — used for dark text on lime */

  /* Neutrals */
  --color-white:     #FFFFFF;
  --color-surface:   #F5F5F5;   /* pill nav background */
  --color-border:    #E0E0E0;

  /* Semantic */
  --color-text-primary:   var(--color-dark);
  --color-text-secondary: #555555;
  --color-bg:             var(--color-lime);   /* landing page body */
}
```

### Typography

```css
/* Recommended pairings — import via Google Fonts or next/font */

/* Display / Headlines */
font-family: 'Syne', sans-serif;          /* bold, geometric, modern */
/* OR */
font-family: 'Space Grotesk', sans-serif; /* only if Syne unavailable */

/* Body / UI */
font-family: 'DM Sans', sans-serif;

/* Scale (rem, base 16px) */
--text-xs:   0.75rem;
--text-sm:   0.875rem;
--text-base: 1rem;
--text-lg:   1.125rem;
--text-xl:   1.25rem;
--text-2xl:  1.5rem;
--text-3xl:  2rem;
--text-4xl:  2.75rem;
--text-5xl:  3.75rem;   /* landing hero */
--text-6xl:  5rem;
```

### Core Shape Language

Everything is **pill-shaped or roundrect** — never square corners.

```css
--radius-sm:   8px;
--radius-md:   16px;
--radius-lg:   24px;
--radius-pill: 9999px;   /* nav bar, buttons, link cards */
```

### Spacing

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-6:  24px;
--space-8:  32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
```

### Shadows

```css
--shadow-card: 0 4px 24px rgba(0,0,0,0.08);
--shadow-nav:  0 2px 12px rgba(0,0,0,0.06);
```

---

## 2. Core Component Patterns

### Pill Navbar (Landing Page)

```jsx
// Floats on the lime background, white pill container
<nav className="nav-pill">
  <Logo />
  <NavLinks items={['Products','Templates','Marketplace','Learn','Pricing']} />
  <div className="nav-actions">
    <Button variant="ghost">Log in</Button>
    <Button variant="primary">Sign up free</Button>
  </div>
</nav>
```

```css
.nav-pill {
  background: var(--color-white);
  border-radius: var(--radius-pill);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 32px;
  box-shadow: var(--shadow-nav);
  max-width: 1100px;
  margin: 24px auto 0;
}
```

### Button Variants

```css
/* Primary — dark pill */
.btn-primary {
  background: var(--color-dark);
  color: var(--color-white);
  border-radius: var(--radius-pill);
  padding: 14px 28px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.85; }

/* Ghost — outlined */
.btn-ghost {
  background: transparent;
  color: var(--color-dark);
  border: 1.5px solid var(--color-dark);
  border-radius: var(--radius-pill);
  padding: 13px 27px;
  font-weight: 600;
}

/* Lime — accent CTA */
.btn-lime {
  background: var(--color-lime);
  color: var(--color-dark-alt);
  border-radius: var(--radius-pill);
  padding: 14px 28px;
  font-weight: 700;
}
```

### Link Card (Public Profile Page)

```jsx
<a href={link.url} className="link-card" target="_blank" rel="noopener">
  {link.icon && <span className="link-icon">{link.icon}</span>}
  <span className="link-title">{link.title}</span>
</a>
```

```css
.link-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 16px 24px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: var(--text-base);
  text-decoration: none;
  transition: transform 0.15s, opacity 0.15s;
  /* theme overrides applied via inline style or CSS vars */
  background: var(--link-bg, var(--color-dark));
  color: var(--link-color, var(--color-white));
  border: var(--link-border, none);
}
.link-card:hover {
  transform: scale(1.02);
  opacity: 0.9;
}
```

### Hero Section (Landing Page)

```jsx
<section className="hero">
  <h1 className="hero-heading">
    A link in bio<br/>built for you.
  </h1>
  <p className="hero-sub">
    One link to help you share everything you create, curate and sell
    from your Instagram, TikTok, Twitter, YouTube and other social profiles.
  </p>
  <div className="hero-cta">
    <input
      className="hero-input"
      type="text"
      placeholder="yourname"
      prefix="linkbio.io/"
    />
    <Button variant="primary" size="lg">Get started for free</Button>
  </div>
</section>
```

```css
.hero {
  padding: var(--space-24) var(--space-8);
  max-width: 700px;
}
.hero-heading {
  font-size: var(--text-6xl);
  font-weight: 900;
  line-height: 1.05;
  color: var(--color-dark-alt);
  letter-spacing: -0.02em;
  font-style: italic;
}
.hero-input {
  border-radius: var(--radius-pill);
  border: 2px solid transparent;
  background: var(--color-white);
  padding: 14px 20px;
  font-size: var(--text-base);
  outline-offset: 2px;
  min-width: 240px;
}
.hero-input:focus {
  border-color: var(--color-dark);
}
```

---

## 3. Page Architecture

```
/                     → Landing page (lime bg, marketing copy)
/login                → Auth — email/password or OAuth
/register             → Auth — claim username
/dashboard            → Protected; link editor + analytics overview
/dashboard/appearance → Theme customiser
/dashboard/analytics  → Click stats per link
/:username            → Public profile page (served fast, possibly SSG/ISR)
```

---

## 4. Data Models (Prisma Schema)

### User

```prisma
model User {
  id            String    @id @default(uuid())
  username      String    @unique @db.VarChar(30)
  email         String    @unique
  password      String
  fullname      String
  bio           String?
  avatar_url    String?
  current_card  String?
  cards         Card[]
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Card

```prisma
model Card {
  id         String       @id @default(uuid())
  name       String
  style      Json?
  userId     String
  user       User         @relation(fields: [userId], references: [id])
  links      Link[]
  collections Collection[]
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}
```

### Collection

```prisma
model Collection {
  id       String   @id @default(uuid())
  title    String
  position Int      @default(0)
  cardId   String
  card     Card     @relation(fields: [cardId], references: [id])
  links    Link[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([cardId, title])
}
```

### Link

```prisma
model Link {
  id           String      @id @default(uuid())
  title        String
  url          String
  position     Int         @default(0)
  cardId       String
  card         Card        @relation(fields: [cardId], references: [id])
  collectionId String?
  collection   Collection? @relation(fields: [collectionId], references: [id])
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}
```

---

## 5. Theme System

Themes are stored as a JSON blob on `cards.style`. This lets you add new fields
without a migration.

```ts
// Default theme shape (lib/constants.ts)
const DEFAULT_CARD_STYLE = {
  bg_type:        "solid",       // "solid" | "gradient" | "image"
  card_bg:        "FFFFFF",
  text_color:     "1A1A1A",
  title_color:    "1A1A1A",
  button_bg:      "1A1A1A",
  button_text:    "FFFFFF",
  button_radius:  "9999px",      // pill
  card_radius:    "24px",
  font_style:     "Plus Jakarta Sans",
  title_size:     "2xl",
  text_size:      "base",
  gradient:       ["C5F135", "1A1A1A"],
  gradient_type:  "linear",      // "linear" | "radial"
  gradient_direction: 135,
  profile_image:  null,
};
```

Apply theme CSS vars on the profile page wrapper:

```jsx
// pages/[username].jsx
const themeVars = {
  '--link-bg':      theme.link_bg,
  '--link-color':   theme.link_text,
  '--page-bg':      theme.bg_color,
  '--accent':       theme.accent_color,
};

return (
  <main style={themeVars} className="profile-page">
    ...
  </main>
);
```

---

## 6. API Endpoints (Next.js API Routes)

All routes live under `/api/*` in the Next.js app. Auth uses Auth.js session cookies.

```
POST   /api/auth/signup           → create user
GET/POST /api/auth/[...nextauth]  → Auth.js handlers
GET    /api/auth/me               → current user info

GET    /api/profile/me            → current user's profile
PATCH  /api/profile/me            → update profile
PATCH  /api/profile/current       → set current card
POST   /api/profile/upload-avatar → upload avatar to R2
GET    /api/profile/:username     → public profile

GET    /api/cards                 → list user's cards
POST   /api/cards                 → create card
GET    /api/cards/[cardId]        → get one card
PATCH  /api/cards/[cardId]        → update card
DELETE /api/cards/[cardId]        → delete card
PATCH  /api/cards/[cardId]/style  → update card style
PATCH  /api/cards/[cardId]/reorder → reorder card items

GET    /api/links                 → list links
POST   /api/links                 → create link
PATCH  /api/links/[linkId]        → update link
DELETE /api/links/[linkId]        → delete link
PATCH  /api/links/[linkId]/move   → move link between collections
PATCH  /api/links/reorder         → reorder links

GET    /api/collections           → list collections
POST   /api/collections           → create collection
PATCH  /api/collections/:id       → update collection
DELETE /api/collections/:id       → delete collection
```

---

## 7. Next.js Page Notes

### `/` - landing page

### `/u/[username]` — Public Profile

- **Server component.** Fetch `GET /api/profile/[username]` server-side.
- Render `<ProfileHeader>` (avatar, name, bio) + the first card's items.
- Generate `<head>` metadata via `generateMetadata()` with OG tags.

### `/dashboard` — Link Editor

- Client-side fetch behind auth guard (redirect to `/login` if no session)
- Drag-and-drop reorder: use `@dnd-kit/core` (lightweight, accessible)
- Optimistic UI updates for toggle before API round-trip
- Inline edit on link title/URL — avoid modal for every small change

### `/dashboard/appearance` — Theme Picker

- Live preview panel (phone mockup) that mirrors the public profile
- Colour pickers for bg, link bg, link text, accent
- Font selector (show actual font in dropdown)
- PATCH `/api/cards/[cardId]/style` on "Save changes"

---

## 9. Checklist — MVP Feature Set

- [x] Landing page (lime bg, pill nav, hero + CTA input)
- [x] Register / Login (Auth.js, Argon2 password hashing)
- [x] Dashboard — CRUD links, drag-to-reorder
- [x] Public profile page — themed link list
- [ ] Click tracking (fire-and-forget POST on link tap)
- [x] Appearance editor — bg + link colour + font
- [x] Username availability check on register
- [x] Avatar upload (Cloudflare R2)
- [ ] Basic analytics table (clicks per link, last 30 days)

---

## 10. Common Pitfalls

| Pitfall | Fix |
|---|---|
| Reorder sends N PATCH calls | Send one `POST /links/reorder` with full ordered `ids` array |
| Theme stored as many columns | Store as JSON blob; easier to extend |
| Public profile slow on cold start | Use ISR with `revalidate: 60` or edge runtime |
| JWT stored in localStorage | Store in `httpOnly` cookie (Auth.js handles this) |