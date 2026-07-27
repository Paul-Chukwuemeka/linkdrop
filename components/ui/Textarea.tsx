import React from "react";

const base =
  "w-full bg-white dark:bg-neutral-900 px-3 sm:px-4 py-2.5 sm:py-3 text-(--text-primary) dark:text-neutral-100 text-sm sm:text-base shadow-[var(--shadow-card)] ring-1 ring-(--border-color) placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] rounded-lg transition-all resize-y min-h-[80px] sm:min-h-[100px]";

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

