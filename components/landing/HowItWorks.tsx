export default function HowItWorks() {
  const steps = [
    {
      emoji: "🔗",
      title: "Claim your link",
      description: "Pick a username — your public page is live in seconds.",
    },
    {
      emoji: "🎨",
      title: "Style your cards",
      description: "Add links, organize collections, pick fonts and colors.",
    },
    {
      emoji: "🚀",
      title: "Share everywhere",
      description: "Drop your LinkDrop into bios, emails, and QR codes.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-black italic tracking-tight text-[var(--text-primary)]">
          How it works
        </h2>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0"
              style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -1.5 : 1.5}deg)` }}
            >
              <div className="absolute -top-4 -left-2 h-8 w-8 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center shadow-md">
                {i + 1}
              </div>
              <div className="text-4xl mb-4">{step.emoji}</div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
