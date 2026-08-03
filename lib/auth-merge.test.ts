import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    user: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
    account: { findFirst: vi.fn(), create: vi.fn() },
  },
}))

import { prisma } from "@/lib/db"
import { linkGoogleUser } from "./auth-merge"

const ACCOUNT = { providerAccountId: "g-1", access_token: "at", id_token: "it" }

function row(id: string, email: string, password: string | null, username = "user") {
  return { id, username, email, password, fullname: "User" }
}

describe("linkGoogleUser", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it("refuses to link a Google account to an existing password (credentials) account", async () => {
    // An attacker can pre-register victim@gmail.com via credentials signup;
    // linking the victim's OAuth identity there hands them a shared account.
    vi.mocked(prisma.user.findUnique).mockResolvedValue(
      row("attacker", "victim@example.com", "hash", "victim") as never
    )

    const result = await linkGoogleUser({
      email: "victim@example.com",
      name: "Victim",
      account: ACCOUNT,
    })

    expect(result).toBeNull()
    expect(prisma.user.create).not.toHaveBeenCalled()
    expect(prisma.account.create).not.toHaveBeenCalled()
  })

  it("creates a new user for a fresh email with a >= 3 char username", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.account.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue(row("u2", "a@example.com", null, "a__") as never)
    vi.mocked(prisma.account.create).mockResolvedValue({} as never)

    const result = await linkGoogleUser({ email: "a@example.com", name: "Ann", account: ACCOUNT })

    expect(prisma.user.create).toHaveBeenCalledTimes(1)
    const createData = vi.mocked(prisma.user.create).mock.calls[0]![0].data
    expect(createData.username).toBe("a__")
    expect(createData.email).toBe("a@example.com")
    expect(createData.fullname).toBe("Ann")
    expect(prisma.account.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: "u2", providerAccountId: "g-1" }),
      })
    )
    expect(result).toEqual({ id: "u2", username: "a__", email: "a@example.com" })
  })

  it("recovers from a P2002 on create by resolving the row that won the race", async () => {
    // findUnique call sequence: [email → null], then [email again after the
    // failed create → the row that won the race].
    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(row("winner", "jane@example.com", null, "jane") as never)
    vi.mocked(prisma.user.create).mockRejectedValue({ code: "P2002" })
    vi.mocked(prisma.account.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.account.create).mockResolvedValue({} as never)

    const result = await linkGoogleUser({ email: "jane@example.com", name: "Jane", account: ACCOUNT })

    expect(result).toEqual({ id: "winner", username: "jane", email: "jane@example.com" })
    expect(prisma.account.create).toHaveBeenCalled()
  })

  it("re-rolls the username when create hits a P2002 with no email winner", async () => {
    // Fresh email, but the auto-generated username collides case-insensitively
    // with an unrelated user (e.g. existing "Alice" vs generated "alice") so the
    // LOWER(username) index rejects the create. Must retry with a suffixed name
    // instead of 500ing.
    const existingRow = row("other", "other@example.com", null, "alice")

    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce(null) // initial email lookup
      .mockResolvedValueOnce(null) // catch: no same-email winner (different user)
    vi.mocked(prisma.user.findFirst)
      .mockResolvedValueOnce(existingRow as never) // uniqueUsername probe finds the case-variant owner
      .mockResolvedValueOnce(null) // random suffix is free
    vi.mocked(prisma.user.create)
      .mockRejectedValueOnce({ code: "P2002" })
      .mockResolvedValueOnce(row("u3", "alice@example.com", null, "alice_zzz9") as never)
    vi.mocked(prisma.account.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.account.create).mockResolvedValue({} as never)

    const result = await linkGoogleUser({ email: "alice@example.com", name: "Alice", account: ACCOUNT })

    expect(prisma.user.create).toHaveBeenCalledTimes(2)
    expect(result).not.toBeNull()
    expect(result!.username).not.toBe("alice")
    expect(result!.username).toMatch(/^alice_/)
  })

  it("treats a P2002 on account attach as already-linked success", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(
      row("u1", "jane@example.com", null, "jane") as never
    )
    vi.mocked(prisma.account.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.account.create).mockRejectedValue({ code: "P2002" })

    const result = await linkGoogleUser({ email: "jane@example.com", name: "Jane", account: ACCOUNT })

    expect(result).toEqual({ id: "u1", username: "jane", email: "jane@example.com" })
  })

  it("does not re-attach an account row that already exists for this Google account", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(row("u1", "x@example.com", null) as never)
    vi.mocked(prisma.account.findFirst).mockResolvedValue({ id: "a1" } as never)

    const result = await linkGoogleUser({ email: "x@example.com", name: "X", account: ACCOUNT })

    expect(prisma.account.create).not.toHaveBeenCalled()
    expect(result).toEqual({ id: "u1", username: "user", email: "x@example.com" })
  })
})