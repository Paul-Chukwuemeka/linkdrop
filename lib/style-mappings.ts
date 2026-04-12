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
