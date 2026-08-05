"use client";

import { ChangePassword } from "@/components/settings/ChangePassword";
import { DeleteAccount } from "@/components/settings/DeleteAccount";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch, ApiError } from "@/lib/api";
import { useEffect, useState } from "react";

type MeResponse = {
  id: string;
  username: string;
  email: string;
  fullname: string;
  has_password: boolean;
};

export default function SettingsPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch<MeResponse>("/api/auth/me");
        if (mounted) setMe(data);
      } catch (err) {
        if (mounted)
          setError(
            err instanceof ApiError ? err.message : "Failed to load settings.",
          );
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-neutral-900 p-10 shadow-(--shadow-card)   ">
        <Spinner />
        <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Loading settings…
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="bg-white dark:bg-neutral-900 p-4 sm:p-5 md:p-6 rounded-lg shadow-(--shadow-card)">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Settings
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
          Manage your account security.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700  ring-red-100">
          {error}
        </div>
      )}

      <div className="flex pb-5 pt-2 justify-center rounded-lg gap-3 flex-1 bg-white dark:bg-neutral-900 sm:gap-4">
        <div className="max-w-200 w-full">
          {me?.has_password ? (
            <ChangePassword />
          ) : (
            <div className="p-4 sm:p-5 text-sm text-neutral-700 dark:text-neutral-300">
              You sign in with a provider and don’t use a password.
            </div>
          )}
          <DeleteAccount
            hasPassword={me?.has_password === true}
            email={me?.email ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
