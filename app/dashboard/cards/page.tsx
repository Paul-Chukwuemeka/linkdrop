"use client";
import { CardsOverview } from "@/components/cards/CardsOverview";
import CardPreview from "@/components/cards/CardPreview";

export default function DashboardCardsPage() {
  return (
    <div className="flex min-w-0 h-full flex-col gap-4">
      <div className="bg-white p-6 shadow-(--shadow-card) ring-1 ring-(--color-border)">
        <h1
          className="text-2xl font-extrabold tracking-tight text-neutral-900"

        >
          Cards
        </h1>
        <p className="mt-2 text-sm text-neutral-700">
          Manage the pages you publish under your username.
        </p>
      </div>
      <div className="grid h-full  grid-cols-1 bg-white gap-6 lg:grid-cols-[1fr_360px]">
        <CardsOverview />
        <div className="max-lg:hidden p-2">
          <CardPreview />
        </div>
      </div>
    </div>
  );
}
