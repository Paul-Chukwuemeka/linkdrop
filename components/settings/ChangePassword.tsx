"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ButtonLoader } from "@/components/ui/ButtonLoader";
import { apiFetch, ApiError } from "@/lib/api";
import { PASSWORD_PATTERN, PASSWORD_MIN_LENGTH } from "@/lib/validations/auth";
import { useState } from "react";
import toast from "react-hot-toast";

export function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const passwordHint = `At least ${PASSWORD_MIN_LENGTH} characters with an uppercase letter, a lowercase letter, and a number.`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Fill in both password fields.");
      return;
    }
    if (!PASSWORD_PATTERN.test(newPassword) || newPassword.length < PASSWORD_MIN_LENGTH) {
      toast.error(passwordHint);
      return;
    }
    setIsSaving(true);
    try {
      await apiFetch("/api/auth/password", {
        method: "PATCH",
        json: { current_password: currentPassword, new_password: newPassword },
      });
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to change password.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-neutral-900 p-4 sm:p-5 shadow-(--shadow-card) ring-1 ring-(--border-color)">
      <div>
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          Change password
        </h3>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          Update the password used to sign in with your username.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Current password
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isSaving}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          New password
          <Input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isSaving}
          />
        </label>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{passwordHint}</p>
        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? <ButtonLoader label="Saving…" onDark /> : "Change password"}
        </Button>
      </form>
    </div>
  );
}
