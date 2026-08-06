import { HeroForm } from "@/components/landing/HeroForm";

export default function Hero() {
  return (
    <section className="mt-10 sm:mt-14 lg:mt-16 flex flex-col items-center text-center">
      <div
        className="animate-rise inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-[var(--border-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--ink)] mb-6"
        style={{ animationDelay: "0s" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--amber)] animate-pulse" />
        Free to start — no credit card required
      </div>

      <h1
        className="animate-rise text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight text-[var(--ink)]"
        style={{
          fontFamily: "var(--font-dm-serif)",
          animationDelay: "0.08s",
        }}
      >
        One link for
        <br />
        <span className="relative inline-block">
          everything
          <span
            className="underline-draw absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[var(--amber)]"
          />
        </span>{" "}
        you build.
      </h1>

      <p
        className="animate-rise mt-5 sm:mt-6 text-base sm:text-lg text-[var(--text-secondary)] max-w-md mx-auto"
        style={{ animationDelay: "0.16s" }}
      >
        Create cards, group links into collections, and share a clean public
        profile in minutes.
      </p>

      <div
        className="animate-rise mt-6 sm:mt-8"
        style={{ animationDelay: "0.24s" }}
      >
        <HeroForm />
      </div>

      <div
        className="animate-rise mt-8 flex items-center gap-1 text-sm text-[var(--text-secondary)]"
        style={{ animationDelay: "0.32s" }}
      >
        <div className="flex -space-x-3">
          {[
            "bg-[var(--forest-soft)]",
            "bg-amber-500",
            "bg-[var(--ink)]",
            "bg-stone-400",
          ].map((c, i) => (
            <div
              key={i}
              className={`h-7 w-7 rounded-full ${c} ring-2 ring-[var(--cream)] flex items-center justify-center text-[10px] font-bold text-white transition-transform duration-200 hover:translate-x-1 hover:z-10`}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <span className="ml-2">
          Trusted by <strong>1,200+</strong> creators
        </span>
        <span className="mx-1">&middot;</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4].map((j) => (
            <svg
              key={j}
              className="h-3.5 w-3.5 fill-[var(--amber)]"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="var(--amber)"
            strokeWidth="1.5"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <span className="ml-1">4.9</span>
      </div>
    </section>
  );
}
