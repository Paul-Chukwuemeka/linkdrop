import { describe, it, expect } from "vitest"
import { signupSchema, PASSWORD_PATTERN, PASSWORD_MIN_LENGTH } from "./auth"

function passwordOnly(password: string) {
  return { username: "jane", email: "jane@example.com", fullname: "Jane", password }
}

describe("signupSchema password rules (server's letters+digit policy)", () => {
  it("accepts an 8-char password with upper, lower and digit", () => {
    expect(signupSchema.safeParse(passwordOnly("Passw0rd")).success).toBe(true)
  })

  it("accepts non-alphanumeric characters as long as the three classes are present", () => {
    expect(signupSchema.safeParse(passwordOnly("Password1@!")).success).toBe(true)
    expect(signupSchema.safeParse(passwordOnly("Pass_word-1")).success).toBe(true)
  })

  it("rejects passwords shorter than the minimum", () => {
    expect(signupSchema.safeParse(passwordOnly("Ab3cdef")).success).toBe(false)
  })

  it("rejects passwords missing a digit", () => {
    expect(signupSchema.safeParse(passwordOnly("Password")).success).toBe(false)
  })

  it("rejects all-uppercase passwords (no lowercase)", () => {
    expect(signupSchema.safeParse(passwordOnly("PASSWORD1")).success).toBe(false)
  })

  it("rejects all-lowercase passwords (no uppercase)", () => {
    expect(signupSchema.safeParse(passwordOnly("password1")).success).toBe(false)
  })
})

describe("PASSWORD_PATTERN parity with the client form", () => {
  it("rejects the same inputs the client form rejects", () => {
    expect(PASSWORD_PATTERN.test("password1")).toBe(false)
    expect(PASSWORD_PATTERN.test("PASSWORD1")).toBe(false)
    expect(PASSWORD_PATTERN.test("P1234567")).toBe(false)
    expect(PASSWORD_PATTERN.test("Passw0rd")).toBe(true)
  })

  it("exposes a consistent minimum length constant", () => {
    expect(PASSWORD_MIN_LENGTH).toBe(8)
  })
})