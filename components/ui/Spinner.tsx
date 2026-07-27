import React from "react";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={[
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 dark:border-neutral-600 border-t-neutral-800 dark:border-t-neutral-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Loading"
      role="status"
    />
  );
}

