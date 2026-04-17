"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard sub-boundary error:", error);
  }, [error]);

  return (
    <div className="flex w-full h-[50vh] flex-col items-center justify-center p-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col items-center text-center">
        <h3 className="mb-2 text-xl font-bold text-red-600">Dashboard Error</h3>
        <p className="mb-4 text-sm text-neutral-600 max-w-sm">
          A component crashed inside the dashboard. 
        </p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-black px-5 py-2 text-sm text-white hover:bg-neutral-800 transition-colors"
        >
          Reload Dashboard
        </button>
      </div>
    </div>
  );
}
