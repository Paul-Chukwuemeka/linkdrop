import type { Card } from "@/lib/types";
import Link from "next/link";
import React from "react";

export function CardRow({ card }: { card: Card }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-(--shadow-card) ring-1 ring-(--color-border)">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-neutral-900">{card.name}</div>
        <div className="mt-1 text-xs text-neutral-600">Card ID: {card.id}</div>
      </div>
      <Link
        href={`/dashboard/cards/${card.id}`}
        className="shrink-0 rounded-full bg-(--color-dark) px-3 sm:px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity touch-manipulation"
      >
        Edit
      </Link>
    </div>
  );
}

