# LinkForge

LinkForge is a link-in-bio platform where users can create a public profile page and organize links into cards and collections.

This is a full-stack Next.js application — the backend API routes live alongside the frontend in the same project.

---

## Product Overview

- Users sign up, log in, and manage their content from an authenticated dashboard
- Each user has a public profile page identified by username
- Content is organized into cards
- Each card can contain top-level links and collections
- Collections can contain ordered links

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| ORM | Prisma 7.9 (PostgreSQL) |
| Auth | Auth.js v5 (JWT sessions) |
| Database | PostgreSQL |
| Storage | Cloudflare R2 (avatars) |
| Validation | Zod |
| Drag & Drop | @dnd-kit |

---

## Data Model

### User

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| username | String(30) | Unique |
| email | String | Unique |
| password | String | Argon2 hashed |
| fullname | String | |
| bio | String? | |
| avatar_url | String? | R2 URL |
| current_card | String? | FK → Card |

### Card

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → User |
| name | String | |
| style | JSON | CardTheme object |

### Collection

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| card_id | UUID | FK → Card |
| title | String | Unique per card |
| position | Int | Sort order |

### Link

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| card_id | UUID | FK → Card |
| collection_id | UUID? | FK → Collection (null = top-level) |
| title | String | |
| url | String | |
| position | Int | Sort order |

---

## API Routes

### Auth

| Method | Route | Description |
|------|-------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `GET/POST` | `/api/auth/[...nextauth]` | Auth.js handlers |
| `GET` | `/api/auth/me` | Get current user |

### Profile

| Method | Route | Description |
|------|-------|-------------|
| `GET` | `/api/profile/me` | Get current user's profile |
| `PATCH` | `/api/profile/me` | Update profile |
| `PATCH` | `/api/profile/current` | Set current card |
| `POST` | `/api/profile/upload-avatar` | Upload avatar to R2 |
| `GET` | `/api/profile/[username]` | Get public profile |

### Cards

| Method | Route | Description |
|------|-------|-------------|
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

### Collections

| Method | Route | Description |
|------|-------|-------------|
| `GET` | `/api/collections` | List collections for a card |
| `POST` | `/api/collections` | Create a collection |
| `PATCH` | `/api/collections/[collectionId]` | Update collection title |
| `DELETE` | `/api/collections/[collectionId]` | Delete a collection |

### Links

| Method | Route | Description |
|------|-------|-------------|
| `GET` | `/api/links` | List links for a card |
| `POST` | `/api/links` | Create a link |
| `PATCH` | `/api/links/[linkId]` | Update a link |
| `DELETE` | `/api/links/[linkId]` | Delete a link |
| `PATCH` | `/api/links/[linkId]/move` | Move link between collections |
| `PATCH` | `/api/links/reorder` | Reorder links |

---

## Auth

- Auth.js v5 with JWT session strategy
- Credentials provider (email + password with Argon2)
- Optional Google/GitHub OAuth
- Session cookie sent automatically on same-origin requests
- `proxy.ts` middleware protects `/dashboard/*` routes

---

## Project Structure

```text
linkforge/
├── app/
│   ├── api/                    # API routes (30 endpoints)
│   ├── (auth)/                 # Login, register pages
│   ├── dashboard/              # Dashboard pages
│   └── u/[username]/           # Public profile
├── components/                 # React components
├── context/                    # React context (Card, Profile, Style)
├── lib/
│   ├── auth-config.ts          # Auth.js configuration
│   ├── db.ts                   # Prisma client
│   ├── api.ts                  # apiFetch() wrapper
│   ├── validations/            # Zod schemas
│   └── ...
├── prisma/
│   └── schema.prisma           # Database schema
└── proxy.ts                    # Route guard middleware
```

---

## Development Notes

- Database migrations: `npx prisma migrate dev`
- Prisma client generates to `lib/generated/prisma/client.ts`
- Prisma 7.x requires `@prisma/adapter-pg` driver adapter
- Auth.js config lives in `lib/auth-config.ts` (not in route file)
- OAuth providers conditionally included only when env vars are set
