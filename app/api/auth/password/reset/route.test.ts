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
