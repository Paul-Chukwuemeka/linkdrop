export default function Testimonials() {
  const testimonials = [
    {
      name: "Maya R.",
      role: "Freelance Designer",
      text: "Finally a link page that looks like I designed it myself. The collection feature is a game-changer.",
      initials: "MR",
      color: "bg-rose-400",
    },
    {
      name: "Kai T.",
      role: "Indie Hacker",
      text: "Set it up in under 2 minutes. Clean, fast, and my users actually click through now.",
      initials: "KT",
      color: "bg-teal-500",
    },
    {
      name: "Sam O.",
      role: "Content Creator",
      text: "I love that I can have multiple cards — one for my podcast, one for my blog, one for merch.",
      initials: "SO",
      color: "bg-amber-400",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-black italic tracking-tight text-[var(--text-primary)]">
          Creators love it
        </h2>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`h-10 w-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {t.name}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {t.role}
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
