export default function Features() {
  const features = [
    {
      icon: "🃏",
      title: "Multiple cards",
      description: "Separate your work, side projects, and personal links.",
    },
    {
      icon: "📦",
      title: "Collections",
      description: "Group related links under a single card for cleaner pages.",
    },
    {
      icon: "🎨",
      title: "Custom styles",
      description: "Fonts, colors, gradients — make your page feel like you.",
    },
    {
      icon: "🖼️",
      title: "Avatar & bio",
      description: "Add a photo and short bio to your public profile.",
    },
    {
      icon: "⚡",
      title: "Instant page",
      description: "Every profile is a live page — no hosting needed.",
    },
    {
      icon: "🔒",
      title: "Private by default",
      description: "Only publish what you want. Cards stay private until you share.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 bg-[var(--bg-secondary)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-black italic tracking-tight text-[var(--text-primary)]">
          Everything you need
        </h2>
        <p className="text-center mt-3 text-[var(--text-secondary)] max-w-md mx-auto">
          Simple tools that let you focus on what matters — your links.
        </p>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
