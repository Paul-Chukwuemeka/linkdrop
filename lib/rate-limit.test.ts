import { describe, it, expect, beforeEach, vi } from "vitest"

type CheckRateLimit = (request: Request, limit: number, windowMs: number) => boolean
type CheckLoginRateLimit = (request: Request, username: string, limit: number, windowMs: number) => boolean
type ResetLoginRateLimit = (username: string) => void

let checkRateLimit: CheckRateLimit
let checkLoginRateLimit: CheckLoginRateLimit
let resetLoginRateLimit: ResetLoginRateLimit

function req(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/test", { headers })
}

describe("rate-limit", () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const mod = await import("./rate-limit")
    checkRateLimit = mod.checkRateLimit
    checkLoginRateLimit = mod.checkLoginRateLimit
    resetLoginRateLimit = mod.resetLoginRateLimit
  })

  it("allows requests up to the limit within a window", () => {
    const request = req({ "x-forwarded-for": "1.2.3.4" })
    expect(checkRateLimit(request, 5, 60_000)).toBe(true)
    expect(checkRateLimit(request, 5, 60_000)).toBe(true)
    expect(checkRateLimit(request, 5, 60_000)).toBe(true)
    expect(checkRateLimit(request, 5, 60_000)).toBe(true)
    expect(checkRateLimit(request, 5, 60_000)).toBe(true)
    expect(checkRateLimit(request, 5, 60_000)).toBe(false)
  })

  it("rejects after the limit with fake timers at epoch 0 (no timezone dependency)", () => {
    const request = req({ "x-forwarded-for": "1.2.3.4" })
    for (let i = 0; i < 5; i++) expect(checkRateLimit(request, 5, 60_000)).toBe(true)
    expect(checkRateLimit(request, 5, 60_000)).toBe(false)
  })

  it("resets the window after windowMs has passed", () => {
    const request = req({ "x-forwarded-for": "1.2.3.4" })
    for (let i = 0; i < 5; i++) expect(checkRateLimit(request, 5, 60_000)).toBe(true)
    expect(checkRateLimit(request, 5, 60_000)).toBe(false)

    vi.advanceTimersByTime(60_001)
    expect(checkRateLimit(request, 5, 60_000)).toBe(true)
  })

  it("tracks clients independently", () => {
    const a = req({ "x-forwarded-for": "1.2.3.4" })
    const b = req({ "x-forwarded-for": "5.6.7.8" })
    for (let i = 0; i < 5; i++) expect(checkRateLimit(a, 5, 60_000)).toBe(true)
    expect(checkRateLimit(b, 5, 60_000)).toBe(true)
    expect(checkRateLimit(a, 5, 60_000)).toBe(false)
    expect(checkRateLimit(b, 5, 60_000)).toBe(true)
  })

  it("uses x-real-ip when x-forwarded-for is absent", () => {
    const a = req({ "x-real-ip": "9.9.9.9" })
    const b = req({ "x-real-ip": "8.8.8.8" })
    for (let i = 0; i < 5; i++) expect(checkRateLimit(a, 5, 60_000)).toBe(true)
    expect(checkRateLimit(b, 5, 60_000)).toBe(true)
    expect(checkRateLimit(a, 5, 60_000)).toBe(false)
  })

  it("falls back to a shared 127.0.0.1 key without headers", () => {
    expect(checkRateLimit(req(), 1, 60_000)).toBe(true)
    expect(checkRateLimit(req(), 1, 60_000)).toBe(false)
  })

  it("throttles login per-username, independent of the client IP", () => {
    // Distinct IPs per attempt keep the IP bucket from ever tripping.
    for (let i = 0; i < 3; i++) {
      expect(checkLoginRateLimit(req({ "x-forwarded-for": `1.1.1.${i}` }), "alice", 3, 60_000)).toBe(true)
    }
    // A brand new IP can no longer log in as alice because her username bucket hit the limit.
    expect(checkLoginRateLimit(req({ "x-forwarded-for": "9.9.9.9" }), "alice", 3, 60_000)).toBe(false)
    // A different username is unaffected.
    expect(checkLoginRateLimit(req({ "x-forwarded-for": "1.1.1.4" }), "bob", 3, 60_000)).toBe(true)
  })

  it("resetLoginRateLimit clears only the matching username's bucket", () => {
    for (let i = 0; i < 3; i++) {
      expect(checkLoginRateLimit(req({ "x-forwarded-for": `2.2.2.${i}` }), "carol", 3, 60_000)).toBe(true)
    }
    expect(checkLoginRateLimit(req({ "x-forwarded-for": "2.2.2.9" }), "carol", 3, 60_000)).toBe(false)

    resetLoginRateLimit("carol")
    expect(checkLoginRateLimit(req({ "x-forwarded-for": "2.2.2.8" }), "carol", 3, 60_000)).toBe(true)

    // dave is still unthrottled without a reset
    expect(checkLoginRateLimit(req({ "x-forwarded-for": "2.2.2.7" }), "dave", 3, 60_000)).toBe(true)
  })
})
