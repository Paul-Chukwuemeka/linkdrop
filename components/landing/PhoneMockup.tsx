import { ChevronRight } from "lucide-react";

const cards = ["Portfolio", "Latest project", "Newsletter", "Merch store"];

export default function PhoneMockup({ id }: { id?: string }) {
  return (
    <div id={id} className="phone-wrapper relative mx-auto w-70 sm:w-75">
      <div className="animate-float">
        <div
          className="relative rounded-[3rem] border border-border-subtle bg-background-elevated p-3"
          style={{
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.03), 0 12px 40px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.05)",
          }}
        >
          <div className="absolute left-1/2 top-6 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-primary" />

          <div className="relative h-135 overflow-hidden rounded-[2.6rem] bg-background-primary px-5 pb-8 pt-16">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-brand-green to-brand-green-hover text-xl font-semibold text-white shadow-md">
                J
              </div>
              <div className="mt-3 text-base font-semibold text-primary">
                @jules
              </div>
              <p className="mt-1 max-w-50 text-center text-xs text-secondary">
                Designer &amp; creator building on the web.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {cards.map((label, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-[rgba(26,26,26,0.06)] bg-white px-4 py-3 text-sm font-medium text-primary shadow-sm"
                >
                  {label}
                  <ChevronRight
                    className="h-4 w-4 text-[#6B6B6B]"
                    strokeWidth={2}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
