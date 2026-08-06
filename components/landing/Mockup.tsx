import { Reveal } from "@/components/landing/Reveal";

export default function Mockup() {
  return (
    <section className="py-16 sm:py-20 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <Reveal>
          <h2
            className="text-center text-3xl sm:text-4xl font-normal tracking-tight text-[var(--ink)]"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Your page, your style
          </h2>
          <p className="text-center mt-3 text-[var(--text-secondary)] max-w-md mx-auto">
            Clean, fast, and yours. Every profile is a live link-in-bio page.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10 relative w-full max-w-sm mx-auto">
          <div className="bg-noise absolute inset-0 rounded-3xl" />

          {/* card */}
          <div className="relative bg-white rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 z-10 ring-1 ring-[var(--border-soft)]">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[var(--forest)] to-[var(--ink)] flex items-center justify-center text-white text-xl font-bold shadow-md">
                J
              </div>
              <h3
                className="mt-3 text-lg text-[var(--ink)]"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                @jules
              </h3>
              <p className="text-sm text-[var(--text-secondary)] text-center mt-1">
                Designer &amp; creator. Building things on the web.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {[
                { label: "Portfolio", forest: false },
                { label: "Latest project", forest: true },
                { label: "Newsletter", forest: false },
                { label: "Merch store", forest: false },
              ].map((link, i) => (
                <div
                  key={i}
                  className={`text-white text-sm font-semibold text-center rounded-xl py-3 px-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer ${
                    link.forest
                      ? "bg-[var(--forest)]"
                      : "bg-[var(--ink)]"
                  }`}
                >
                  {link.label}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
