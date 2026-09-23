# Forgot Password Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Users who forgot their password can request a reset link by email and set a new password, in the flyer-styled auth UI.

**Architecture:** Token-based reset following existing repo patterns: zod schemas in `lib/validations/auth.ts`, API routes using `readJsonBody`/`errorResponse` from `lib/api-utils` with `checkRateLimit` throttles, argon2 password hashing, SHA-256-hashed single-use tokens in a new `PasswordResetToken` table, Resend for email with a console fallback when no API key is configured. Two new pages under `app/(auth)/` reuse the receipt-ticket shell from the login/register restyle.

**Tech Stack:** Next.js App Router route handlers, Prisma 7 + PostgreSQL, next-auth sessions, argon2, zod 4, vitest, Resend (`resend` npm package).

**Spec:** Inline requirements below (bounded auth addition; no separate spec doc). `LoginForm` already links to `/forgot-password`, which currently 404s — this plan builds that route plus `/reset-password`.

## Requirements (binding)

1. `POST /api/auth/password/forgot` accepts `{ email }`, always returns 200 (never reveals whether the email exists), rate-limited to 5/min per IP.
2. `POST /api/auth/password/reset` accepts `{ token, new_password }`, returns 204 on success, 400 for invalid/expired/used tokens or weak passwords, rate-limited to 10/min per IP.
3. Tokens: 32 random bytes, only the SHA-256 hash stored, 1-hour expiry, single-use (`usedAt`), requesting a new link invalidates older ones. OAuth-only accounts (null password) may set a password via reset.
4. On successful reset, all `Session` rows for the user are deleted.
5. Email via Resend; when `RESEND_API_KEY` is unset (local dev/test), log the link and skip sending. Sender defaults to `Dropcard <hello@dropcard.co>`, overridable with `EMAIL_FROM`.
6. UI matches the current auth restyle: receipt ticket, mono `//` eyebrows, Space Grotesk lowercase headings, green 2px inputs, sticker-shadow submit buttons, dashed dividers, coral-tinted errors, flyer-lowercase copy.
7. No user enumeration anywhere (same response + same timing shape for unknown emails).

## Global Constraints

- Base branch for this work: `feat/auth-flyer` (the receipt-ticket auth shell lives there, unmerged). New work goes on `feat/forgot-password` branched from it.
- Copy is lowercase flyer voice; never invent features or claims.
- Muted text uses `#5a5a48`; coral `#e2603f` is decoration-only, coral-dark `#b8401f` for error text on light backgrounds.
- Decorative elements get `aria-hidden`; error outputs keep `role="alert"`.
- TDD: failing test first for every behavior change; commit after each task.
- Never commit secrets; `.env` stays local (add keys to `.env.example` only).

---

### Task 1: Email delivery via Resend

**Files:**
- Modify: `package.json` (add `resend` dependency via install command)
- Create: `lib/email.ts`
- Create: `lib/email.test.ts`
- Modify: `.env.example` (add `RESEND_API_KEY=` and `EMAIL_FROM=` lines)

**Interfaces:**
- Consumes: `process.env.RESEND_API_KEY`, `process.env.EMAIL_FROM`, `process.env.NEXT_PUBLIC_SITE_URL` (only as fallback context, not directly)
- Produces: `sendPasswordResetEmail(to: string, resetUrl: string): Promise<{ delivered: boolean }>` — used by Task 4

- [ ] **Step 1: Install the Resend package**

Run: `npm install resend`
Expected: `package.json` gains `"resend"` in dependencies.

- [ ] **Step 2: Write the failing test**

