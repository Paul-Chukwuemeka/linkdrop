import { describe, it, expect } from "vitest"
import { safeHref } from "./validate"

describe("safeHref", () => {
  it("passes through https URLs", () => {
    expect(safeHref("https://example.com/a?b=1")).toBe("https://example.com/a?b=1")
  })

  it("passes through http URLs", () => {
    expect(safeHref("http://example.com")).toBe("http://example.com")
  })

  it("neutralizes javascript: URLs", () => {
    expect(safeHref("javascript:alert(1)")).toBe("#")
  })

  it("neutralizes data: URLs", () => {
    expect(safeHref("data:text/html,<script>1</script>")).toBe("#")
  })

  it("neutralizes file:/ftp:/vbscript: and scheme-less strings", () => {
    expect(safeHref("file:///etc/passwd")).toBe("#")
    expect(safeHref("ftp://example.com")).toBe("#")
    expect(safeHref("vbscript:msgbox(1)")).toBe("#")
    expect(safeHref("example.com")).toBe("#")
  })
})