import React from "react";

export function SectionCard({
  title,
  description,
  children,
  tinted = false,
  className = "",
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  tinted?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-[rgba(26,26,26,0.08)] p-4 sm:p-6 ${
        tinted
          ? "bg-[#F9F9F7] dark:bg-neutral-800"
          : "bg-white dark:bg-neutral-900"
      } ${className}`}
    >
      {title && (
        <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-neutral-100">
          {title}
        </h3>
      )}
      {description && (
        <p className="mt-1 text-xs text-[#6B6B6B] dark:text-neutral-400">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}