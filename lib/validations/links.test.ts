import { describe, it, expect } from "vitest"
import { linkCreateSchema, linkUpdateSchema } from "./links"

const CARD_ID = "00000000-0000-0000-0000-000000000000"

describe("linkCreateSchema", () => {
  it("accepts https URLs", () => {
    const result = linkCreateSchema.safeParse({ title: "X", url: "https://example.com/a?b=1", card_id: CARD_ID })
    expect(result.success).toBe(true)
  })

  it("accepts http URLs", () => {
    const result = linkCreateSchema.safeParse({ title: "X", url: "http://example.com", card_id: CARD_ID })
    expect(result.success).toBe(true)
  })

  it("rejects javascript: URLs (stored XSS)", () => {
    const result = linkCreateSchema.safeParse({ title: "X", url: "javascript:alert(1)", card_id: CARD_ID })
    expect(result.success).toBe(false)
  })

  it("rejects data:, file:, ftp:, vbscript: schemes", () => {
    for (const url of ["data:text/html,<script>1</script>", "file:///etc/passwd", "ftp://example.com", "vbscript:msgbox(1)"]) {
      const result = linkCreateSchema.safeParse({ title: "X", url, card_id: CARD_ID })
      expect(result.success).toBe(false)
    }
  })

  it("rejects scheme-less strings", () => {
    const result = linkCreateSchema.safeParse({ title: "X", url: "example.com", card_id: CARD_ID })
    expect(result.success).toBe(false)
  })
})

describe("linkUpdateSchema", () => {
  it("rejects javascript: URLs", () => {
    const result = linkUpdateSchema.safeParse({ url: "javascript:alert(1)" })
    expect(result.success).toBe(false)
  })

  it("accepts https URLs", () => {
    const result = linkUpdateSchema.safeParse({ url: "https://example.com" })
    expect(result.success).toBe(true)
  })
})
