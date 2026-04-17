import { useState, useContext } from "react";
import { useCard } from "@/context/CardContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";
import { FolderPlus, X } from "lucide-react";

export function CreateCollection() {
  const { isLoadingCard: isLoading, setIsCreatingCollection, addCollection, cardError: error, setCardError: setError } =
    useCard();

  const [title, setTitle] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const nestedInputClassName =
    "rounded-xl bg-neutral-50 shadow-none ring-neutral-200 focus:ring-[var(--accent)]";

  function close() {
    if (isLoading) return;
    setLocalError(null);
    setHasSubmitted(false);
    setError(null);
    setIsCreatingCollection(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <form
        className="w-full max-w-md rounded-2xl bg-white p-4 shadow-(--shadow-card) ring-1 ring-(--color-border) sm:p-6"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          setHasSubmitted(true);
          const nextTitle = title.trim();
          if (!nextTitle) {
            setLocalError("Title is required.");
            return;
          }
          setLocalError(null);
          setError(null);
          addCollection(nextTitle);
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Create collection"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-neutral-800">
                <FolderPlus className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-900 sm:text-xl">
                Create collection
              </h2>
            </div>
            <p className="mt-2 text-sm text-neutral-700">
              Group links under a section on your page.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-neutral-700 transition hover:bg-black/10"
            onClick={close}
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-neutral-600">Title</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder="e.g. Projects"
              className={nestedInputClassName}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {localError || (hasSubmitted ? error : null) ? (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
              {localError || error}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={close} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
