import { describe, it, expect } from "vitest"
import { buildGradientColors, buildCardBackground } from "./style-utils"
import { CardTheme } from "@/lib/types"

function style(overrides: Partial<CardTheme> = {}): CardTheme {
  return {
    bg_type: "solid",
    card_bg: "ffffff",
    gradient: [],
    gradient_type: "linear",
    gradient_direction: 135,
    button_bg: "000000",
    button_color: "ffffff",
    button_type: "solid",
    button_radius: "round",
    text_size: "medium",
    text_color: "000000",
    title_color: null,
    title_size: "medium",
    font_style: "inter",
    shadow: null,
    shadow_color: null,
    profile_image: null,
    ...overrides,
  } as CardTheme
}

describe("buildGradientColors", () => {
  it("uses explicit gradient stops when at least two are provided", () => {
    const s = style({ gradient: ["ff0000", "00ff00"] })
    expect(buildGradientColors(s)).toEqual(["ff0000", "00ff00"])
  })

  it("falls back to a tonal graduation of a light background", () => {
    const s = style({ card_bg: "ffffff", gradient: [] })
    const [a, b] = buildGradientColors(s)
    expect(a).toBe("ffffff")
    expect(b.toLowerCase()).not.toBe("ffffff")
  })

  it("falls back to a tonal graduation of a dark background", () => {
    const s = style({ card_bg: "000000", gradient: [] })
    const [a, b] = buildGradientColors(s)
    expect(a).toBe("000000")
    expect(b.toLowerCase()).not.toBe("000000")
  })
})

describe("buildCardBackground", () => {
  it("returns a solid background", () => {
    expect(buildCardBackground(style({ bg_type: "solid", card_bg: "abc123" }))).toEqual({
      background: "#abc123",
    })
  })

  it("returns a linear gradient with the configured direction", () => {
    const s = style({ bg_type: "gradient", gradient: ["ff0000", "00ff00"], gradient_direction: 45 })
    expect(buildCardBackground(s)).toEqual({
      background: "linear-gradient(45deg, #ff0000, #00ff00)",
    })
  })

  it("returns a radial gradient when gradient_type is radial", () => {
    const s = style({ bg_type: "gradient", gradient_type: "radial", gradient: ["ff0000", "00ff00"] })
    expect(buildCardBackground(s)).toEqual({
      background: "radial-gradient(circle at center, #ff0000, #00ff00)",
    })
  })

  it("returns a cover image background", () => {
    const s = style({ bg_type: "image", profile_image: "https://cdn.example/bg.jpg" })
    expect(buildCardBackground(s)).toEqual({
      backgroundImage: "url(https://cdn.example/bg.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    })
  })

  it("defaults to white for invalid solid colors", () => {
    expect(buildCardBackground(style({ bg_type: "solid", card_bg: "" }))).toEqual({
      background: "#ffffff",
    })
  })
})