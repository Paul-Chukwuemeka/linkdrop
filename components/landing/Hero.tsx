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
      className={`relative rounded bg-white p-[13px] shadow-[0_12px_30px_rgba(27,58,27,0.16)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="tape absolute -top-2 left-1/2 h-[18px] w-16 -translate-x-1/2 -rotate-3"
      />
      {badge ? (
        <span className="absolute -right-2 -top-2 z-10 rotate-[8deg] rounded-full bg-accent-coral-dark px-2.5 py-1.5 text-[10px] font-extrabold text-white">
          {badge}
        </span>
      ) : null}
      <div className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#8a6420]">
        {`// ${label}`}
      </div>
      <strong className="block text-[13px] text-brand-green">{handle}</strong>
      <div className="mt-2 flex flex-col gap-1.5">
        {links.map((link) => (
          <div
            key={link.label}
            className={`px-2.5 py-1.5 text-[10px] font-bold ${link.className}`}
          >
            {link.label}
          </div>
        ))}
      </div>
      <div className="font-hand mt-2 text-[10px] text-[#5a5a48]">{caption}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-6 pt-10 md:px-9 lg:grid-cols-[56fr_44fr] lg:gap-6 lg:pt-14">
        <div>
          <span className="inline-block -rotate-2 rounded-[3px] bg-accent-gold px-2.5 py-1.5 text-[11px] font-extrabold tracking-[0.08em] text-brand-green">
            100% FREE. ACTUALLY.
          </span>
          <h1 className="mt-3.5 font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-[0.99] tracking-tight text-brand-green sm:text-5xl lg:text-6xl">
            stop looking like{" "}
            <span className="relative inline-block">
              everyone else&apos;s
              <svg
                aria-hidden="true"
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute -bottom-0.5 left-0 h-3.5 w-full"
              >
                <path
                  d="M2 9 C 60 3, 130 12, 198 5"
                  fill="none"
                  stroke="#e2603f"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
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
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:block lg:h-[360px]">
          <TapedCard
            label="theme 01"
            handle="@theo.codes"
            caption="syne + forest"
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
            className="lg:absolute lg:left-8 lg:top-24 lg:-rotate-3"
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
        <span className="text-accent-coral">{"//"}</span>
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
