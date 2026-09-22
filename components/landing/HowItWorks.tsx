const steps = [
  {
    n: "1",
    circle: "bg-brand-green text-background-primary",
    title: "claim your name",
    aside: "dropcard.co/you",
  },
  {
    n: "2",
    circle: "bg-accent-gold text-brand-green",
    title: "pick a theme, or wreck it",
    aside: "any color. any font.",
  },
  {
    n: "3",
    circle: "bg-accent-coral-dark text-white",
    title: "paste your links",
    aside: "done. go outside.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto mt-10 w-full max-w-[1200px] border-t-2 border-dashed border-[#c9c2ad] px-6 pt-8 md:px-9">
      <h2 className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#5a5a48]">
        {"// how it works"}
      </h2>
      <div className="mt-3 max-w-[560px] rounded-lg border-2 border-dashed border-[#b9b19b] bg-background-primary px-5 py-1.5">
        {steps.map((step, index) => (
          <div
            key={step.n}
            className={`flex items-center gap-3.5 py-3 ${
              index < steps.length - 1
                ? "border-b border-dashed border-[#d5cdb8]"
                : ""
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ${step.circle}`}
            >
              {step.n}
            </span>
            <span className="text-sm font-extrabold text-brand-green">
              {step.title}
            </span>
            <span className="ml-auto font-[family-name:var(--font-jetbrains)] text-[11px] text-[#5a5a48]">
              {step.aside}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
