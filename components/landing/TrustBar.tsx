import { Lock, Zap, Shield } from "lucide-react";

const items = [
  { icon: Lock, label: "Secure & private" },
  { icon: Zap, label: "Instant setup" },
  { icon: Shield, label: "No spam, ever" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-border-subtle bg-white py-12">
      <ul className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-8 px-6 md:flex-row md:gap-12">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={i} className="flex items-center gap-2.5">
              <Icon className="h-5 w-5 text-brand-green" strokeWidth={1.75} />
              <span className="text-sm font-medium text-primary">
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
