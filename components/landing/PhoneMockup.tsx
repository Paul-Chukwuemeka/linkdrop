import { ChevronRight } from "lucide-react";

const cards = ["Portfolio", "Latest project", "Newsletter", "Merch store"];

type PhoneVariant = "light" | "dark";

interface PhoneMockupProps {
  id?: string;
  variant?: PhoneVariant;
}

export default function PhoneMockup({ id, variant = "light" }: PhoneMockupProps) {
  const dark = variant === "dark";

  const frame = dark
    ? "rounded-[3rem] border border-white/15 bg-white/5 p-3"
    : "rounded-[3rem] border border-border-subtle bg-background-elevated p-3";
  const frameShadow = dark
    ? "0 0 0 1px rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.25)"
    : "0 0 0 1px rgba(0,0,0,0.03), 0 12px 40px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.05)";
  const screen = dark
    ? "h-[540px] overflow-hidden rounded-[2.6rem] bg-white/5 px-5 pb-8 pt-16"
    : "h-[540px] overflow-hidden rounded-[2.6rem] bg-background-primary px-5 pb-8 pt-16";
  const island = dark ? "bg-white/30" : "bg-primary";
  const avatar = dark
    ? "flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-xl font-semibold text-white/80"
    : "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-brand-green-hover text-xl font-semibold text-white shadow-md";
  const name = dark ? "text-base font-semibold text-white/90" : "text-base font-semibold text-primary";
  const bio = dark
    ? "mt-1 max-w-[200px] text-center text-xs text-white/60"
    : "mt-1 max-w-[200px] text-center text-xs text-secondary";
  const linkCard = dark
    ? "flex items-center justify-between rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/85"
    : "flex items-center justify-between rounded-xl border border-[rgba(26,26,26,0.06)] bg-white px-4 py-3 text-sm font-medium text-primary shadow-sm";
  const chevron = dark ? "h-4 w-4 text-white/40" : "h-4 w-4 text-[#6B6B6B]";

  return (
    <div
      id={id}
      className={`relative mx-auto w-[280px] sm:w-[300px] ${dark ? "" : "phone-wrapper"}`}
    >
      <div className={dark ? "" : "animate-float"}>
        <div
          className={frame}
          style={{
            boxShadow: frameShadow,
          }}
        >
          <div className={`absolute left-1/2 top-6 z-20 h-6 w-24 -translate-x-1/2 rounded-full ${island}`} />

          <div className={screen}>
            <div className="flex flex-col items-center">
              <div className={avatar}>J</div>
              <div className={`mt-3 ${name}`}>@jules</div>
              <p className={bio}>
                Designer &amp; creator building on the web.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {cards.map((label, i) => (
                <div key={i} className={linkCard}>
                  {label}
                  <ChevronRight className={chevron} strokeWidth={2} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