`lib/email.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const sendMock = vi.fn()

vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: sendMock } })),
}))

import { sendPasswordResetEmail } from "./email"

const OLD_ENV = { ...process.env }

describe("sendPasswordResetEmail", () => {
  beforeEach(() => {
    sendMock.mockReset()
    sendMock.mockResolvedValue({ data: { id: "email-1" }, error: null })
    process.env = { ...OLD_ENV, RESEND_API_KEY: "re_test_key" }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it("sends the reset link to the given address", async () => {
    const result = await sendPasswordResetEmail(
      "jane@example.com",
      "http://localhost:3000/reset-password?token=abc",
    )
    expect(result).toEqual({ delivered: true })
    expect(sendMock).toHaveBeenCalledOnce()
    const payload = sendMock.mock.calls[0][0]
    expect(payload.to).toBe("jane@example.com")
    expect(payload.text).toContain("http://localhost:3000/reset-password?token=abc")
  })

  it("logs instead of sending when no API key is configured", async () => {
    delete process.env.RESEND_API_KEY
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    const result = await sendPasswordResetEmail("jane@example.com", "http://x/y?token=abc")
    expect(result).toEqual({ delivered: false })
    expect(sendMock).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalled()
    logSpy.mockRestore()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run lib/email.test.ts`
Expected: FAIL with "Cannot find module './email'".

- [ ] **Step 4: Write minimal implementation**

`lib/email.ts`:

```ts
import { Resend } from "resend"

const EMAIL_FROM = process.env.EMAIL_FROM ?? "Dropcard <hello@dropcard.co>"

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<{ delivered: boolean }> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email:dev] password reset link for ${to}: ${resetUrl}`)
    return { delivered: false }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "reset your dropcard password",
    text: `someone requested a password reset for your dropcard account.\n\nset a new password here (valid for 1 hour):\n${resetUrl}\n\nif that wasn't you, ignore this email.`,
  })
  return { delivered: true }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run lib/email.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Document the env keys**

Append to `.env.example`:

```
RESEND_API_KEY=
EMAIL_FROM=
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json lib/email.ts lib/email.test.ts .env.example
git commit -m "feat(auth): send password reset emails via resend"
```

---

### Task 2: PasswordResetToken model and migration

**Files:**
- Modify: `prisma/schema.prisma` (add relation + new model)
- Modify: `prisma/migrations/*` (generated by migrate command)

**Interfaces:**
- Consumes: existing `User` model (`prisma/schema.prisma:54-73`)
- Produces: `PasswordResetToken` table with fields `id`, `userId`, `tokenHash` (unique), `expiresAt`, `usedAt` (nullable), `createdAt` — used by Tasks 4 and 5 via `prisma.passwordResetToken`

- [ ] **Step 1: Add the relation to User**

In `prisma/schema.prisma`, inside `model User`, after the `cards Card[]` line, add:

```prisma
  resetTokens PasswordResetToken[]
```

- [ ] **Step 2: Add the new model after User (before `model Card`)**

```prisma
model PasswordResetToken {
  id        String    @id @default(uuid()) @db.Uuid
  userId    String    @map("user_id") @db.Uuid
  tokenHash String    @unique @map("token_hash") @db.VarChar(64)
  expiresAt DateTime  @map("expires_at")
  usedAt    DateTime? @map("used_at")
  createdAt DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("password_reset_tokens")
}
```

- [ ] **Step 3: Validate the schema**

Run: `npx prisma validate`
Expected: "The schema is valid".

- [ ] **Step 4: Create and apply the migration**

Run: `npx prisma migrate dev --name add_password_reset_token`
Expected: migration applies cleanly; `npx prisma generate` runs via postinstall hook if needed.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(auth): add password reset token table"
```

---

### Task 3: Token helpers and validation schemas

**Files:**
- Create: `lib/password-reset.ts`
- Create: `lib/password-reset.test.ts`
- Modify: `lib/validations/auth.ts` (append schemas + types)

**Interfaces:**
- Consumes: `PASSWORD_MIN_LENGTH`, `PASSWORD_MAX_LENGTH`, `PASSWORD_PATTERN` from `lib/validations/auth.ts`
- Produces: `RESET_TOKEN_TTL_MS`, `generateResetToken(): { token: string; tokenHash: string }`, `hashResetToken(token: string): string`, `passwordForgotSchema` / `PasswordForgotInput`, `passwordResetSchema` / `PasswordResetInput` — used by Tasks 4 and 5

- [ ] **Step 1: Write the failing helper test**

`lib/password-reset.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { RESET_TOKEN_TTL_MS, generateResetToken, hashResetToken } from "./password-reset"

