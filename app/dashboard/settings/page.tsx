"use client";

import { ChangePassword } from "@/components/settings/ChangePassword";
import { ConnectedAccount } from "@/components/settings/ConnectedAccount";
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
  provider: string | null;
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
      <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-neutral-900 p-10">
        <Spinner />
        <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Loading settings…
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="bg-white dark:bg-neutral-900 p-4 sm:p-5 md:p-6 rounded-xl">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Settings
        </h1>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          Manage your account security.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 sm:gap-4 pb-5 pt-2">
        <div className="w-full flex flex-col gap-3 sm:gap-4">
          <ConnectedAccount provider={me?.provider ?? null} email={me?.email ?? ""} />
          {me?.has_password ? <ChangePassword /> : null}
          <DeleteAccount
            hasPassword={me?.has_password === true}
            username={me?.username ?? ""}
          />
        </div>
      </div>
    </div>
  );
}