import Blob from "@/components/landing/Blob";
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
      className={`relative rounded bg-white p-[13px] shadow-[0_12px_30px_rgba(27,58,27,0.16)] transition-transform hover:-translate-y-0.5 lg:p-[18px] ${className}`}
    >
      <span
        aria-hidden="true"
        className="tape absolute -top-2 left-1/2 h-[18px] w-16 -translate-x-1/2 -rotate-3 lg:h-[22px] lg:w-20"
      />
      {badge ? (
        <span className="absolute -right-2 -top-2 z-10 rotate-[8deg] rounded-full bg-accent-coral-dark px-2.5 py-1.5 text-[10px] font-extrabold text-white lg:px-3 lg:py-2 lg:text-[11px]">
          {badge}
        </span>
      ) : null}
      <div className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#8a6420] lg:text-xs">
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
    <section className="paper-grain relative overflow-hidden bg-background-paper">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-6 pt-10 md:px-9 lg:grid-cols-[56fr_44fr] lg:gap-6 lg:pt-14">
        <div>
          <span className="inline-block -rotate-2 rounded-[3px] bg-accent-gold px-2.5 py-1.5 text-[11px] font-extrabold tracking-[0.08em] text-brand-green">
            100% FREE. ACTUALLY.
          </span>
          <h1 className="mt-3.5 font-[family-name:var(--font-space-grotesk)] text-4xl font-extrabold leading-[0.99] tracking-[-0.03em] text-brand-green sm:text-[41px]">
            stop looking like{" "}
            <span className="marker-phrase whitespace-nowrap">everyone else&apos;s</span>
            <br />
            link-in-bio.
          </h1>
          <p className="mt-3 max-w-[430px] text-[15px] text-[#5a5a48]">
            your colors, your fonts, your links. group them how you want. one
            minute, tops.
          </p>
          <div className="mt-4">
            <ClaimForm variant="hero" />
          </div>
          <p className="mt-2.5 font-[family-name:var(--font-jetbrains)] text-[11px] text-[#5a5a48]">
            free forever · no card · nothing to cancel
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:block lg:h-[430px]">
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
            badge="new"
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
          <Blob className="hidden lg:absolute lg:bottom-2 lg:right-0 lg:block" />
          <p className="font-hand text-[11px] text-[#5a5a48] lg:absolute lg:bottom-4 lg:left-24">
            blob keeps an eye on it
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1200px] flex-wrap gap-x-6 gap-y-1 border-t-2 border-dashed border-[#c9c2ad] px-6 pt-3 font-[family-name:var(--font-jetbrains)] text-[11px] text-[#5a5a48] md:px-9">
        <span aria-hidden="true" className="text-accent-coral">
          {"//"}
        </span>
        <span>18 fonts</span>
        <span>any color</span>
        <span>collections</span>
        <span>multiple cards</span>
        <span>backgrounds</span>
        <span>free forever</span>
      </div>
    </section>
  );
}