describe("password reset tokens", () => {
  it("exposes a 1-hour TTL", () => {
    expect(RESET_TOKEN_TTL_MS).toBe(3_600_000)
  })

  it("hashes deterministically to 64 hex chars", () => {
    expect(hashResetToken("abc")).toBe(hashResetToken("abc"))
    expect(hashResetToken("abc")).toMatch(/^[a-f0-9]{64}$/)
    expect(hashResetToken("abc")).not.toBe(hashResetToken("abd"))
  })

  it("generates a unique token whose hash verifies", () => {
    const first = generateResetToken()
    const second = generateResetToken()
    expect(first.token).not.toBe(second.token)
    expect(first.token).toMatch(/^[a-f0-9]{64}$/)
    expect(first.tokenHash).toBe(hashResetToken(first.token))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/password-reset.test.ts`
Expected: FAIL with "Cannot find module './password-reset'".

- [ ] **Step 3: Write minimal implementation**

`lib/password-reset.ts`:

```ts
import { createHash, randomBytes } from "node:crypto"

export const RESET_TOKEN_TTL_MS = 3_600_000

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export function generateResetToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("hex")
  return { token, tokenHash: hashResetToken(token) }
}
```

- [ ] **Step 4: Append the zod schemas**

In `lib/validations/auth.ts`, after `passwordChangeSchema`, add:

```ts
export const passwordForgotSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const passwordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  new_password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters`)
    .regex(
      PASSWORD_PATTERN,
      "Password must contain an uppercase letter, a lowercase letter, and a number"
    ),
})
```

And extend the type exports:

```ts
export type PasswordForgotInput = z.infer<typeof passwordForgotSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>
```

- [ ] **Step 5: Run tests to verify everything passes**

Run: `npx vitest run lib/password-reset.test.ts lib/auth-merge.test.ts`
Expected: PASS. (Runs the existing suite file alongside to catch regressions early.)

- [ ] **Step 6: Commit**

```bash
git add lib/password-reset.ts lib/password-reset.test.ts lib/validations/auth.ts
git commit -m "feat(auth): reset token helpers and validation schemas"
```

---

### Task 4: POST forgot endpoint (request reset link)

**Files:**
- Create: `app/api/auth/password/forgot/route.ts`
- Create: `app/api/auth/password/forgot/route.test.ts`

**Interfaces:**
- Consumes: `passwordForgotSchema` (Task 3), `generateResetToken` (Task 3), `sendPasswordResetEmail` (Task 1), `checkRateLimit` from `lib/rate-limit.ts`, `readJsonBody`/`errorResponse` from `lib/api-utils.ts`, `prisma.user` / `prisma.passwordResetToken`
- Produces: `POST /api/auth/password/forgot` → always `200 { ok: true }` (or 400/429) — consumed by Task 6 page

- [ ] **Step 1: Write the failing tests**

`app/api/auth/password/forgot/route.test.ts` (follows `app/api/auth/password/route.test.ts` mocking conventions):

```ts
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    passwordResetToken: { deleteMany: vi.fn(), create: vi.fn() },
  },
}))

vi.mock("@/lib/email", () => ({
  sendPasswordResetEmail: vi.fn(),
}))

import { POST } from "./route"
import { prisma } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"

function makeRequest(body: unknown, ip: string): Request {
  return new Request("http://localhost/api/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
  })
}

describe("POST /api/auth/password/forgot", () => {
  beforeEach(() => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 })
    vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({ id: "t-1" } as never)
    vi.mocked(sendPasswordResetEmail).mockResolvedValue({ delivered: true })
    vi.clearAllMocks()
  })

  it("returns 400 for an invalid email", async () => {
    const response = await POST(makeRequest({ email: "not-an-email" }, "10.0.0.1"))
    expect(response.status).toBe(400)
    expect(prisma.user.findUnique).not.toHaveBeenCalled()
  })

  it("returns 200 without sending mail for an unknown email", async () => {
    const response = await POST(makeRequest({ email: "ghost@example.com" }, "10.0.0.2"))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(sendPasswordResetEmail).not.toHaveBeenCalled()
    expect(prisma.passwordResetToken.create).not.toHaveBeenCalled()
  })

  it("creates a hashed token and emails the link for a known email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "jane@example.com",
    } as never)
    const response = await POST(makeRequest({ email: "Jane@Example.com" }, "10.0.0.3"))
    expect(response.status).toBe(200)
    expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
    })
    const created = vi.mocked(prisma.passwordResetToken.create).mock.calls[0][0]
    expect(created.data.tokenHash).toMatch(/^[a-f0-9]{64}$/)
    expect(created.data.userId).toBe("user-1")
    const sent = vi.mocked(sendPasswordResetEmail).mock.calls[0]
    expect(sent[0]).toBe("jane@example.com")
    expect(sent[1]).toContain("/reset-password?token=")
  })

  it("returns 429 when rate limited", async () => {
    const ip = "10.0.0.4"
    for (let i = 0; i < 5; i++) {
      await POST(makeRequest({ email: "a@example.com" }, ip))
    }
    const response = await POST(makeRequest({ email: "a@example.com" }, ip))
    expect(response.status).toBe(429)
  })
}
```

Note: each test uses a distinct `x-forwarded-for` IP because `checkRateLimit` keys the in-memory store by IP.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run app/api/auth/password/forgot/route.test.ts`
Expected: FAIL with "Cannot find module './route'".

- [ ] **Step 3: Write minimal implementation**

`app/api/auth/password/forgot/route.ts`:

```ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { passwordForgotSchema } from "@/lib/validations/auth"
import { errorResponse, readJsonBody } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"
import { generateResetToken } from "@/lib/password-reset"
import { RESET_TOKEN_TTL_MS } from "@/lib/password-reset"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  if (!checkRateLimit(request, 5, 60_000)) {
    return errorResponse("Too many requests. Please try again later.", 429)
  }

  const body = await readJsonBody(request)
  if (body === null) return errorResponse("Invalid JSON body", 400)
  const parsed = passwordForgotSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  try {
    const email = parsed.data.email.toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })
      const { token, tokenHash } = generateResetToken()
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      })
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      await sendPasswordResetEmail(user.email, `${base}/reset-password?token=${token}`)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Forgot password error:", e)
    return NextResponse.json({ ok: true })
  }
}
```

Note: the catch block intentionally still returns 200 so a transient failure never reveals account existence. (`errorResponse`/`serverErrorResponse` from `lib/api-utils.ts` follow the same signature as the signup and password-change routes; `readJsonBody` returns `null` on invalid JSON.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run app/api/auth/password/forgot/route.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/auth/password/forgot/route.ts app/api/auth/password/forgot/route.test.ts
git commit -m "feat(auth): request password reset link endpoint"
```

