import ClaimForm from "@/components/landing/ClaimForm";

type CardLink = { label: string; className: string };

function TapedCard({
  label,
  handle,
  caption,
  links,
  className = "",
  badge,
}: {
  label: string;
  handle: string;
  caption: string;
  links: CardLink[];
  className?: string;
  badge?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative hover:z-100 rounded bg-white lg:w-60 p-3.25 shadow-[0_12px_30px_rgba(27,58,27,0.16)] transition-transform hover:-translate-y-0.5 lg:p-4.5 ${className}`}
    >
      <span
        aria-hidden="true"
        className="tape absolute -top-2 left-1/2 h-4.5 w-16 -translate-x-1/2 -rotate-3 lg:h-5.5 lg:w-20"
      />
      {badge ? (
        <span className="absolute -right-2 -top-2 z-10 rotate-[8deg] rounded-full bg-accent-coral-dark px-2.5 py-1.5 text-[10px] font-extrabold text-white lg:px-3 lg:py-2 lg:text-2.75">
          {badge}
        </span>
      ) : null}
      <div className="font-(family-name:--font-jetbrains) text-[10px] text-[#8a6420] lg:text-xs">
        {`// ${label}`}
      </div>
      <strong className="block text-[13px] text-brand-green lg:text-[17px]">{handle}</strong>
      <div className="mt-2 flex flex-col gap-1.5 lg:mt-2.5 lg:gap-2">
        {links.map((link) => (
          <div
            key={link.label}
            className={`px-2.5 py-1.5 text-[10px] font-bold lg:px-3.5 lg:py-2 lg:text-xs ${link.className}`}
          >
            {link.label}
          </div>
        ))}
      </div>
      <div className="font-hand mt-2 text-[10px] text-[#5a5a48] lg:mt-2.5 lg:text-xs">{caption}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="paper-grain relative overflow-hidden pb-10 border-b-2 border-[#c9c2ad] lg:min-h-200 flex items-center justify-center border-dashed bg-background-paper">
      <div className="mx-auto grid w-full max-w-300 grid-cols-1 gap-10 px-6 pt-10 md:px-9 lg:grid-cols-[56fr_44fr] lg:gap-6 lg:pt-14">
        <div>
          <span className="inline-block -rotate-2 rounded-[3px] bg-accent-gold px-2.5 py-1.5 text-2.75 font-extrabold tracking-[0.08em] text-brand-green">
            100% FREE. ACTUALLY.
          </span>
          <h1 className="mt-3.5 font-(family-name:--font-space-grotesk) text-4xl font-extrabold leading-[0.99] tracking-[-0.03em] text-brand-green sm:text-[41px]">
            Stop looking like{" "}
            <span className="marker-phrase whitespace-nowrap">everyone else&apos;s</span>
            <br />
            link-in-bio.
          </h1>
          <p className="mt-3 max-w-107.5 text-[15px] text-[#5a5a48]">
            your colors, your fonts, your links. group them how you want. one
            minute, tops.
          </p>
          <div className="mt-4">
            <ClaimForm variant="hero" />
          </div>
          <p className="mt-2.5 font-(family-name:--font-jetbrains) text-2.75 text-[#5a5a48]">
            free forever · no card · nothing to cancel
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:block lg:h-107.5">
          <TapedCard
            label="theme 01"
            handle="@theo.codes"
            caption="space grotesk + forest"
            className="lg:absolute lg:right-6 lg:top-0 lg:rotate-3"
            links={[
              {
                label: "github",
                className: "rounded-full bg-brand-green text-background-primary",
              },
              {
                label: "blog",
                className: "rounded-full bg-[#f7efdd] text-brand-green",
              },
            ]}
          />
          <TapedCard
            label="theme 02"
            handle="@lume.studio"
            caption="dm serif + gold"
            className="lg:absolute lg:left-6 lg:top-32 lg:-rotate-3"
            links={[
              {
                label: "book a session",
                className: "rounded-sm bg-accent-gold text-brand-green",
              },
              {
                label: "portfolio",
                className: "rounded-sm bg-[#eef4ea] text-brand-green",
              },
            ]}
          />

        </div>
      </div>

    </section>
  );
}
