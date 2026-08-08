import { describe, it, expect } from "vitest";
import { extractTitle } from "./og"

describe("extractTitle", () => {
  it("prefers the <title> tag over og:title", () => {
    const html =
      '<html><head><meta property="og:title" content="OG Title"><title>Tab Title</title></head></html>'
    expect(extractTitle(html)).toBe("Tab Title")
  })

  it("falls back to og:title when <title> is missing", () => {
    const html = '<html><head><meta property="og:title" content="OG Title"></head></html>'
    expect(extractTitle(html)).toBe("OG Title")
  })

  it("handles name= og:title", () => {
    const html = '<html><head><meta name="og:title" content="Named OG"></head></html>'
    expect(extractTitle(html)).toBe("Named OG")
  })

  it("returns null when no title is present", () => {
    const html = "<html><head></head><body>hi</body></html>"
    expect(extractTitle(html)).toBeNull()
  })

  it("collapses whitespace inside the title", () => {
    const html = "<html><head><title>\n   Multi   line \n title  </title></head></html>"
    expect(extractTitle(html)).toBe("Multi line title")
  })

  it("rejects an empty <title> and falls back to og:title", () => {
    const html = '<html><head><title>  </title><meta property="og:title" content="OG Title"></head></html>'
    expect(extractTitle(html)).toBe("OG Title")
  })
})