# LinkForge Frontend

Next.js (App Router) + Tailwind CSS frontend for LinkForge, a link-in-bio page builder.

## Requirements

- Node.js 20+
- LinkForge backend running (FastAPI) at `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`)

## Setup

From this folder:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Routes

- `/` — marketing / landing
- `/login` — sign in
- `/register` — create account
- `/dashboard` — authenticated overview
- `/dashboard/cards` — list + create cards
- `/dashboard/cards/:card_id` — edit one card (links + collections)
- `/dashboard/appearance` — profile + theme preset
- `/u/:username` — public profile (first card)
- `/u/:username/:cardName` — public card view

## Data Model (Frontend View)

The backend stores data as:

```
User
└── Card(s)
    ├── Link(s)            (top-level)
    └── Collection(s)
        └── Link(s)        (nested)
```

Top-level ordering is driven by `position` across both links and collections. Links inside
collections have their own `position` ordering.

## Auth

- JWT access + refresh tokens are stored in `localStorage`.
- `apiFetch()` automatically refreshes the token pair on `401`, retries once, and logs out on failure.
- Next.js `proxy.ts` blocks `/dashboard/*` navigations when the session cookie flag is missing.
