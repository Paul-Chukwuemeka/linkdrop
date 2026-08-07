"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { apiFetch, ApiError } from "@/lib/api";
import { logout } from "@/lib/logout";
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
    <div className="flex flex-col gap-4 rounded-lg bg-red-100/20 dark:bg-red-950/20 p-4 sm:p-5 shadow-(--shadow-card)">
      <div>
        <h3 className="text-base font-bold text-red-700 dark:text-red-300">
          Delete account
        </h3>
        <p className="mt-1 text-xs text-red-600/80 dark:text-red-300/80">
          Permanently deletes your account, cards, links, and profile. This cannot be undone.
        </p>
      </div>

      <Button
        variant="danger"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto"
      >
        Delete my account
      </Button>

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
    </div>
  );
}