"use client";

import { Input } from "@/components/ui/Input";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SectionCard } from "@/components/ui/SectionCard";
import { apiFetch, ApiError } from "@/lib/api";
import { logout } from "@/lib/logout";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

function isConfirmed(confirmText: string, username: string) {
  const value = confirmText.trim().toLowerCase();
  const name = username.trim().toLowerCase();
  return value === "delete" || (name.length > 0 && value === name);
}

export function DeleteAccount({
  hasPassword,
  username,
}: {
  hasPassword: boolean;
  username: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const confirmValid = useMemo(
    () => isConfirmed(confirmText, username),
    [confirmText, username],
  );

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      const payload = hasPassword
        ? { password }
        : { confirm: confirmText.trim().toLowerCase() };
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
        className="inline-flex h-9 w-auto items-center gap-2 rounded-lg bg-[#DC2626] px-4 text-sm font-medium text-white transition-colors hover:bg-[#B91C1C]"
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
            ? `Enter your current password and type ${username} (or DELETE) to confirm.`
            : `Type ${username} or DELETE to confirm.`
        }
        destructive
        isPending={isDeleting}
        pendingLabel="Deleting…"
        confirmDisabled={!confirmValid || (hasPassword && password.length === 0)}
      >
        {hasPassword && (
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isDeleting}
            className="mt-4"
          />
        )}
        <Input
          type="text"
          placeholder={hasPassword ? `Type ${username} or DELETE` : `Type ${username} or DELETE`}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          disabled={isDeleting}
          className={hasPassword ? "mt-3" : "mt-4"}
        />
      </ConfirmModal>
    </SectionCard>
  );
}