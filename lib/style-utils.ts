import type { CSSProperties } from "react"
import type { CardTheme } from "@/lib/types"
import { isLight, lighten, darken } from "@/utils/colors"

// Derives the gradient color stops for a card, falling back to a tonal
// graduation of the solid background color when no explicit gradient is set.
export function buildGradientColors(
  cardStyle: Pick<CardTheme, "card_bg" | "gradient">,
): string[] {
  const bg = cardStyle.card_bg || "ffffff"
  if (cardStyle.gradient && cardStyle.gradient.length >= 2) {
    return cardStyle.gradient
  }
  return [bg, isLight(bg) ? darken(bg, 0.8) : lighten(bg, 0.8)]
}

// Produces the CSS background used by a card's page and card container. Shared
// by the public page, the editor preview, and the OpenGraph image so all three
// render a card's background identically.
export function buildCardBackground(cardStyle: CardTheme): CSSProperties {
  if (cardStyle.bg_type === "gradient") {
    const colors = buildGradientColors(cardStyle)
      .map((c) => `#${c}`)
      .join(", ")
    return {
      background:
        cardStyle.gradient_type === "radial"
          ? `radial-gradient(circle at center, ${colors})`
          : `linear-gradient(${cardStyle.gradient_direction ?? 135}deg, ${colors})`,
    }
  }

  if (cardStyle.bg_type === "image" && cardStyle.profile_image) {
    return {
      backgroundImage: `url(${cardStyle.profile_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
  }

  return { background: `#${cardStyle.card_bg || "ffffff"}` }
}