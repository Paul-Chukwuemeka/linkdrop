# Frontend Agent Prompt — LinkForge

## Your Role

You are a senior frontend engineer scaffolding a production-grade Next.js + Tailwind CSS app for **LinkForge**, a link-in-bio platform. You write clean, well-typed TypeScript, wire every screen to the real backend API, and follow the design conventions in the attached `SKILL.md` without being asked twice.

---

## Project Context

The backend is a FastAPI app with JWT auth (access + refresh token pair). The data model is hierarchical:

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
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript (strict mode) |
| State | React context + `useState` / `useReducer` — no Redux |
| Data fetching | `fetch` with custom hooks; server components where possible |
| Auth storage | `httpOnly` cookies via a Next.js route handler proxy OR `localStorage` — pick one and be consistent |

---

## Backend API Base URL

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Read from `process.env.NEXT_PUBLIC_API_URL` everywhere. Never hardcode the URL.

---

## API Reference

### Auth — `/auth`

| Method | Route | Description |
|---|---|---|
| POST | `/auth/signup` | Create account — body: `{ username, email, password, fullname }` |
| POST | `/auth/login` | Log in — returns `{ access_token, refresh_token }` |
| POST | `/auth/refresh` | Get new token pair — body: `{ refresh_token }` |
| GET | `/auth/me` | Get current user — requires `Authorization: Bearer <access_token>` |

### Profile — `/profile`

| Method | Route | Description |
|---|---|---|
| GET | `/profile/me` | Get current user's profile |
| PATCH | `/profile/me` | Update `username`, `fullname`, `bio`, `avatar_url`, `theme` |
| GET | `/profile/{username}` | Get any user's public profile |

### Cards — `/cards`

| Method | Route | Description |
|---|---|---|
| GET | `/cards/me` | List all cards belonging to the current user |
| POST | `/cards` | Create a card — body: `{ name }` |
| GET | `/cards/{card_id}` | Get one card |
| PATCH | `/cards/{card_id}` | Update card `name` |
| DELETE | `/cards/{card_id}` | Delete a card |
| GET | `/cards/{card_id}/items` | Get mixed top-level links + collections for a card |
| PATCH | `/cards/{card_id}/items/reorder` | Reorder top-level items — body: `{ items: [{ id, type, position }] }` |

### Collections — `/collections`

| Method | Route | Description |
|---|---|---|
| GET | `/collections?card_id={id}` | List collections for a card |
| POST | `/collections` | Create — body: `{ card_id, title }` |
| PATCH | `/collections/{collection_id}` | Update `title` |
| DELETE | `/collections/{collection_id}` | Delete |

### Links — `/links`

| Method | Route | Description |
|---|---|---|
| GET | `/links?card_id={id}` or `?collection_id={id}` | List links |
| POST | `/links` | Create — body: `{ card_id, collection_id?, title, url }` |
| PATCH | `/links/{link_id}` | Update `title` or `url` |
| PATCH | `/links/{link_id}/move` | Move between top-level and a collection |
| PATCH | `/links/reorder` | Reorder links inside a collection |
| DELETE | `/links/{link_id}` | Delete |

### Auth Notes

- Attach `Authorization: Bearer <access_token>` to every protected request.
- On a `401` response, call `POST /auth/refresh` with the stored refresh token to get a new pair, then retry the original request once.
- If refresh also fails, clear tokens and redirect to `/login`.
- Implement this retry logic once in a central `apiFetch()` utility — not scattered across components.

---

## File Structure to Scaffold

```
frontend/
├── app/
│   ├── layout.tsx                    ← root layout, fonts, global CSS
│   ├── page.tsx                      ← marketing / landing page or redirect
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx                ← auth guard, sidebar/nav
│   │   ├── page.tsx                  ← card list overview
│   │   ├── appearance/page.tsx       ← edit profile + theme
│   │   └── cards/
│   │       ├── page.tsx              ← list + create cards
│   │       └── [card_id]/
│   │           └── page.tsx          ← edit one card (links + collections)
│   └── u/
│       └── [username]/
│           ├── page.tsx              ← public profile (first card)
│           └── [cardName]/
│               └── page.tsx          ← public card view
├── components/
│   ├── ui/                           ← Button, Input, Modal, Spinner, etc.
│   ├── auth/                         ← LoginForm, RegisterForm
│   ├── profile/                      ← ProfileHeader, AvatarUpload, ThemePicker
│   ├── cards/                        ← CardList, CardRow, CardEditor
│   ├── collections/                  ← CollectionBlock, CollectionEditor
│   ├── links/                        ← LinkCard (public), LinkRow (editor)
│   └── dashboard/                    ← Sidebar, DashboardNav, PreviewFrame
├── lib/
│   ├── api.ts                        ← apiFetch() with token refresh logic
│   ├── auth.ts                       ← token storage helpers
│   └── types.ts                      ← all shared TypeScript interfaces
├── hooks/
│   ├── useAuth.ts
│   ├── useCard.ts
│   ├── useLinks.ts
│   └── useCollections.ts
├── context/
│   └── AuthContext.tsx
└── middleware.ts                     ← protect /dashboard routes
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

### `lib/auth.ts`
- `getAccessToken()` / `setAccessToken(token)` / `clearTokens()`
- `getRefreshToken()` / `setRefreshToken(token)`
- Store tokens in `localStorage` (or cookies — pick one, document the choice in a comment).

### `lib/api.ts`
```ts
// apiFetch wraps fetch with:
// 1. Base URL injection
// 2. Authorization header
// 3. Automatic token refresh on 401
// 4. Redirect to /login if refresh fails
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T>
```

### `context/AuthContext.tsx`
```ts
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}
```
On mount, call `GET /auth/me` to restore session. Expose `useAuth()` hook.

### `middleware.ts`
Redirect unauthenticated requests to `/dashboard/*` → `/login`.

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
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Add a `.env.example` file with this variable. Document that `NEXT_PUBLIC_API_URL` must point to the FastAPI server.

---

## What to Deliver

1. The full file structure above, with every file containing real, working code — no placeholder comments like `// TODO: implement`.
2. `lib/types.ts` with all interfaces.
3. `lib/api.ts` with the `apiFetch` utility including token refresh logic.
4. `context/AuthContext.tsx` with session restoration on mount.
5. `middleware.ts` protecting `/dashboard`.
6. All pages and components listed in the file structure.
7. A `README.md` at the frontend root with: setup steps, env vars, and a short description of the Card → Collection → Link hierarchy.

Do not install or reference any backend packages. The frontend communicates with the FastAPI backend exclusively via HTTP.
