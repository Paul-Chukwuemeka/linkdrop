import { Reveal } from "@/components/landing/Reveal";
import {
  Layers,
  FolderKanban,
  Palette,
  UserRound,
  Zap,
  Lock,
} from "lucide-react";

const icons = [Layers, FolderKanban, Palette, UserRound, Zap, Lock];

export default function Features() {
  const features = [
    {
      title: "Multiple cards",
      description: "Separate your work, side projects, and personal links.",
    },
    {
      title: "Collections",
      description: "Group related links under a single card for cleaner pages.",
    },
    {
      title: "Custom styles",
      description: "Fonts, colors, gradients — make your page feel like you.",
    },
    {
      title: "Avatar & bio",
      description: "Add a photo and short bio to your public profile.",
    },
    {
      title: "Instant page",
      description: "Every profile is a live page — no hosting needed.",
    },
    {
      title: "Private by default",
      description:
        "Only publish what you want. Cards stay private until you share.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 bg-[var(--cream)]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <h2
            className="text-center text-3xl sm:text-4xl font-normal tracking-tight text-[var(--ink)]"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Everything you need
          </h2>
          <p className="text-center mt-3 text-[var(--text-secondary)] max-w-md mx-auto">
            Simple tools that let you focus on what matters — your links.
          </p>
        </Reveal>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={i} delay={i * 60}>
                <div className="group bg-white ring-1 ring-[var(--border-soft)] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-full">
                  <div className="h-10 w-10 rounded-xl bg-[var(--forest)]/[0.08] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-[var(--forest)]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--ink)]">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
