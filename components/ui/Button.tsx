import React from "react";

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg touch-manipulation";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-dark)] text-white hover:opacity-90 active:scale-95",
  ghost:
    "text-(--color-dark) bg-(--color-dark)/10 hover:ring-2 hover:ring-(--color-dark)/20 hover:opacity-90 active:scale-95",
  danger: "bg-red-600 text-white hover:opacity-90 active:scale-95",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-3 sm:px-4 text-xs sm:text-sm rounded-full",
  md: "h-10 sm:h-11 px-4 sm:px-5 text-sm sm:text-base",
  lg: "h-11 sm:h-12 px-5 sm:px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={[base, variantClass[variant], sizeClass[size], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
