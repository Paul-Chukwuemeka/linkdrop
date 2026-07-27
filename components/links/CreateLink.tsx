import { useState } from "react";
import { useCard } from "@/context/CardContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";
import { isValidUrl } from "@/utils/validate";
import { Link2, X } from "lucide-react";

export function CreateLink() {
  const { isLoadingCard: isLoading, saveLink, setIsCreatingLink, cardError: error, setCardError: setError } =
    useCard();

  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const nestedInputClassName =
    "rounded-xl bg-neutral-50 dark:bg-neutral-800 shadow-none ring-neutral-200 dark:ring-neutral-700 focus:ring-[var(--accent)]";

  function close() {
    if (isLoading) return;
    setLocalError(null);
    setHasSubmitted(false);
    setError(null);
    setIsCreatingLink(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <form
        className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-4 shadow-(--shadow-card) ring-1 ring-(--border-color) sm:p-6"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          setHasSubmitted(true);
          const nextTitle = title.trim();
          const nextUrl = url.trim();
          if (!nextTitle || !nextUrl) {
            setLocalError("Title and URL are required.");
            return;
          }
          if (!isValidUrl(nextUrl)) {
            setLocalError("Please enter a valid URL (https://…).");
            return;
          }
          setLocalError(null);
          setError(null);
          saveLink({ title: nextTitle, url: nextUrl });
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Add link"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
                <Link2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-xl">
                Add link
              </h2>
            </div>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              Add a title and a URL for your page.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 transition hover:bg-black/10 dark:hover:bg-white/20"
            onClick={close}
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Title</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder="e.g. My portfolio"
              className={nestedInputClassName}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">URL</div>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
              placeholder="https://…"
              className={nestedInputClassName}
              disabled={isLoading}
            />
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Tip: use a full URL (including https://).
            </div>
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
