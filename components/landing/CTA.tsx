import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Reveal } from "@/components/landing/Reveal";

export default function CTA() {
  return (
    <section className="py-16 sm:py-20 px-4">
      <Reveal className="max-w-3xl mx-auto">
        <div className="bg-noise relative bg-[var(--ink)] rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
          <div className="relative z-10">
            <h2
              className="text-3xl sm:text-4xl font-normal tracking-tight text-white"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Ready to build your link page?
            </h2>
            <p className="mt-3 text-white/60 max-w-md mx-auto">
              Free to start. No credit card. Takes 60 seconds.
            </p>

            <Link href="/register" className="mt-6 inline-block">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-[var(--ink)] hover:bg-white/90 hover:shadow-lg hover:-translate-y-px active:scale-95"
              >
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
