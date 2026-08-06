import { Reveal } from "@/components/landing/Reveal";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Maya R.",
      role: "Freelance Designer",
      text: "Finally a link page that looks like I designed it myself. The collection feature is a game-changer.",
      initials: "MR",
      ring: "ring-[var(--forest)]/30",
      bg: "bg-[var(--forest)]/10",
      textC: "text-[var(--forest)]",
    },
    {
      name: "Kai T.",
      role: "Indie Hacker",
      text: "Set it up in under 2 minutes. Clean, fast, and my users actually click through now.",
      initials: "KT",
      ring: "ring-[var(--ink)]/20",
      bg: "bg-[var(--ink)]/8",
      textC: "text-[var(--ink)]",
    },
    {
      name: "Sam O.",
      role: "Content Creator",
      text: "I love that I can have multiple cards — one for my podcast, one for my blog, one for merch.",
      initials: "SO",
      ring: "ring-amber-500/30",
      bg: "bg-amber-500/10",
      textC: "text-amber-600",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <h2
            className="text-center text-3xl sm:text-4xl font-normal tracking-tight text-[var(--ink)]"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Creators love it
          </h2>
        </Reveal>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="bg-white ring-1 ring-[var(--border-soft)] rounded-2xl p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`h-10 w-10 rounded-full ${t.bg} ring-1 ${t.ring} flex items-center justify-center ${t.textC} text-sm font-bold`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--ink)]">
                      {t.name}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {t.role}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4].map((j) => (
                    <svg
                      key={j}
                      className="h-3 w-3 fill-[var(--amber)]"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="var(--amber)"
                    strokeWidth="1.5"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
