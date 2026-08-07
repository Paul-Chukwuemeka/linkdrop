"use client";

import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TAKEN_USERNAMES = ["admin", "root", "test", "linkdrop", "support"];
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

type Availability = "idle" | "checking" | "available" | "taken";

interface UsernameFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

type CheckedResult = { value: string; available: boolean };

export function UsernameField({ id, value, onChange, onBlur, error }: UsernameFieldProps) {
  const [checked, setChecked] = useState<CheckedResult | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length < 3 || !USERNAME_PATTERN.test(value.trim())) return;

    timer.current = setTimeout(() => {
      setChecked({ value: trimmed, available: !TAKEN_USERNAMES.includes(trimmed) });
    }, 400);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value]);

  const trimmed = value.trim().toLowerCase();
  const validInput = trimmed.length >= 3 && USERNAME_PATTERN.test(value.trim());
  const availability: Availability = !validInput
    ? "idle"
    : checked?.value === trimmed
      ? checked.available
        ? "available"
        : "taken"
      : "checking";

  const inputClassName =
    "flex-1 rounded-r-lg border border-gray-200 px-3 py-2.5 text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-primary">
        Username
      </label>
      <div className="flex">
        <span className="select-none rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-500">
          linkdrop.co/
        </span>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="yourname"
          autoComplete="username"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          className={inputClassName}
        />
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      ) : availability === "checking" ? (
        <p id={`${id}-hint`} className="text-xs text-secondary">
          Checking…
        </p>
      ) : availability === "available" ? (
        <p id={`${id}-hint`} className="flex items-center gap-1 text-xs text-green-600">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          linkdrop.co/{trimmed} is available
        </p>
      ) : availability === "taken" ? (
        <p id={`${id}-hint`} className="flex items-center gap-1 text-xs text-red-500">
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          linkdrop.co/{trimmed} is taken
        </p>
      ) : (
        <p id={`${id}-hint`} className="text-xs text-secondary">
          Letters, numbers, underscores, and hyphens.
        </p>
      )}
    </div>
  );
}
