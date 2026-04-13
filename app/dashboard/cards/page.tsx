"use client";
import { CardsOverview } from "@/components/cards/CardsOverview";
import CardPreview from "@/components/cards/CardPreview";

export default function DashboardCardsPage() {
  return (
    <div className="flex min-w-0 h-full flex-col gap-3 sm:gap-4">
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-(--shadow-card) ring-1 ring-(--color-border)">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">
          Cards
        </h1>
        <p className="mt-2 text-sm text-neutral-700">
          Manage the pages you publish under your username.
        </p>
      </div>
      <div className="grid h-full flex-1 grid-cols-1 bg-white gap-4 sm:gap-6 rounded-xl overflow-auto lg:grid-cols-[1fr_360px]">
        <CardsOverview />
        <div className="hidden lg:block p-2 sm:p-3">
          <CardPreview />
        </div>
      </div>
    </div>
  );
}
