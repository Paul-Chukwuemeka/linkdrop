import ClaimForm from "@/components/landing/ClaimForm";

export default function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pb-10 pt-9 md:px-9">
      <div className="relative flex flex-wrap items-center gap-5 rounded-xl bg-brand-green p-7 text-background-primary">
        <span
          aria-hidden="true"
          className="tape absolute -top-3 left-4 h-5 w-16 -rotate-3"
        />
        <h2 className="font-[family-name:var(--font-syne)] text-2xl font-extrabold tracking-tight sm:text-[26px]">
          your name is
          <br />
          still available.
        </h2>
        <ClaimForm variant="final" />
        <p className="font-hand -rotate-2 text-xs text-background-primary/75">
          probably. check fast.
        </p>
      </div>
    </section>
  );
}
