"use client";

import { FcGoogle } from "react-icons/fc";
import { ButtonLoader } from "@/components/ui/ButtonLoader";

interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
}

export function GoogleButton({
  onClick,
  loading = false,
  disabled = false,
  label = "Create account with Google",
  ariaLabel,
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-primary shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
    >
      {loading ? (
        <ButtonLoader label="Redirecting…" />
      ) : (
        <>
          <FcGoogle className="h-5 w-5" />
          {label}
        </>
      )}
    </button>
  );
}
