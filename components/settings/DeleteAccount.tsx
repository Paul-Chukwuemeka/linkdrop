"use client";

import { Input } from "@/components/ui/Input";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SectionCard } from "@/components/ui/SectionCard";
import { apiFetch, ApiError } from "@/lib/api";
import { logout } from "@/lib/logout";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function DeleteAccount({
  hasPassword,
  email,
}: {
  hasPassword: boolean;
  email: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      const payload = hasPassword
        ? { password }
        : { confirm };
      await apiFetch("/api/auth/account", {
        method: "DELETE",
        json: payload,
      });
      toast.success("Account deleted.");
      await logout();
    } catch (err) {
      setIsDeleting(false);
      setIsOpen(false);
      const msg = err instanceof ApiError ? err.message : "Failed to delete account.";
      toast.error(msg);
    }
  }

  return (
    <SectionCard>
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-[#DC2626]" />
        <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-neutral-100">
          Delete account
        </h3>
      </div>
      <p className="text-sm text-[#6B6B6B] dark:text-neutral-400 mb-6">
        Permanently deletes your account, cards, links, and profile. This cannot be undone.
      </p>

      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 w-auto items-center gap-2 rounded-lg border border-[#DC2626] px-4 text-sm font-medium text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.08)]"
      >
        <Trash2 className="h-4 w-4" />
        Delete my account
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => {
          if (!isDeleting) setIsOpen(false);
        }}
        onConfirm={handleConfirm}
        title="Delete account"
        message={
          hasPassword
            ? "Enter your current password to confirm deletion."
            : `Type ${email} to confirm deletion.`
        }
        destructive
        isPending={isDeleting}
        pendingLabel="Deleting…"
      >
        {hasPassword ? (
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isDeleting}
            className="mt-4"
          />
        ) : (
          <Input
            type="text"
            placeholder={`Type ${email}`}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={isDeleting}
            className="mt-4"
          />
        )}
      </ConfirmModal>
    </SectionCard>
  );
}