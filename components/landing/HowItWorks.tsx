import { Link, Palette, Share2 } from "lucide-react";

const steps = [
  {
    icon: Link,
    title: "Claim your brand",
    description:
      "Secure your unique URL in seconds. Your page is live before you finish your coffee.",
  },
  {
    icon: Palette,
    title: "Design without code",
    description:
      "Match your fonts, colors, and vibe. Organize links into collections that look intentional.",
  },
  {
    icon: Share2,
    title: "Convert your audience",
    description:
      "One link that drives traffic everywhere you earn — bios, emails, QR codes, and beyond.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-6 px-6 py-16 md:px-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-brand-green">
          Simple setup
        </p>

        <h2 className="text-center text-3xl font-medium leading-[1.2] tracking-tight text-primary lg:text-[32px]">
          How it works
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-14 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <article
                key={i}
                className="relative rounded-2xl border border-border-subtle bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  aria-label={`Step ${i + 1}`}
                  className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white shadow-sm"
                >
                  {i + 1}
                </div>

                <div className="mb-4 mt-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10">
                  <Icon
                    className="h-5 w-5 text-brand-green"
                    strokeWidth={2}
                  />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-secondary">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
