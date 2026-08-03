import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
  },
}))

vi.mock("@/lib/auth-helpers", () => ({
  requireAuth: vi.fn(),
}))

vi.mock("argon2", () => ({
  default: { verify: vi.fn(), hash: vi.fn() },
}))

import { PATCH } from "./route"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { UnauthorizedError } from "@/lib/api-utils"
import argon2 from "argon2"

const USER_ID = "user-1"
const OLD_HASH = "argon2-old-hash"
const NEW_HASH = "argon2-new-hash"

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/auth/password", {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  })
}

describe("PATCH /api/auth/password", () => {
  beforeEach(() => {
    vi.mocked(requireAuth).mockResolvedValue({ id: USER_ID } as never)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: USER_ID,
      password: OLD_HASH,
    } as never)
    vi.mocked(prisma.user.update).mockResolvedValue({ id: USER_ID } as never)
    vi.mocked(argon2.verify).mockResolvedValue(true)
    vi.mocked(argon2.hash).mockResolvedValue(NEW_HASH)
    vi.clearAllMocks()
  })

  it("returns 401 without auth", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError())
    const response = await PATCH(
      makeRequest({ current_password: "OldPass1", new_password: "NewPass1" }),
    )
    expect(response.status).toBe(401)
  })

  it("returns 400 for invalid body", async () => {
    const response = await PATCH(makeRequest({}))
    expect(response.status).toBe(400)
  })

  it("returns 400 when the account has no password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: USER_ID,
      password: null,
    } as never)
    const response = await PATCH(
      makeRequest({ current_password: "OldPass1", new_password: "NewPass1" }),
    )
    expect(response.status).toBe(400)
  })

  it("returns 400 when the current password is wrong", async () => {
    vi.mocked(argon2.verify).mockResolvedValue(false)
    const response = await PATCH(
      makeRequest({ current_password: "Wrong1", new_password: "NewPass1" }),
    )
    expect(response.status).toBe(400)
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("returns 400 for a weak new password", async () => {
    const response = await PATCH(
      makeRequest({ current_password: "OldPass1", new_password: "short" }),
    )
    expect(response.status).toBe(400)
  })

  it("updates the hashed password on success", async () => {
    const response = await PATCH(
      makeRequest({ current_password: "OldPass1", new_password: "NewPass1" }),
    )
    expect(response.status).toBe(204)
    expect(argon2.hash).toHaveBeenCalledWith("NewPass1")
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: USER_ID },
      data: { password: NEW_HASH },
    })
  })
})
