import React from "react";
import { Spinner } from "./Spinner";

type FullScreenLoaderProps = {
  label?: string;
  className?: string;
};

export function FullScreenLoader({
  label = "Loading LinkDrop...",
  className = "min-h-dvh w-full",
}: FullScreenLoaderProps) {
  return (
    <div
      className={[
        "flex items-center justify-center bg-neutral-50 dark:bg-neutral-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-10 w-10" />
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
      </div>
    </div>
  );
}