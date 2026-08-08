"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ButtonLoader } from "@/components/ui/ButtonLoader";
import { SectionCard } from "@/components/ui/SectionCard";
import { apiFetch, ApiError } from "@/lib/api";
import { PASSWORD_PATTERN, PASSWORD_MIN_LENGTH } from "@/lib/validations/auth";
import { Shield } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const passwordHint = `At least ${PASSWORD_MIN_LENGTH} characters with an uppercase letter, a lowercase letter, and a number.`;

  async function handleSubmit(e: React.SubmitEvent) {
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
    <SectionCard>
      <div className="flex items-start gap-3">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[#6B6B6B]" />
        <div>
          <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-neutral-100">
            Authentication
          </h3>
          <p className="mt-1 text-sm text-[#6B6B6B] dark:text-neutral-400">
            Update the password used to sign in with your username.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#1A1A1A] dark:text-neutral-100">
          Current password
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isSaving}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#1A1A1A] dark:text-neutral-100">
          New password
          <Input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isSaving}
          />
        </label>
        <p className="text-xs text-[#6B6B6B] dark:text-neutral-400">{passwordHint}</p>
        <div className="pt-2">
          <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? <ButtonLoader label="Saving…" onDark /> : "Change password"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
