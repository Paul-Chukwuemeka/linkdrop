import { HeroForm } from "@/components/landing/HeroForm";

export default function Hero() {
  return (
    <section className="mt-10 sm:mt-14 lg:mt-16 flex flex-col items-center text-center">
      <h1
        className="animate-rise text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight text-[var(--ink)]"
        style={{
          fontFamily: "var(--font-dm-serif)",
          animationDelay: "0s",
        }}
      >
        One link for
        <br />
        <span className="relative inline-block">
          everything
          <svg
            className="underline-draw absolute -bottom-1 left-0 w-full"
            viewBox="0 0 300 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              pathLength="1"
              d="M2 6 C25 1, 50 11, 75 5 S125 11, 150 5 S200 1, 225 7 S275 11, 298 5"
              stroke="var(--amber)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>{" "}
        you build.
      </h1>

      <p
        className="animate-rise mt-5 sm:mt-6 text-base sm:text-lg text-[var(--text-secondary)] max-w-md mx-auto"
        style={{ animationDelay: "0.08s" }}
      >
        Create cards, group links into collections, and share a clean public
        profile in minutes.
      </p>

      <div
        className="animate-rise mt-6 sm:mt-8"
        style={{ animationDelay: "0.16s" }}
      >
        <HeroForm />
      </div>
    </section>
  );
}
