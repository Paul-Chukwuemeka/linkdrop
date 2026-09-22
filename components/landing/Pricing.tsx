import Link from "next/link";
import { Check } from "lucide-react";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  recommended?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Everything you need to launch your first page.",
    features: [
      "1 card, up to 25 links",
      "Core themes",
      "Basic click counts",
      "LinkDrop badge",
    ],
    cta: "Get started free",
    href: "/register",
  },
  {
    name: "Pro",
    price: "$9",
    cadence: "per month",
    description: "For creators who want the full toolkit.",
    features: [
      "Unlimited cards and links",
      "All themes, fonts and layouts",
      "Full click analytics",
      "QR codes for every card",
      "Remove the LinkDrop badge",
    ],
    cta: "Choose Pro",
    href: "/register",
    recommended: true,
  },
  {
    name: "Business",
    price: "$29",
    cadence: "per month",
    description: "For teams and multi-project creators.",
    features: [
      "Everything in Pro",
      "Up to 3 profiles",
      "Analytics export",
      "Early access to new features",
      "Priority support",
    ],
    cta: "Choose Business",
    href: "/register",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 px-6 py-16 md:px-12 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-brand-green">
          Pricing
        </p>

        <h2 className="text-center text-3xl font-medium leading-[1.2] tracking-tight text-primary lg:text-[32px]">
          Simple pricing that grows with you
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-secondary">
          Start free. Upgrade when your audience does.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch lg:gap-8">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 ${
                tier.recommended
                  ? "border-brand-green shadow-[0_12px_40px_rgba(27,58,27,0.12)] lg:scale-[1.03]"
                  : "border-border-subtle shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
              }`}
            >
              {tier.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-green px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Recommended
                </span>
              )}

              <h3 className="text-lg font-semibold text-primary">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {tier.description}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-primary">
                  {tier.price}
                </span>
                <span className="text-sm text-secondary">{tier.cadence}</span>
              </div>

              <ul className="mt-6 flex flex-col gap-3 pb-8">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-primary"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-green"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`mt-auto inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 ${
                  tier.recommended
                    ? "bg-brand-green text-white hover:bg-brand-green-hover"
                    : "border border-border-subtle bg-white text-primary hover:bg-background-primary"
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-secondary">
          Prices in USD. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>
    </section>
  );
}
