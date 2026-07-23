# LinkForge

Full-stack link-in-bio page builder built with Next.js 16 (App Router) + Prisma + Auth.js v5.

## Tech Stack

- **Next.js** 16.2 — App Router, API routes
- **React** 19.2
- **Prisma** 7.9 — PostgreSQL ORM with driver adapter
- **Auth.js** v5 — JWT sessions, Credentials + optional OAuth
- **Tailwind CSS** 4
- **@dnd-kit** — drag-and-drop reordering
- **react-easy-crop** — image cropping for avatars
- **Cloudflare R2** — avatar uploads
- **Argon2** — password hashing

## Requirements

- Node.js 20+
- PostgreSQL 14+

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL, AUTH_SECRET, and R2 credentials

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

Then open `http://localhost:3000`.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Auth.js secret (generate with `npx auth secret`) |
| `AUTH_GOOGLE_ID` | (Optional) Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | (Optional) Google OAuth client secret |
| `AUTH_GITHUB_ID` | (Optional) GitHub OAuth client ID |
| `AUTH_GITHUB_SECRET` | (Optional) GitHub OAuth client secret |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | R2 public URL for avatars |
| `NEXT_PUBLIC_R2_HOSTNAME` | R2 hostname for image optimization |

## Routes

### Pages

| Path | Description | Auth |
|------|-------------|------|
| `/` | Landing / marketing page | No |
| `/login` | Sign in | No |
| `/register` | Create account | No |
| `/dashboard` | Card editor (links + collections) | Yes |
| `/dashboard/cards` | List + manage cards | Yes |
| `/dashboard/appearance` | Card theming + styling | Yes |
| `/u/:username` | Public profile (active card) | No |

### API Routes

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `GET/POST` | `/api/auth/[...nextauth]` | Auth.js handlers |
| `GET` | `/api/auth/me` | Current user info |
| `GET` | `/api/profile/me` | Get current user's profile |
| `PATCH` | `/api/profile/me` | Update profile |
| `PATCH` | `/api/profile/current` | Set current card |
| `POST` | `/api/profile/upload-avatar` | Upload avatar to R2 |
| `GET` | `/api/profile/[username]` | Get public profile |
| `GET` | `/api/cards` | List current user's cards |
| `POST` | `/api/cards` | Create a card |
| `GET` | `/api/cards/me` | List cards (alias) |
| `GET` | `/api/cards/current/list` | Get current card with items |
| `GET` | `/api/cards/[cardId]` | Get one card (public) |
| `GET` | `/api/cards/[cardId]/list` | Get card with items (auth) |
| `GET` | `/api/cards/[cardId]/items` | Get card items (alias) |
| `PATCH` | `/api/cards/[cardId]` | Update card |
| `DELETE` | `/api/cards/[cardId]` | Delete card |
| `PATCH` | `/api/cards/[cardId]/style` | Update card style |
| `PATCH` | `/api/cards/[cardId]/reorder` | Reorder card items |
| `PATCH` | `/api/cards/[cardId]/items/reorder` | Reorder items (alias) |
| `GET` | `/api/links` | List links |
| `POST` | `/api/links` | Create a link |
| `PATCH` | `/api/links/[linkId]` | Update a link |
| `DELETE` | `/api/links/[linkId]` | Delete a link |
| `PATCH` | `/api/links/[linkId]/move` | Move link between collections |
| `PATCH` | `/api/links/reorder` | Reorder links |
| `GET` | `/api/collections` | List collections |
| `POST` | `/api/collections` | Create a collection |
| `PATCH` | `/api/collections/[collectionId]` | Update collection |
| `DELETE` | `/api/collections/[collectionId]` | Delete collection |

## Auth

- Auth.js v5 with JWT session strategy
- Credentials provider (email + password with Argon2)
- Optional Google/GitHub OAuth (configure via env vars)
- Session cookie (`authjs.session-token`) sent automatically on same-origin requests
- `apiFetch()` uses `credentials: "include"` for cookie-based auth
- `proxy.ts` middleware protects `/dashboard/*` routes

