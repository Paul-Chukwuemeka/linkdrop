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
