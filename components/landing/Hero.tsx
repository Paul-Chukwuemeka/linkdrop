import { HeroForm } from "@/components/landing/HeroForm";
import { ExampleModal } from "@/components/landing/ExampleModal";
import PhoneMockup from "@/components/landing/PhoneMockup";
import SocialProof from "@/components/landing/SocialProof";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200, 150, 56, 0.05) 0%, transparent 100%)",
        }}
      />

      <div aria-hidden="true" className="bg-noise pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-10 md:grid-cols-[11fr_9fr] md:px-12 md:pb-24 md:pt-16 lg:items-start">
        <div className="flex flex-col items-center text-center lg:pt-16">
          <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-primary sm:text-5xl lg:text-[52px]">
            A link-in-bio that&apos;s unmistakably{" "}
            <span className="headline-underline">yours</span>.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-secondary">
            Showcase your projects, group links by topic, and share a profile
            that looks like you designed it — no code needed.
          </p>

          <HeroForm />

          <SocialProof />

          <ExampleModal />
        </div>

        <div className="w-full" aria-hidden="true">
          <PhoneMockup id="example-mockup" />
        </div>
      </div>
    </section>
  );
}
