# LinkForge Frontend

Next.js 16 (App Router) + Tailwind CSS 4 frontend for LinkForge — a link-in-bio page builder.

## Tech Stack

- **Next.js** 16.2 — App Router
- **React** 19.2 — with React DOM
- **Tailwind CSS** 4 — via `@tailwindcss/postcss`
- **@dnd-kit** — drag-and-drop for link/collection reordering
- **lucide-react** + **react-icons** — icons
- **Plus Jakarta Sans** — app font (18 Google Fonts available for card theming)

## Requirements

- Node.js 20+
- LinkForge backend running (FastAPI) at `NEXT_PUBLIC_API_URL`

## Setup

```bash
# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL (default: http://localhost:8000)

# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open `http://localhost:3000`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | — (required) |

## Routes

| Path | Description | Auth |
|------|-------------|------|
| `/` | Landing / marketing page | No |
| `/login` | Sign in | No |
| `/register` | Create account | No |
| `/dashboard` | Card editor (links + collections) | Yes |
| `/dashboard/cards` | List + manage cards | Yes |
| `/dashboard/appearance` | Card theming + styling | Yes |
| `/u/:username` | Public profile (active card) | No |

## Data Model (Frontend View)

```
User
└── Card(s)
    ├── Link(s)            (top-level, position-ordered)
    └── Collection(s)      (position-ordered)
        └── Link(s)        (nested, own position order)
```

Top-level ordering is driven by `position` across both links and collections. Links inside collections have their own `position` ordering.

## Auth

- JWT access + refresh tokens stored in `localStorage`
- `apiFetch()` automatically refreshes the token pair on `401`, retries once, and logs out on failure
- Lightweight session cookie (`lf_session`) for server-side route protection

## Project Structure

```
linkforge/
├── app/
│   ├── layout.tsx           # Root layout (fonts, providers)
│   ├── page.tsx             # Landing page
│   ├── providers.tsx        # AuthProvider wrapper
│   ├── globals.css          # CSS custom properties + Tailwind
│   ├── (auth)/
│   │   ├── login/page.tsx   # Login page
│   │   └── register/page.tsx # Register page
│   ├── dashboard/
│   │   ├── layout.tsx       # Dashboard layout (AppContextProvider)
│   │   ├── page.tsx         # Main card editor
│   │   ├── appearance/page.tsx  # Theming page
│   │   └── cards/page.tsx   # Cards management
│   └── u/[username]/page.tsx # Public profile
├── components/
│   ├── appearance/          # 6 — theming controls (bg, buttons, text, etc.)
│   ├── auth/                # 2 — LoginForm, RegisterForm
│   ├── cards/               # 5 — CardEditor, CardList, CardPreview, etc.
│   ├── collections/         # 6 — CollectionBlock, CreateCollection, etc.
│   ├── dashboard/           # 3 — Sidebar, PreviewFrame, Wrapper
│   ├── links/               # 6 — CreateLink, LinkCard, LinkRow, etc.
│   ├── profile/             # 2 — ProfileHeader, PublicProfileHeader
│   ├── ui/                  # 6 — Button, Input, ColorPicker, Spinner, etc.
│   └── background.tsx       # Animated landing background
├── context/
│   ├── AuthContext.tsx       # Auth state (login, register, logout, refresh)
│   └── AppContext.tsx        # Dashboard state (profile, card, style, CRUD)
├── hooks/
│   ├── useAuth.ts           # Re-exports useAuthContext
│   ├── useCard.ts           # Fetch single card by ID
│   └── useDebouncedValue.ts # Generic debounce hook
├── lib/
│   ├── api.ts               # apiFetch() — fetch wrapper with auth + retry
│   ├── auth.ts              # Token storage (localStorage + session cookie)
│   ├── types.ts             # All TypeScript interfaces
│   ├── fonts.ts             # 18 Google Fonts via next/font
│   ├── theme.ts             # Theme presets + resolver
│   └── style-mappings.ts    # Tailwind class maps (sizes, radius, shadows)
└── utils/
    ├── colors.ts            # Hex color utilities (luminance, lighten, darken)
    └── validate.ts          # URL validation + domain extraction
```

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```
