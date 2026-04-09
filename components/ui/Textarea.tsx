import React from "react";

const base =
  "w-full bg-white px-4 py-3 text-sm text-(--color-dark) shadow-[var(--shadow-card)] ring-1 ring-(--color-border) placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]";

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

