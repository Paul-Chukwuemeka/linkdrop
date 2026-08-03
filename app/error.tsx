"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash boundary:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <div className="rounded-2xl border bg-white p-8 shadow-(--shadow-card) max-w-md">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
        <p className="mb-6 text-neutral-600">
          We experienced an unexpected error. Don&apos;t worry, your data is safe.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-black px-6 py-2.5 text-white shadow-md hover:bg-neutral-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
