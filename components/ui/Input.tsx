import React from "react";

const base =
  "w-full bg-white px-4 py-3 text-sm text-(--color-dark) shadow-[var(--shadow-card)] ring-1 ring-(--color-border) placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]";

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

