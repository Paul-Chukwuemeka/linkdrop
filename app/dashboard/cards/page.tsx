"use client";
import { CardsOverview } from "@/components/cards/CardsOverview";
import CardPreview from "@/components/cards/CardPreview";

export default function DashboardCardsPage() {
  return (
    <div className="flex min-w-0 h-full flex-col gap-2 sm:gap-3 items-center">
      <div className="bg-white dark:bg-neutral-900 w-full p-4 md:p-5 rounded-xl shadow-(--shadow-card)   ">
        <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Cards
        </h1>
        <p className="mt-1 text-[13px] text-neutral-700 dark:text-neutral-300">
          Manage the pages you publish under your username.
        </p>
      </div>
      <div className="flex-1 gap-1 md:gap-3 items-center w-full overflow-auto flex justify-center rounded-xl">
        <CardsOverview />
        <div
          className="md:p-2 hidden lg:flex bg-white dark:bg-neutral-900 p-2 items-center justify-center rounded-xl h-full"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <CardPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
