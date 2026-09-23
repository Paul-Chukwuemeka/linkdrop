import React from "react";
import { FieldError } from "@/components/auth/FieldError";

const inputBase =
  "w-full bg-white px-3 py-2.5 text-sm text-primary placeholder:text-gray-400 border-2 border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-colors rounded-md";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  inputClassName?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}

export function FormField({
  id,
  label,
  error,
  inputClassName,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="font-[family-name:var(--font-jetbrains)] text-[11px] font-medium uppercase tracking-wider text-[#5a5a48]"
      >
        {label}
      </label>
      {React.cloneElement(children, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${id}-error` : undefined,
        className: [inputBase, inputClassName].filter(Boolean).join(" "),
      })}
      {error && (
        <FieldError id={`${id}-error`}>{error}</FieldError>
      )}
    </div>
  );
}
