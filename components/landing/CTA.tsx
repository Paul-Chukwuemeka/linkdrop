import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-3xl mx-auto bg-[var(--text-primary)] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight text-white">
            Ready to build your link page?
          </h2>
          <p className="mt-3 text-white/70 max-w-md mx-auto">
            Free to start. No credit card. Takes 60 seconds.
          </p>

          <Link href="/register" className="mt-6 inline-block">
            <Button variant="primary" size="lg" className="bg-white text-[var(--text-primary)] hover:bg-white/90">
              Get started free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
