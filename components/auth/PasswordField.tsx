"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { PASSWORD_MIN_LENGTH } from "@/lib/validations/auth";

const STRENGTH_SEGMENTS = [
  (v: string) => v.length >= PASSWORD_MIN_LENGTH,
  (v: string) => /[a-z]/.test(v),
  (v: string) => /[A-Z]/.test(v),
  (v: string) => /\d/.test(v),
];

function scorePassword(value: string) {
  return STRENGTH_SEGMENTS.reduce((score, test) => score + (test(value) ? 1 : 0), 0);
}

function strengthTone(score: number) {
  if (score >= 4) return "bg-green-500";
  if (score >= 2) return "bg-yellow-400";
  return "bg-red-400";
}

function strengthLabel(score: number) {
  if (score >= 4) return "Strong";
  if (score >= 2) return "Fair";
  return "Weak";
}

interface PasswordFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export function PasswordField({ id, value, onChange, onBlur, error }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  const score = scorePassword(value);
  const tone = strengthTone(score);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-primary">
        Password
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={`Minimum ${PASSWORD_MIN_LENGTH} characters`}
          autoComplete="new-password"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : `${id}-strength`}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-sm text-primary placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all"
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 rounded-md"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      ) : (
        <div id={`${id}-strength`} className="space-y-1.5">
          {value.length > 0 && (
            <>
              <div className="flex gap-1.5">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < score ? tone : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">{strengthLabel(score)}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
