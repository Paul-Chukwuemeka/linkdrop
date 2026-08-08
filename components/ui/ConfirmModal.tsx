import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  destructive?: boolean;
  isPending?: boolean;
  pendingLabel?: string;
  confirmDisabled?: boolean;
  children?: React.ReactNode;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  destructive = true,
  isPending = false,
  pendingLabel = "Deleting…",
  confirmDisabled = false,
  children,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm shadow-(--shadow-card)"
      onClick={isPending ? undefined : onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-sm w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

        {children}

        <div className="flex gap-3 justify-end w-full mt-6">
          <button
            className="px-4 py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-black dark:text-white font-semibold rounded-full transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-full transition-colors flex-1 disabled:opacity-60 disabled:cursor-not-allowed ${
              destructive
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white"
            }`}
            disabled={isPending || confirmDisabled}
            onClick={() => {
              void (async () => {
                await onConfirm();
                onClose();
              })();
            }}
          >
            {isPending ? (
              <span
                className="inline-flex items-center justify-center gap-2"
                role="status"
              >
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>{pendingLabel}</span>
              </span>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};