---

### Task 5: POST reset endpoint (set new password)

**Files:**
- Create: `app/api/auth/password/reset/route.ts`
- Create: `app/api/auth/password/reset/route.test.ts`

**Interfaces:**
- Consumes: `passwordResetSchema` (Task 3), `hashResetToken` (Task 3), `checkRateLimit`, `readJsonBody`/`errorResponse`, `prisma.passwordResetToken` / `prisma.user` / `prisma.session`, `argon2.hash`
- Produces: `POST /api/auth/password/reset` → `204` on success — consumed by Task 7 page

- [ ] **Step 1: Write the failing tests**

`app/api/auth/password/reset/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    passwordResetToken: { findUnique: vi.fn(), update: vi.fn() },
    user: { update: vi.fn() },
    session: { deleteMany: vi.fn() },
  },
}))

vi.mock("argon2", () => ({
  default: { hash: vi.fn() },
}))

import { POST } from "./route"
import { prisma } from "@/lib/db"
import { hashResetToken } from "@/lib/password-reset"
import argon2 from "argon2"

const TOKEN = "tok123"
const RECORD = {
  id: "t-1",
  userId: "user-1",
  tokenHash: hashResetToken(TOKEN),
  expiresAt: new Date(Date.now() + 60_000),
  usedAt: null,
}

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  })
}

describe("POST /api/auth/password/reset", () => {
  beforeEach(() => {
    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({ ...RECORD } as never)
    vi.mocked(prisma.passwordResetToken.update).mockResolvedValue({ ...RECORD } as never)
    vi.mocked(prisma.user.update).mockResolvedValue({ id: "user-1" } as never)
    vi.mocked(prisma.session.deleteMany).mockResolvedValue({ count: 2 })
    vi.mocked(argon2.hash).mockResolvedValue("argon2-new-hash")
    vi.clearAllMocks()
  })

  it("returns 400 for a weak password", async () => {
    const response = await POST(makeRequest({ token: TOKEN, new_password: "weak" }))
    expect(response.status).toBe(400)
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("returns 400 for an unknown token", async () => {
    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null)
    const response = await POST(makeRequest({ token: TOKEN, new_password: "NewPass1x" }))
    expect(response.status).toBe(400)
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("returns 400 for an expired token", async () => {
    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
      ...RECORD,
      expiresAt: new Date(Date.now() - 1_000),
    } as never)
    const response = await POST(makeRequest({ token: TOKEN, new_password: "NewPass1x" }))
    expect(response.status).toBe(400)
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("returns 400 for an already-used token", async () => {
    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
      ...RECORD,
      usedAt: new Date(),
    } as never)
    const response = await POST(makeRequest({ token: TOKEN, new_password: "NewPass1x" }))
    expect(response.status).toBe(400)
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("updates the password, marks the token used, and clears sessions", async () => {
    const response = await POST(makeRequest({ token: TOKEN, new_password: "NewPass1x" }))
    expect(response.status).toBe(204)
    expect(argon2.hash).toHaveBeenCalledWith("NewPass1x")
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { password: "argon2-new-hash" },
    })
    expect(prisma.passwordResetToken.update).toHaveBeenCalledWith({
      where: { id: "t-1" },
      data: { usedAt: expect.any(Date) },
    })
    expect(prisma.session.deleteMany).toHaveBeenCalledWith({ where: { userId: "user-1" } })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run app/api/auth/password/reset/route.test.ts`
