import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/s3", () => ({
  r2: { send: vi.fn() },
  R2_BUCKET: "bucket",
  R2_PUBLIC_URL: "https://cdn.linkdrop.example",
}))

vi.mock("@/lib/http", () => ({
  fetchWithTimeout: vi.fn(),
}))

import { r2 } from "@/lib/s3"
import { fetchWithTimeout } from "@/lib/http"
import { reHostAvatarUrl } from "./rehost"

const IMG = Buffer.from("fake-image-bytes")

function fakeResponse(overrides: Partial<{ url: string; status: number; contentType: string; body: Buffer }>) {
  const { url = "https://lh3.googleusercontent.com/p", status = 200, contentType = "image/jpeg", body = IMG } = overrides
  return {
    ok: status >= 200 && status < 300,
    status,
    url,
    headers: { get: (name: string) => (name === "content-type" ? contentType : body.length.toString()) },
    arrayBuffer: () => body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength),
  } as unknown as Response
}

describe("reHostAvatarUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(r2.send).mockResolvedValue({} as never)
  })

  it("returns URLs already on our own storage untouched", async () => {
    const hosted = "https://cdn.linkdrop.example/avatars/abc.jpg"
    const relative = "/avatars/abc.jpg"

    expect(await reHostAvatarUrl(hosted)).toBe(hosted)
    expect(await reHostAvatarUrl(relative)).toBe(relative)
    expect(fetchWithTimeout).not.toHaveBeenCalled()
  })

  it("rejects a disallowed source host without fetching", async () => {
    await expect(reHostAvatarUrl("https://evil.example/avatar.png")).rejects.toThrow("Image host not allowed")
    expect(fetchWithTimeout).not.toHaveBeenCalled()
  })

  it("rejects a redirect to a host outside the allowlist (SSRF guard on final hop)", async () => {
    vi.mocked(fetchWithTimeout).mockResolvedValue(
      fakeResponse({ url: "https://metadata.internal/g" })
    )
    await expect(reHostAvatarUrl("https://lh3.googleusercontent.com/g")).rejects.toThrow("Image host not allowed")
  })

  it("rejects non-image content types", async () => {
    vi.mocked(fetchWithTimeout).mockResolvedValue(fakeResponse({ contentType: "text/html" }))
    await expect(reHostAvatarUrl("https://lh3.googleusercontent.com/g")).rejects.toThrow(
      "URL does not point to an image"
    )
    expect(r2.send).not.toHaveBeenCalled()
  })

  it("rejects images larger than the limit", async () => {
    const oversized = Buffer.alloc(6 * 1024 * 1024)
    vi.mocked(fetchWithTimeout).mockResolvedValue(
      fakeResponse({ body: oversized, contentType: "image/jpeg" })
    )
    await expect(reHostAvatarUrl("https://lh3.googleusercontent.com/g")).rejects.toThrow("5MB limit")
    expect(r2.send).not.toHaveBeenCalled()
  })

  it("uploads the image and returns the re-hosted URL", async () => {
    vi.mocked(fetchWithTimeout).mockResolvedValue(
      fakeResponse({ url: "https://lh3.googleusercontent.com/g", contentType: "image/png" })
    )

    const result = await reHostAvatarUrl("https://lh3.googleusercontent.com/g")

    expect(result).toMatch(/^https:\/\/cdn\.linkdrop\.example\/avatars\/[a-f0-9]{64}\.png$/)
    expect(r2.send).toHaveBeenCalledTimes(1)
  })
})