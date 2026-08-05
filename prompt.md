# Frontend Agent Prompt — LinkDrop

## Your Role

You are a senior frontend engineer scaffolding a production-grade Next.js + Tailwind CSS app for **LinkDrop**, a link-in-bio platform. You write clean, well-typed TypeScript, wire every screen to the real backend API, and follow the design conventions in the attached `SKILL.md` without being asked twice.

---

## Project Context

The backend is implemented as Next.js API routes with Prisma ORM and Auth.js v5. The data model is hierarchical:

```
User
└── Card(s)            ← a named page the user publishes
    ├── Link(s)        ← top-level links on that card
    └── Collection(s)  ← grouped sections on that card
        └── Link(s)    ← links nested inside a collection
```

A user can have multiple cards. Each card is its own public page, accessible at `/u/[username]/[cardName]`. The user's default public URL (`/u/[username]`) shows their first card.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Language | TypeScript (strict mode) |
| State | React context + `useState` / `useReducer` — no Redux |
| Data fetching | `fetch` with custom hooks; server components where possible |
| Auth | Auth.js v5 — JWT sessions via `httpOnly` cookies |
| ORM | Prisma 7.9 (PostgreSQL) |
| Validation | Zod |

---

## Backend API

All API routes live under `/api/*` in the Next.js app. They use Prisma for database access and Auth.js session cookies for authentication.

### Auth — `/api/auth`

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create account — body: `{ username, email, password, fullname }` |
| GET/POST | `/api/auth/[...nextauth]` | Auth.js handlers (Credentials + optional OAuth) |
| GET | `/api/auth/me` | Get current user info |

### Profile — `/api/profile`

| Method | Route | Description |
|---|---|---|
| GET | `/api/profile/me` | Get current user's profile |
| PATCH | `/api/profile/me` | Update `username`, `fullname`, `bio`, `avatar_url` |
| PATCH | `/api/profile/current` | Set current card |
| POST | `/api/profile/upload-avatar` | Upload avatar to Cloudflare R2 |
| GET | `/api/profile/[username]` | Get any user's public profile |

### Cards — `/api/cards`

| Method | Route | Description |
|---|---|---|
| GET | `/api/cards/me` | List all cards belonging to the current user |
| POST | `/api/cards` | Create a card — body: `{ name }` |
| GET | `/api/cards/[cardId]` | Get one card |
| PATCH | `/api/cards/[cardId]` | Update card `name` |
| DELETE | `/api/cards/[cardId]` | Delete a card |
| GET | `/api/cards/[cardId]/items` | Get mixed top-level links + collections |
| PATCH | `/api/cards/[cardId]/items/reorder` | Reorder top-level items — body: `{ items: [{ id, type, position }] }` |
| PATCH | `/api/cards/[cardId]/style` | Update card style/theme |

### Collections — `/api/collections`

| Method | Route | Description |
|---|---|---|
| GET | `/api/collections?card_id={id}` | List collections for a card |
| POST | `/api/collections` | Create — body: `{ card_id, title }` |
| PATCH | `/api/collections/[collectionId]` | Update `title` |
| DELETE | `/api/collections/[collectionId]` | Delete |

### Links — `/api/links`

| Method | Route | Description |
|---|---|---|
| GET | `/api/links?card_id={id}` or `?collection_id={id}` | List links |
| POST | `/api/links` | Create — body: `{ card_id, collection_id?, title, url }` |
| PATCH | `/api/links/[linkId]` | Update `title` or `url` |
| PATCH | `/api/links/[linkId]/move` | Move between top-level and a collection |
| PATCH | `/api/links/reorder` | Reorder links inside a collection |
| DELETE | `/api/links/[linkId]` | Delete |

### Auth Notes

- Auth.js session cookie (`next-auth.session-token`) is sent automatically on same-origin requests.
- `apiFetch()` uses `credentials: "include"` for cookie-based auth — no token management needed.
- `proxy.ts` middleware protects `/dashboard/*` routes by checking for the session cookie.

---

## File Structure

```
linkdrop/
├── app/
│   ├── layout.tsx                    # root layout, fonts, global CSS
│   ├── page.tsx                      # marketing / landing page
│   ├── providers.tsx                 # SessionProvider wrapper
│   ├── (auth)/
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
│   │   ├── layout.tsx                # auth guard, sidebar/nav
│   │   ├── page.tsx                  # card editor
│   │   ├── appearance/page.tsx       # theme customiser
│   │   └── cards/page.tsx            # cards management
│   └── u/[username]/page.tsx         # public profile
├── components/
│   ├── ui/                           # Button, Input, Modal, Spinner
│   ├── auth/                         # LoginForm, RegisterForm
│   ├── profile/                      # ProfileHeader, PublicProfileHeader
│   ├── cards/                        # CardEditor, CardList, CardPreview
│   ├── collections/                  # CollectionBlock, CollectionEditor
│   ├── links/                        # LinkCard, LinkRow, CreateLink
│   └── dashboard/                    # Sidebar, PreviewFrame
├── lib/
│   ├── auth-config.ts               # Auth.js configuration
│   ├── auth-helpers.ts              # requireAuth() server helper
│   ├── db.ts                        # Prisma client singleton
│   ├── api.ts                       # apiFetch() cookie-based wrapper
│   ├── api-utils.ts                 # Response helpers
│   ├── card-utils.ts                # buildCardItemsList()
│   ├── s3.ts                        # Cloudflare R2 client
│   ├── types.ts                     # TypeScript interfaces
│   ├── constants.ts                 # DEFAULT_CARD_STYLE
│   └── validations/                 # Zod schemas
├── context/
│   ├── CardContext.tsx               # Card state + CRUD
│   ├── ProfileContext.tsx            # Profile state
│   └── StyleContext.tsx              # Card style state
├── prisma/
│   └── schema.prisma                # Database schema (7 models)
└── proxy.ts                         # Route guard middleware
```