## Data Model

```
User
├── Account(s)         ← OAuth accounts (Auth.js)
├── Session(s)         ← Active sessions (Auth.js)
└── Card(s)
    ├── Link(s)        ← top-level, position-ordered
    └── Collection(s)  ← position-ordered
        └── Link(s)    ← nested, own position order
```

## Project Structure

```
linkforge/
├── app/
│   ├── layout.tsx              # Root layout (fonts, providers)
│   ├── page.tsx                # Landing page
│   ├── providers.tsx           # SessionProvider wrapper
│   ├── globals.css             # CSS custom properties + Tailwind
│   ├── error.tsx               # Error boundary
│   ├── loading.tsx             # Loading state
│   ├── not-found.tsx           # 404 page
│   ├── (auth)/
│   │   ├── layout.tsx          # Auth pages layout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # Auth.js catch-all
│   │   ├── auth/signup/route.ts
│   │   ├── auth/me/route.ts
│   │   ├── profile/me/route.ts
│   │   ├── profile/current/route.ts
│   │   ├── profile/upload-avatar/route.ts
│   │   ├── profile/[username]/route.ts
│   │   ├── cards/route.ts
│   │   ├── cards/me/route.ts
│   │   ├── cards/current/list/route.ts
│   │   ├── cards/[cardId]/route.ts
│   │   ├── cards/[cardId]/list/route.ts
│   │   ├── cards/[cardId]/items/route.ts
│   │   ├── cards/[cardId]/style/route.ts
│   │   ├── cards/[cardId]/reorder/route.ts
│   │   ├── cards/[cardId]/items/reorder/route.ts
│   │   ├── links/route.ts
│   │   ├── links/[linkId]/route.ts
│   │   ├── links/[linkId]/move/route.ts
│   │   ├── links/reorder/route.ts
│   │   ├── collections/route.ts
│   │   └── collections/[collectionId]/route.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── appearance/page.tsx
│   │   └── cards/page.tsx
│   └── u/[username]/page.tsx   # Public profile
├── components/
│   ├── appearance/             # Theming controls
│   ├── auth/                   # LoginForm, RegisterForm
│   ├── cards/                  # CardEditor, CardList, CardPreview
│   ├── collections/            # CollectionBlock, CreateCollection
│   ├── dashboard/              # Sidebar, PreviewFrame
│   ├── landing/                # HeroForm (landing page)
│   ├── links/                  # CreateLink, LinkCard, LinkRow
│   ├── profile/                # ProfileHeader, PublicProfileHeader
│   ├── background.tsx          # Background gradient/image renderer
│   └── ui/                     # Button, Input, ColorPicker, Spinner, AvatarCropModal
├── context/
│   ├── CardContext.tsx          # Card state + CRUD
│   ├── ProfileContext.tsx       # Profile state
│   └── StyleContext.tsx         # Card style state
├── lib/
│   ├── auth-config.ts          # Auth.js configuration
│   ├── auth-helpers.ts         # requireAuth() helper
│   ├── db.ts                   # Prisma client singleton
│   ├── api.ts                  # apiFetch() — cookie-based wrapper
│   ├── api-utils.ts            # Response helpers
│   ├── card-utils.ts           # buildCardItemsList()
│   ├── constants.ts            # DEFAULT_CARD_STYLE
│   ├── fonts.ts                # Next.js font definitions
│   ├── s3.ts                   # Cloudflare R2 client
│   ├── style-mappings.ts       # Theme value mappings
│   ├── types.ts                # TypeScript interfaces
│   └── validations/            # Zod schemas
├── prisma/
│   ├── schema.prisma           # Database schema (7 models)
│   └── migrations/             # Database migrations
├── prisma.config.ts            # Prisma 7.x configuration
└── proxy.ts                    # Route guard middleware
```

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```
