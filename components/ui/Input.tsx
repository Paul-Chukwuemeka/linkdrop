import React from "react";

const base =
  "w-full bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-(--color-dark) text-sm sm:text-base shadow-[var(--shadow-card)] ring-1 ring-(--color-border) placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-border)] rounded-lg transition-all min-h-[44px]";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

Input.displayName = "Input";

