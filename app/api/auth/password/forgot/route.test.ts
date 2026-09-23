import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    passwordResetToken: { deleteMany: vi.fn(), create: vi.fn() },
    $transaction: vi.fn(),
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
    vi.clearAllMocks()
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 })
    vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({ id: "t-1" } as never)
    vi.mocked(sendPasswordResetEmail).mockResolvedValue({ delivered: true })
    vi.mocked(prisma.$transaction).mockResolvedValue([{ count: 0 }, { id: "t-1" }] as never)
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
    expect(prisma.$transaction).toHaveBeenCalledOnce()
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
})
