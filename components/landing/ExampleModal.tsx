"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import { Modal } from "@/components/ui/Modal";

export function ExampleModal() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

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

      <Modal isOpen={open} onClose={() => setOpen(false)} label="Example LinkDrop profile">
        <div className="relative min-w-0 rounded-3xl bg-background-primary p-6 shadow-2xl sm:p-8">
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
      </Modal>
    </>
  );
}
