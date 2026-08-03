import React from "react";
import { Spinner } from "./Spinner";

type ButtonLoaderProps = {
  label?: string;
  onDark?: boolean;
};

export function ButtonLoader({ label = "Saving…", onDark }: ButtonLoaderProps) {
  return (
    <span
      className="inline-flex items-center justify-center gap-2"
      role="status"
    >
      <Spinner className={onDark ? "h-4 w-4 border-t-white" : "h-4 w-4"} />
      <span>{label}</span>
    </span>
  );
}