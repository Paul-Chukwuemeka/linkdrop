/* eslint-disable @next/next/no-img-element -- placeholder avatars from pravatar.cc */

import { HeroForm } from "@/components/landing/HeroForm";
import { ExampleModal } from "@/components/landing/ExampleModal";
import PhoneMockup from "@/components/landing/PhoneMockup";

const avatars = Array.from(
  { length: 5 },
  (_, i) => `https://i.pravatar.cc/48?img=${i + 1}`,
);

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* radial gold glow behind the hero text only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200, 150, 56, 0.06) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-16 md:px-12 lg:grid-cols-[11fr_9fr] lg:pb-24 lg:pt-[120px]">
        {/* left column */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-primary sm:text-5xl lg:text-[48px]">
            Your work deserves a better link-in-bio.
            <br />
            Make it unmistakably{" "}
            {/* custom gold underline, not an image */}
            <span className="rounded-[2px] border-b-[3px] border-accent-gold pb-[2px]">
              yours
            </span>
            .
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

        {/* right column — mockup is decorative in the hero */}
        <div aria-hidden="true" className="flex justify-center lg:justify-end">
          <PhoneMockup id="example-mockup" />
        </div>
      </div>
    </section>
  );
}