Expected: FAIL with "Cannot find module './route'".

- [ ] **Step 3: Write minimal implementation**

`app/api/auth/password/reset/route.ts`:

```ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { passwordResetSchema } from "@/lib/validations/auth"
import { errorResponse, readJsonBody, serverErrorResponse } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"
import { hashResetToken } from "@/lib/password-reset"
import argon2 from "argon2"

export async function POST(request: Request) {
  if (!checkRateLimit(request, 10, 60_000)) {
    return errorResponse("Too many requests. Please try again later.", 429)
  }

  const body = await readJsonBody(request)
  if (body === null) return errorResponse("Invalid JSON body", 400)
  const parsed = passwordResetSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashResetToken(parsed.data.token) },
    })
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return errorResponse("This reset link is invalid or has expired", 400)
    }

    const hashed = await argon2.hash(parsed.data.new_password)
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    })
    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    })
    await prisma.session.deleteMany({ where: { userId: record.userId } })

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error("Reset password error:", e)
    return serverErrorResponse("Could not reset password")
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run app/api/auth/password/reset/route.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/auth/password/reset/route.ts app/api/auth/password/reset/route.test.ts
git commit -m "feat(auth): consume password reset token endpoint"
```

---

### Task 6: Forgot-password page (request form)

**Files:**
- Create: `components/auth/ForgotPasswordForm.tsx`
- Create: `app/(auth)/forgot-password/page.tsx`

**Interfaces:**
- Consumes: `POST /api/auth/password/forgot` (Task 4), `FormField` from `components/auth/FormField.tsx`, `Spinner` from `components/ui/Spinner.tsx`
- Produces: `/forgot-password` route — fixes the dead "forgot password?" link in `LoginForm.tsx` (no change needed there; verify the href matches)

- [ ] **Step 1: Create the client form**

`components/auth/ForgotPasswordForm.tsx`:

