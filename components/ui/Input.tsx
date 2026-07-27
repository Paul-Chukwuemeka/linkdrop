import React from "react";

const base =
  "w-full bg-white dark:bg-neutral-900 px-3 sm:px-4 py-2.5 sm:py-3 text-(--text-primary) dark:text-neutral-100 text-sm sm:text-base shadow-[var(--shadow-card)] ring-1 ring-(--border-color) placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] rounded-md transition-all min-h-[44px]";

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

