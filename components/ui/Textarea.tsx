import React from "react";

const base =
  "w-full bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-(--color-dark) text-sm sm:text-base shadow-[var(--shadow-card)] ring-1 ring-(--color-border) placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-border)] rounded-lg transition-all resize-y min-h-[80px] sm:min-h-[100px]";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

