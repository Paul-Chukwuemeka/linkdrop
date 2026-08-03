import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    user: { findUnique: vi.fn(), delete: vi.fn() },
  },
}))

vi.mock("@/lib/auth-helpers", () => ({
  requireAuth: vi.fn(),
}))

vi.mock("@/lib/s3", () => ({
  deleteFromR2: vi.fn(),
}))

vi.mock("argon2", () => ({
  default: { verify: vi.fn() },
}))

import { DELETE } from "./route"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { UnauthorizedError } from "@/lib/api-utils"
import { deleteFromR2 } from "@/lib/s3"
import argon2 from "argon2"

const USER_ID = "user-1"
const PASSWORD_HASH = "argon2-password-hash"
const AVATAR_URL = "/avatars/a.jpg"

const passwordUser = {
  id: USER_ID,
  username: "jane",
  email: "jane@example.com",
  password: PASSWORD_HASH,
  avatarUrl: AVATAR_URL,
}

const oauthUser = {
  id: USER_ID,
  username: "jane",
  email: "jane@example.com",
  password: null,
  avatarUrl: null,
}

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/auth/account", {
    method: "DELETE",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  })
}

describe("DELETE /api/auth/account", () => {
  beforeEach(() => {
    vi.mocked(requireAuth).mockResolvedValue({ id: USER_ID } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue(passwordUser as never)
    vi.mocked(prisma.user.delete).mockResolvedValue(passwordUser as never)
    vi.mocked(deleteFromR2).mockResolvedValue(undefined)
    vi.mocked(argon2.verify).mockResolvedValue(true)
    vi.clearAllMocks()
  })

  it("returns 401 without auth", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError())
    const response = await DELETE(makeRequest({ password: "Pass1" }))
    expect(response.status).toBe(401)
  })

  it("returns 400 for invalid body", async () => {
    const response = await DELETE(makeRequest({ password: 123 }))
    expect(response.status).toBe(400)
  })

  it("deletes with a valid password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(passwordUser as never)
    const response = await DELETE(makeRequest({ password: "Pass1" }))
    expect(response.status).toBe(204)
    expect(argon2.verify).toHaveBeenCalledWith(PASSWORD_HASH, "Pass1")
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: USER_ID } })
    expect(deleteFromR2).toHaveBeenCalledWith(AVATAR_URL)
  })

  it("rejects a wrong password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(passwordUser as never)
    vi.mocked(argon2.verify).mockResolvedValue(false)
    const response = await DELETE(makeRequest({ password: "Wrong1" }))
    expect(response.status).toBe(400)
    expect(prisma.user.delete).not.toHaveBeenCalled()
  })

  it("accepts email confirmation for password-less accounts", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(oauthUser as never)
    const response = await DELETE(makeRequest({ confirm: "JANE@EXAMPLE.com" }))
    expect(response.status).toBe(204)
    expect(prisma.user.delete).toHaveBeenCalled()
  })

  it("rejects mismatched confirmation for password-less accounts", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(oauthUser as never)
    const response = await DELETE(makeRequest({ confirm: "someone-else" }))
    expect(response.status).toBe(400)
    expect(prisma.user.delete).not.toHaveBeenCalled()
  })
})
