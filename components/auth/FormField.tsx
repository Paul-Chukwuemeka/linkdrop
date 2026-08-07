import React from "react";

const inputBase =
  "w-full bg-white px-3 py-2.5 text-sm text-primary placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all rounded-lg";

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
      <label htmlFor={id} className="text-sm font-medium text-primary">
        {label}
      </label>
      {React.cloneElement(children, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${id}-error` : undefined,
        className: [inputBase, inputClassName].filter(Boolean).join(" "),
      })}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
