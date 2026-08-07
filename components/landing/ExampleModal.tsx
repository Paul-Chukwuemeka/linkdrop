"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import PhoneMockup from "./PhoneMockup";

export function ExampleModal() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-4 inline-block rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2"
      >
        See an example profile{" "}
        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
          &rarr;
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Example LinkDrop profile"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm"
        >
          <div className="relative rounded-3xl bg-background-primary p-6 shadow-2xl sm:p-8">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close example profile"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2"
            >
              <X className="h-5 w-5" />
            </button>
            <PhoneMockup />
          </div>
        </div>
      )}
    </>
  );
}