```tsx
"use client"

import { FormField } from "@/components/auth/FormField"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.trim())) {
      setError("Invalid email format.")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) {
        setError("Something went wrong. Please try again.")
        return
      }
      setSent(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-md border-2 border-dashed border-[#b9b19b] bg-[#f7efdd] p-4 text-center">
        <p className="font-[family-name:var(--font-space-grotesk)] text-lg font-extrabold text-brand-green">
          check your inbox.
        </p>
        <p className="mt-1 font-[family-name:var(--font-jetbrains)] text-[11px] text-[#5a5a48]">
          {"// if that email has an account, the link is on its way"}
        </p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <FormField id="forgot-email" label="Email" error={error ?? undefined}>
        <input
          type="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-md bg-brand-green py-2.5 font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-background-primary sticker-shadow-gold transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Sending reset link…</span>
          </>
        ) : (
          "send reset link"
        )}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Create the page shell**

`app/(auth)/forgot-password/page.tsx` (mirrors the login shell: cream grain column, receipt ticket, poster panel with the existing animated mesh — copy the panel block verbatim from `app/(auth)/login/page.tsx`, swapping the center copy):

```tsx
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"

const meshBackground =
  "radial-gradient(ellipse 80% 50% at 80% 40%, rgba(200, 150, 56, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 60% at 20% 80%, rgba(42, 80, 42, 0.4) 0%, transparent 50%), #1B3A1B"
const glowBackground =
  "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(200, 150, 56, 0.08) 0%, transparent 60%)"

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[55%_45%]">
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="mb-10 flex w-full max-w-md items-center justify-between lg:hidden">
          <Link
            href="/"
            className="font-[family-name:var(--font-space-grotesk)] text-xl font-extrabold tracking-tight text-brand-green"
          >
            Dropcard
          </Link>
        </div>

        <div className="w-full max-w-md rounded-lg border-2 border-dashed border-[#b9b19b] bg-background-elevated p-6 shadow-[0_20px_50px_-12px_rgba(27,58,27,0.18)] sm:p-8">
          <p className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#5a5a48]">
            {"// forgot password"}
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-space-grotesk)] text-3xl font-extrabold tracking-tight text-brand-green">
            lost your password?
          </h1>
          <p className="mt-1 text-sm text-secondary">
            enter your email and we&apos;ll send you a reset link.
          </p>

          <div className="mt-8">
            <ForgotPasswordForm />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-secondary">
          remember it now?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-green underline-offset-2 hover:underline"
          >
            log in
          </Link>
        </p>
      </div>

      <aside
        className="relative hidden min-h-dvh flex-col items-center justify-between overflow-hidden px-10 py-16 lg:flex"
        style={{ background: meshBackground }}
      >
        <div aria-hidden="true" className="bg-noise pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="animate-glow-drift pointer-events-none absolute -inset-1/4"
          style={{ background: glowBackground }}
        />
        <Link
          href="/"
          className="relative z-10 self-start font-[family-name:var(--font-space-grotesk)] text-2xl font-extrabold tracking-tight text-white"
        >
          Dropcard
        </Link>

        <div className="relative z-10 flex flex-col items-center pb-16 text-center">
          <h2 className="max-w-sm font-[family-name:var(--font-space-grotesk)] text-5xl font-extrabold leading-[1.02] tracking-tight text-white">
            happens to <span className="marker-phrase">everyone.</span>
          </h2>
          <p className="mt-4 font-[family-name:var(--font-jetbrains)] text-xs text-white/70">
            {"// back in, in a minute"}
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Secure reset
            </span>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/50">© 2026 Dropcard</p>
      </aside>
    </div>
  )
}
```

- [ ] **Step 3: Verify the login link resolves**

Visit `http://localhost:3000/forgot-password` in dev and click "forgot password?" on `/login` — both render the receipt form with no console errors.

- [ ] **Step 4: Commit**

```bash
git add components/auth/ForgotPasswordForm.tsx app/\(auth\)/forgot-password/page.tsx
git commit -m "feat(auth): forgot password request page"
```

---

### Task 7: Reset-password page (set new password)

**Files:**
- Create: `components/auth/ResetPasswordForm.tsx`
- Create: `app/(auth)/reset-password/page.tsx`

