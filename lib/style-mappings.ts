// Size mappings for text elements
export const titleSizeClasses = {
  small: "text-base",
  medium: "text-lg",
  large: "text-2xl",
};

export const textSizeClasses = {
  small: "text-xxs",
  medium: "text-xs",
  large: "text-sm",
};

// Button radius mappings
export const buttonRadiusClasses = {
  pill: "rounded-full",
  round: "rounded-xl",
  square: "rounded-none",
  rounder: "rounded-2xl",
};

// Shadow style mappings for buttons and cards
export const shadowStyles = {
  none: {
    boxShadow: "none",
  },
  soft: {
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.18)",
  },
  medium: {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.32)",
  },
  hard: {
    boxShadow: "4px 4px 0 0 rgba(0, 0, 0, 1)",
    border: "2px solid rgba(0, 0, 0, 1)",
  },
  glow: {
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)",
  },
} as const;

export type ShadowType = keyof typeof shadowStyles;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "");
  if (h.length !== 6) return null;
  const num = parseInt(h, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function getShadowStyles(color?: string | null): Record<ShadowType, { boxShadow: string; border?: string }> {
  if (!color) return shadowStyles;

  const rgb = hexToRgb(color);
  if (!rgb) return shadowStyles;

  const { r, g, b } = rgb;
  const solid = `rgb(${r}, ${g}, ${b})`;
  const alpha18 = `rgba(${r}, ${g}, ${b}, 0.18)`;
  const alpha32 = `rgba(${r}, ${g}, ${b}, 0.32)`;
  const alpha30 = `rgba(${r}, ${g}, ${b}, 0.3)`;
  const alpha15 = `rgba(${r}, ${g}, ${b}, 0.15)`;

  return {
    none: { boxShadow: "none" },
    soft: { boxShadow: `0 2px 8px ${alpha18}` },
    medium: { boxShadow: `0 4px 12px ${alpha32}` },
    hard: { boxShadow: `4px 4px 0 0 ${solid}`, border: `2px solid ${solid}` },
    glow: { boxShadow: `0 0 20px ${alpha30}, 0 4px 12px ${alpha15}` },
  };
}


export const PublictitleSizeClasses = {
  small: "text-lg",
  medium: "text-3xl",
  large: "text-5xl",
};

export const PublictextSizeClasses = {
  small: "text-sm",
  medium: "text-lg",
  large: "text-xl",
};

// Button radius mappings
export const PublicbuttonRadiusClasses = {
  pill: "rounded-full",
  round: "rounded-xl",
  square: "rounded-none",
  rounder: "rounded-2xl",
};