---

## TypeScript Interfaces

Define all of these in `lib/types.ts`. Use them everywhere — no `any`.

```ts
interface User {
  id: string;
  username: string;
  email: string;
  fullname: string;
  bio: string | null;
  avatar_url: string | null;
  theme: string | null;
}

interface Card {
  id: string;
  user_id: string;
  name: string;
}

interface Collection {
  id: string;
  card_id: string;
  title: string;
  position: number;
  links?: Link[];
}

interface Link {
  id: string;
  card_id: string;
  collection_id: string | null;
  title: string;
  url: string;
  position: number;
}

// Mixed item returned by GET /cards/{card_id}/items
type CardItem =
  | { type: 'link'; data: Link }
  | { type: 'collection'; data: Collection };
```

---

## Auth Implementation

### `lib/auth-config.ts`
- Auth.js v5 configuration with Credentials provider (Argon2)
- Optional Google/GitHub OAuth (conditionally included when env vars set)
- JWT session strategy

### `lib/api.ts`
```ts
// apiFetch wraps fetch with:
// 1. JSON serialization via json option
// 2. Cookie-based auth (credentials: "include")
// 3. Error handling with ApiError class
async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T>
```

### `context/ProfileContext.tsx`
- Loads profile from `/api/profile/me` on mount
- Provides `profile` state to the app

### `proxy.ts` middleware
- Redirects authenticated users away from `/login` and `/register` → `/dashboard`
- Redirects unauthenticated users away from `/dashboard/*` → `/login`

---

## Dashboard — Card Editor (`/dashboard/cards/[card_id]`)

This is the most complex screen. It must support:

1. **Load card items** via `GET /cards/{card_id}/items` — render top-level links and collections in `position` order.
2. **Drag-to-reorder top-level items** — on drop, call `PATCH /cards/{card_id}/items/reorder`.
3. **Inline link editing** — click a link title or URL to edit in place; `PATCH /links/{link_id}` on blur.
4. **Add link** — form at the bottom: title + URL → `POST /links` with `card_id`.
5. **Add collection** — title input → `POST /collections` with `card_id`.
6. **Reorder links within a collection** — drag handle inside each `CollectionBlock`; call `PATCH /links/reorder`.
7. **Move a link** — drag from top-level into a collection or vice versa; call `PATCH /links/{link_id}/move`.
8. **Delete** — confirm before calling DELETE on links or collections.
9. **Live preview** — a phone-frame `PreviewFrame` component showing the rendered public card, debounced 300ms.

Use `@dnd-kit/core` and `@dnd-kit/sortable` for all drag-and-drop.

---

## Public Pages

### `app/u/[username]/page.tsx`
- **Server component.** Fetch `GET /profile/{username}` server-side.
- Render `<ProfileHeader>` (avatar, name, bio) + the first card's items.
- Generate `<head>` metadata via `generateMetadata()` with OG tags.

### `app/u/[username]/[cardName]/page.tsx`
- **Server component.** Fetch the specific card's items.
- Render collections and links using the same theming system.
- All `<LinkCard>` elements are `<a>` tags with `target="_blank" rel="noopener noreferrer"`.

### Theming
- The `User.theme` field is a JSON string or a preset key. Parse it and inject as CSS variables on the `<body>` or a wrapper `<div>`.
- Use the variable names from `SKILL.md`: `--card-bg`, `--card-text`, `--accent`, `--card-radius`, etc.
- Default to a clean light theme if `theme` is null.

---

## Error Handling

- All API calls must be wrapped in try/catch.
- Show inline error messages on forms (not just `console.error`).
- Network errors on the public page: render a graceful "Page not found" or "Failed to load" UI.
- `401` on dashboard: redirect to `/login` (handled by `apiFetch`).

---

## Environment Variables

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_URL=...
NEXT_PUBLIC_R2_HOSTNAME=...
```

---

## What to Deliver

1. The full file structure above, with every file containing real, working code — no placeholder comments like `// TODO: implement`.
2. `lib/types.ts` with all interfaces.
3. `lib/api.ts` with the `apiFetch` utility including token refresh logic.
4. `context/AuthContext.tsx` with session restoration on mount.
5. `middleware.ts` protecting `/dashboard`.
6. All pages and components listed in the file structure.
7. A `README.md` at the frontend root with: setup steps, env vars, and a short description of the Card → Collection → Link hierarchy.

Do not install or reference any external backend packages. The backend is fully implemented as Next.js API routes.