**Interfaces:**
- Consumes: `POST /api/auth/password/reset` (Task 5), `PasswordField` from `components/auth/PasswordField.tsx`, `Spinner` from `components/ui/Spinner.tsx`, `useSearchParams` (requires a `Suspense` boundary, same as `app/(auth)/register/page.tsx`)
- Produces: `/reset-password?token=…` route linked from the reset email

- [ ] **Step 1: Create the client form**

`components/auth/ResetPasswordForm.tsx`:

```tsx
"use client"

import { PasswordField } from "@/components/auth/PasswordField"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { useState } from "react"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      })
      if (res.status === 204) {
        setDone(true)
        return
      }
      const data = await res.json().catch(() => null)
      setError(data?.detail ?? "This reset link is invalid or has expired.")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div role="alert" className="rounded-md border border-accent-coral/40 bg-[#fbe9e1] p-3 text-sm text-accent-coral-dark">
        this page needs a reset link — request a new one from the{" "}
        <Link href="/forgot-password" className="font-semibold underline underline-offset-2">
          forgot password
        </Link>{" "}
        page.
      </div>
    )
  }

  if (done) {
    return (
      <div className="rounded-md border-2 border-dashed border-[#b9b19b] bg-[#f7efdd] p-4 text-center">
        <p className="font-[family-name:var(--font-space-grotesk)] text-lg font-extrabold text-brand-green">
          password updated.
        </p>
        <p className="mt-2 text-sm text-secondary">
          <Link href="/login" className="font-semibold text-brand-green underline-offset-2 hover:underline">
            log in with your new password
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <PasswordField
        id="reset-password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        placeholder="New password"
      />
      <PasswordField
        id="reset-password-confirm"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        placeholder="Repeat new password"
        showStrength={false}
      />

      {error && (
        <div role="alert" className="rounded-md border border-accent-coral/40 bg-[#fbe9e1] p-3 text-sm text-accent-coral-dark">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-md bg-brand-green py-2.5 font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-background-primary sticker-shadow-gold transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Updating password…</span>
          </>
        ) : (
          "set new password"
        )}
      </button>
    </form>
  )
}
```

Note: `data?.detail` matches the error payload shape used by the signup route (`data.detail`); confirm `lib/api-utils.ts` `errorResponse` uses the `detail` key before relying on it — the signup form reads `data.detail`, so the convention holds.

- [ ] **Step 2: Create the page shell with a Suspense boundary**

`app/(auth)/reset-password/page.tsx` (same receipt + poster-panel structure as Task 6; eyebrow `// new password`, h1 `pick a new one`, sub `make it a good one — 8+ characters, mixed case, a number.`; panel headline `fresh <marker>start.</marker>` with microcopy `// one link, new password`). Wrap the form in Suspense exactly like `app/(auth)/register/page.tsx` does:

```tsx
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"
import { Spinner } from "@/components/ui/Spinner"
...
<div className="mt-8">
  <Suspense fallback={<Spinner className="h-6 w-6 text-black" />}>
    <ResetPasswordForm />
  </Suspense>
</div>
```

(`useSearchParams` bails out of static rendering without the boundary — the register page already establishes this pattern.)

- [ ] **Step 3: Run the full verification**

Run: `npm run lint` (expect 0 errors; the 4 pre-existing warnings in `profile.tsx`, `LinkRow.tsx`, `next.config.ts` remain), `npm run build` (expect green), and `npm run test` (expect the only failures to be the 5 pre-existing `lib/auth-merge.test.ts` ones).

- [ ] **Step 4: Manual end-to-end check**

With dev running and no `RESEND_API_KEY` set: submit an existing account email on `/forgot-password`, copy the logged link from the server console, open it, set a new password, confirm the old sessions are gone (sign-in required everywhere) and login works with the new password. Screenshot both pages at desktop and 375px widths.

- [ ] **Step 5: Commit**

```bash
git add components/auth/ResetPasswordForm.tsx app/\(auth\)/reset-password/page.tsx
git commit -m "feat(auth): reset password page"
```
