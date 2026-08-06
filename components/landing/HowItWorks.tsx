import { Reveal } from "@/components/landing/Reveal";

export default function HowItWorks() {
  const steps = [
    {
      title: "Claim your link",
      description: "Pick a username — your public page is live in seconds.",
    },
    {
      title: "Style your cards",
      description: "Add links, organize collections, pick fonts and colors.",
    },
    {
      title: "Share everywhere",
      description: "Drop your LinkDrop into bios, emails, and QR codes.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4">
      <Reveal className="max-w-5xl mx-auto">
        <h2
          className="text-center text-3xl sm:text-4xl font-normal tracking-tight text-[var(--ink)]"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          How it works
        </h2>

        <div className="relative mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {/* connecting hairline (desktop only) */}
          <div className="hidden sm:block absolute top-6 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-[var(--border-soft)]" />

          {steps.map((step, i) => (
            <div
              key={i}
              className={`group relative bg-white ring-1 ring-[var(--border-soft)] rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                i === 1 ? "sm:mt-8" : ""
              }`}
            >
              {/* numbered dot on connecting line */}
              <div className="hidden sm:flex absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-[var(--forest)] text-white text-xs font-bold items-center justify-center shadow-md z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                {i + 1}
              </div>

              {/* faded serif numeral */}
              <span
                className="absolute -top-2 -right-1 text-6xl font-normal text-[var(--forest)]/[0.06] leading-none pointer-events-none select-none"
                style={{ fontFamily: "var(--font-dm-serif)" }}
                aria-hidden
              >
                {i + 1}
              </span>

              <h3 className="text-lg font-semibold text-[var(--ink)] mt-2">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
