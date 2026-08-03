import { describe, it, expect } from "vitest"
import { profileUpdateSchema } from "./profile"

describe("profileUpdateSchema", () => {
  it("accepts http(s) avatar URLs", () => {
    expect(profileUpdateSchema.safeParse({ avatar_url: "https://example.com/a.png" }).success).toBe(true)
    expect(profileUpdateSchema.safeParse({ avatar_url: "http://example.com/a.png" }).success).toBe(true)
  })

  it("accepts R2-relative /avatars/ URLs", () => {
    expect(profileUpdateSchema.safeParse({ avatar_url: "/avatars/abc123.jpg" }).success).toBe(true)
  })

  it("accepts an empty string to clear the avatar", () => {
    expect(profileUpdateSchema.safeParse({ avatar_url: "" }).success).toBe(true)
  })

  it("rejects javascript:/data: avatar URLs", () => {
    expect(profileUpdateSchema.safeParse({ avatar_url: "javascript:alert(1)" }).success).toBe(false)
    expect(profileUpdateSchema.safeParse({ avatar_url: "data:image/svg+xml,<svg onload=alert(1)>" }).success).toBe(false)
  })

  it("rejects scheme-less avatar URLs", () => {
    expect(profileUpdateSchema.safeParse({ avatar_url: "example.com/a.png" }).success).toBe(false)
  })
})
