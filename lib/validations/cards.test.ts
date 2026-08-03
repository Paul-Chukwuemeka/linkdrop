import { describe, it, expect } from "vitest"
import { cardStyleUpdateSchema, MAX_GRADIENT_COLORS } from "./cards"

const base = {
  card_bg: "ffffff",
  text_color: "000000",
}

describe("cardStyleUpdateSchema caps on free-form style input", () => {
  it("accepts exactly the UI's gradient count and rejects one more", () => {
    // Must stay in sync with GradientColorPicker (which allows MAX_GRADIENT_COLORS).
    const gradient = Array.from({ length: MAX_GRADIENT_COLORS }, (_, i) => `00ff${i}${i}`)
    expect(cardStyleUpdateSchema.safeParse({ style: { ...base, gradient } }).success).toBe(true)
    expect(
      cardStyleUpdateSchema.safeParse({ style: { ...base, gradient: [...gradient, "00ff99"] } }).success
    ).toBe(false)
  })

  it("caps gradient color string length", () => {
    const gradient = ["a".repeat(40)]
    expect(cardStyleUpdateSchema.safeParse({ style: { ...base, gradient } }).success).toBe(false)
  })

  it("rejects non-hex color values", () => {
    expect(cardStyleUpdateSchema.safeParse({ style: { ...base, card_bg: "nope!" } }).success).toBe(false)
    expect(cardStyleUpdateSchema.safeParse({ style: { ...base, card_bg: "fff" } }).success).toBe(false)
  })

  it("accepts valid hex colors", () => {
    expect(cardStyleUpdateSchema.safeParse({ style: { ...base, card_bg: "aBcDeF" } }).success).toBe(true)
  })

  it("rejects gradient backgrounds with fewer than two colors", () => {
    expect(
      cardStyleUpdateSchema.safeParse({
        style: { card_bg: "ffffff", bg_type: "gradient", gradient: ["ff6b6b"] },
      }).success
    ).toBe(false)
    expect(
      cardStyleUpdateSchema.safeParse({
        style: { card_bg: "ffffff", bg_type: "gradient", gradient: ["ff6b6b", "feca57"] },
      }).success
    ).toBe(true)
  })

  it("persists a preset name through the style schema", () => {
    expect(cardStyleUpdateSchema.safeParse({ style: { ...base, name: "Sunset" } }).success).toBe(true)
  })

  it("rejects non-http(s) profile_image values", () => {
    expect(
      cardStyleUpdateSchema.safeParse({ style: { ...base, profile_image: "javascript:alert(1)" } }).success
    ).toBe(false)
    expect(
      cardStyleUpdateSchema.safeParse({ style: { ...base, profile_image: "data:image/svg+xml,x" } }).success
    ).toBe(false)
  })

  it("accepts http(s) profile_image values", () => {
    expect(
      cardStyleUpdateSchema.safeParse({ style: { ...base, profile_image: "https://example.com/a.png" } }).success
    ).toBe(true)
  })
})