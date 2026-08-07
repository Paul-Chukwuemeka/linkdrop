import { ChevronRight } from "lucide-react";

const cards = [
  { label: "Portfolio", bg: "bg-[#eef4ea]" },
  { label: "Latest project", bg: "bg-white" },
  { label: "Newsletter", bg: "bg-[#f7efdd]" },
  { label: "Merch store", bg: "bg-[#eef4ea]" },
];

export default function PhoneMockup({ id }: { id?: string }) {
  return (
    <div
      id={id}
      className="animate-float relative mx-auto w-[280px] sm:w-[300px]"
    >
      {/* phone frame */}
      <div className="relative rounded-[3rem] border border-border-subtle bg-background-elevated p-3 shadow-2xl">
        {/* dynamic island */}
        <div className="absolute left-1/2 top-6 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-primary" />

        {/* screen */}
        <div className="relative h-[540px] overflow-hidden rounded-[2.6rem] bg-background-primary px-5 pb-8 pt-16">
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-brand-green-hover text-xl font-semibold text-white shadow-md">
              J
            </div>
            <div className="mt-3 text-base font-semibold text-primary">
              @jules
            </div>
            <p className="mt-1 max-w-[200px] text-center text-xs text-secondary">
              Designer &amp; creator building on the web.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {cards.map((card, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium text-primary shadow-[0_4px_24px_rgba(0,0,0,0.06)] ${card.bg}`}
              >
                {card.label}
                <ChevronRight
                  className="h-4 w-4 text-secondary"
                  strokeWidth={2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
