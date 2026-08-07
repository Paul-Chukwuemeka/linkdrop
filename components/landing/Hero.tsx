/* eslint-disable @next/next/no-img-element -- placeholder avatars from pravatar.cc */

import { HeroForm } from "@/components/landing/HeroForm";
import { ExampleModal } from "@/components/landing/ExampleModal";
import PhoneMockup from "@/components/landing/PhoneMockup";

const avatars = Array.from(
  { length: 5 },
  (_, i) => `https://i.pravatar.cc/48?img=${i + 1}`,
);

/* Mini profile cards shown on mobile (<md) as a horizontal scroll strip */
const miniProfiles = [
  { initial: "J", name: "@jules", bg: "bg-[#eef4ea]" },
  { initial: "K", name: "@kai", bg: "bg-white" },
  { initial: "S", name: "@sam", bg: "bg-[#f7efdd]" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* radial gold glow behind the hero text only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200, 150, 56, 0.05) 0%, transparent 100%)",
        }}
      />

      {/* subtle noise texture across the hero beige */}
      <div aria-hidden="true" className="bg-noise pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-16 md:grid-cols-[11fr_9fr] md:px-12 md:pb-24 md:pt-16 lg:items-start">
        {/* left column */}
        <div className="flex flex-col items-center text-center lg:pt-16">
          <h1 className="text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-primary sm:text-5xl lg:text-[48px]">
            Your work deserves a better link-in-bio.
            <br />
            Make it unmistakably{" "}
            <span className="headline-underline">yours</span>.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-secondary">
            Showcase your projects, group links by topic, and share a profile
            that looks like you designed it — no code needed.
          </p>

          <HeroForm />

          {/* social proof */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center">
              {avatars.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  width={32}
                  height={32}
                  loading="lazy"
                  className={`h-8 w-8 rounded-full border-2 border-background-primary object-cover ${
                    i > 0 ? "-ml-2" : ""
                  }`}
                />
              ))}
            </div>
            <p className="ml-3 text-sm font-medium text-secondary">
              Join 12,000+ creators and makers
            </p>
          </div>

          <ExampleModal />
        </div>

        {/* right column — desktop phone + mobile scroll strip */}
        <div>
          {/* phone mockup — hidden on mobile, shown md+ */}
          <div aria-hidden="true" className="hidden justify-end md:flex">
            <PhoneMockup id="example-mockup" />
          </div>

          {/* horizontal scroll cards — shown <md */}
          <div className="mt-8 flex gap-4 overflow-x-auto pb-4 md:hidden">
            {miniProfiles.map((p) => (
              <div
                key={p.name}
                aria-hidden="true"
                className="w-64 shrink-0 rounded-2xl border border-border-subtle bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-brand-green-hover text-sm font-semibold text-white">
                    {p.initial}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-primary">
                    {p.name}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <div className={`rounded-lg border border-border-subtle ${p.bg} px-3 py-2`}>
                    <div className="h-2 w-full rounded bg-secondary/10" />
                  </div>
                  <div className={`rounded-lg border border-border-subtle ${p.bg} px-3 py-2`}>
                    <div className="h-2 w-3/4 rounded bg-secondary/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
