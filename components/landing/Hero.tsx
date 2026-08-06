import { HeroForm } from "@/components/landing/HeroForm";

export default function Hero() {
  return (
    <section className="mt-10 sm:mt-14 lg:mt-16 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold text-[var(--accent)] mb-6">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
        Free to start — no credit card required
      </div>

      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-black italic leading-[1.1] tracking-tight text-[var(--text-primary)]"
        style={{ fontFamily: "var(--font-righteous), var(--font-display)" }}
      >
        One link for
        <br />
        <span className="relative inline-block">
          everything
          <svg
            className="absolute -bottom-1 left-0 w-full"
            viewBox="0 0 300 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 8 C50 2, 100 12, 150 6 S250 2, 298 8"
              stroke="#ff5a5f"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>{" "}
        you build.
      </h1>

      <p className="mt-5 sm:mt-6 text-base sm:text-lg text-[var(--text-secondary)] max-w-md mx-auto">
        Create cards, group links into collections, and share a clean public
        profile in minutes.
      </p>

      <div className="mt-6 sm:mt-8">
        <HeroForm />
      </div>

      <div className="mt-8 flex items-center gap-1 text-sm text-[var(--text-secondary)]">
        <div className="flex -space-x-2">
          {["bg-blue-400", "bg-teal-400", "bg-amber-400", "bg-rose-400"].map(
            (c, i) => (
              <div
                key={i}
                className={`h-7 w-7 rounded-full ${c} ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ),
          )}
        </div>
        <span className="ml-2">
          Trusted by <strong>1,200+</strong> creators
        </span>
        <span className="mx-1">·</span>
        <div className="flex gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-1">4.9</span>
      </div>
    </section>
  );
}
