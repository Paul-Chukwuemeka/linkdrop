"use client";

import { FcGoogle } from "react-icons/fc";
import { KeyRound } from "lucide-react";
import React from "react";
import { SectionCard } from "@/components/ui/SectionCard";

const PROVIDERS: Record<
  string,
  { label: string; icon: (className: string) => React.ReactNode }
> = {
  google: {
    label: "Google",
    icon: (className) => <FcGoogle className={className} />,
  },
};

export function ConnectedAccount({
  provider,
  email,
}: {
  provider: string | null;
  email: string;
}) {
  const info = provider ? PROVIDERS[provider] : null;
  const Icon = info?.icon;
  const label = info?.label ?? "LinkDrop username & password";

  return (
    <SectionCard>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(26,26,26,0.06)] dark:bg-neutral-800">
          {provider && Icon ? (
            Icon("h-5 w-5")
          ) : (
            <KeyRound className="h-5 w-5 text-[#6B6B6B] dark:text-neutral-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-neutral-100">
              {label}
            </h3>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
              Connected
            </span>
          </div>
          <p className="mt-1 text-sm text-[#6B6B6B] dark:text-neutral-400">
            Connected as{" "}
            <span className="font-medium text-[#1A1A1A] dark:text-neutral-200">
              {email}
            </span>{" "}
            via {label}.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}