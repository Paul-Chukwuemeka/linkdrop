import Link from "next/link";

type Feature = { text: string; soon?: boolean };
type Tier = {
  name: string;
  price: string;
  cadence: string;
  cta: string;
  features: Feature[];
  recommended?: boolean;
};

const tiers: Tier[] = [
  {
    name: "free",
    price: "$0",
    cadence: "forever",
    cta: "start free",
    features: [
      { text: "one card" },
      { text: "all themes & fonts" },
      { text: "collections" },
      { text: "unlimited links" },
    ],
  },
  {
    name: "pro",
    price: "$9",
    cadence: "/mo",
    cta: "choose pro",
    recommended: true,
    features: [
      { text: "everything in free" },
      { text: "multiple cards" },
      { text: "background images" },
      { text: "priority support" },
      { text: "click analytics", soon: true },
      { text: "QR codes", soon: true },
    ],
  },
  {
    name: "business",
    price: "$29",
    cadence: "/mo",
    cta: "choose business",
    features: [
      { text: "everything in pro" },
      { text: "custom domain", soon: true },
      { text: "team seats", soon: true },
      { text: "early access to new features" },
    ],
  },
];

export default function Pricing() {
  return (
    <section className="mx-auto mt-10 w-full max-w-[1200px] border-t-2 border-dashed border-[#c9c2ad] px-6 pt-8 md:px-9">
      <h2 className="font-(family-name:--font-jetbrains) text-2.75 text-[#5a5a48]">
        {"// pricing. no asterisks."}
      </h2>
      <div className="mt-3 flex flex-wrap gap-4">
        {tiers.map((tier, index) => {
          const isPro = Boolean(tier.recommended);
          const cardClass = isPro
            ? "relative w-[210px] rotate-[0.8deg] rounded-[10px] bg-brand-green p-4 text-background-primary shadow-[6px_6px_0_#c8963e]"
            : `relative w-[210px] rounded-[10px] border-2 border-dashed border-[#b9b19b] bg-background-primary p-4 ${
                index === 0 ? "-rotate-1" : "-rotate-[0.6deg]"
              }`;
          const soonClass = isPro ? "text-accent-gold" : "text-[#5a5a48]";
          const buttonClass = isPro
            ? "bg-accent-gold text-brand-green"
            : "bg-brand-green text-background-primary";
          return (
            <div key={tier.name} className={cardClass}>
              {isPro ? (
                <span className="absolute -right-2.5 -top-3 rotate-[7deg] rounded-[3px] bg-accent-coral-dark px-2.5 py-1.5 text-[10px] font-extrabold text-white">
                  most picked
                </span>
              ) : null}
              <div className="font-[family-name:var(--font-space-grotesk)] text-[15px] font-extrabold">
                {tier.name}
              </div>
              <div className="font-[family-name:var(--font-space-grotesk)] text-3xl font-extrabold tracking-tight">
                {tier.price}
                <span className="text-xs font-bold opacity-70">
                  {tier.cadence}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-2.75 leading-snug">
                {tier.features.map((feature) => (
                  <li key={feature.text}>
                    {feature.text}
                    {feature.soon ? (
                      <span
                        className={`ml-1.5 text-[9px] font-extrabold uppercase tracking-wide ${soonClass}`}
                      >
                        (soon)
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-4 block rounded-md px-4 py-2.5 text-center font-[family-name:var(--font-space-grotesk)] text-xs font-extrabold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 ${buttonClass}`}
              >
                {tier.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
