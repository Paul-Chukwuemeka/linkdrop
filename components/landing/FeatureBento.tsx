import { BarChart3, Layers, Palette, QrCode } from "lucide-react";

const cardClass =
  "flex flex-col rounded-2xl border border-border-subtle bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] md:p-8";

const iconWrapClass =
  "mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10";

const week = [
  { day: "M", value: 42 },
  { day: "T", value: 58 },
  { day: "W", value: 36 },
  { day: "T", value: 74 },
  { day: "F", value: 52 },
  { day: "S", value: 88 },
  { day: "S", value: 64 },
];

const topLinks = [
  { label: "Portfolio", clicks: 128, width: 100 },
  { label: "Newsletter", clicks: 87, width: 68 },
  { label: "Merch store", clicks: 54, width: 42 },
];

const collections = [
  { title: "Work", links: ["Case studies", "Dribbble", "Behance"] },
  { title: "Elsewhere", links: ["YouTube", "Newsletter", "Shop"] },
];

const themes = [
  { name: "Forest", bg: "#1b3a1b", fg: "#f5f2e9" },
  { name: "Editorial", bg: "#f7efdd", fg: "#3d2b1f" },
  { name: "Noir", bg: "#1a1a1a", fg: "#f5f2e9" },
];

const qrPattern = [
  "11101110111",
  "10101010101",
  "11101000111",
  "00010111000",
  "11011001010",
  "01001110101",
  "11101000011",
  "00110111010",
  "11100101011",
  "10101100101",
  "11101011111",
];

function QrGlyph() {
  return (
    <svg
      viewBox="0 0 11 11"
      className="h-14 w-14 shrink-0 text-primary"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {qrPattern.map((row, y) =>
        [...row].map((cell, x) =>
          cell === "1" ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="currentColor"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export default function FeatureBento() {
  return (
    <section id="features" className="scroll-mt-24 px-6 py-16 md:px-12 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-brand-green">
          Features
        </p>

        <h2 className="text-center text-3xl font-medium leading-[1.2] tracking-tight text-primary lg:text-[32px]">
          Everything your page needs
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-secondary">
          Built to look intentional, load fast, and turn profile visits into
          clicks.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <article
            className={`${cardClass} sm:col-span-2 lg:col-span-2 lg:row-span-2`}
          >
            <div className={iconWrapClass}>
              <BarChart3
                className="h-5 w-5 text-brand-green"
                strokeWidth={2}
              />
            </div>

            <h3 className="text-lg font-semibold text-primary">
              Click analytics
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              See which links earn attention and where your audience taps next.
            </p>

            <div className="mt-6 rounded-xl border border-border-subtle bg-background-primary/50 p-4 md:p-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-semibold text-primary">412</p>
                  <p className="text-xs text-secondary">clicks this week</p>
                </div>
                <span className="rounded-full bg-brand-green/10 px-2.5 py-1 text-xs font-medium text-brand-green">
                  +18%
                </span>
              </div>

              <div className="mt-5 flex h-24 items-end gap-2">
                {week.map((bar, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t-md ${
                      bar.value === 88 ? "bg-brand-green" : "bg-brand-green/20"
                    }`}
                    style={{ height: `${bar.value}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wider text-secondary">
                {week.map((bar, i) => (
                  <span key={i} className="w-full text-center">
                    {bar.day}
                  </span>
                ))}
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {topLinks.map((link) => (
                <li key={link.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-primary">
                      {link.label}
                    </span>
                    <span className="text-secondary">{link.clicks}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border-subtle">
                    <div
                      className="h-full rounded-full bg-brand-green/70"
                      style={{ width: `${link.width}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className={`${cardClass} sm:col-span-2`}>
            <div className={iconWrapClass}>
              <Layers className="h-5 w-5 text-brand-green" strokeWidth={2} />
            </div>

            <h3 className="text-lg font-semibold text-primary">Collections</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Group links by topic so your page stays easy to scan.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {collections.map((collection) => (
                <div
                  key={collection.title}
                  className="rounded-xl border border-border-subtle bg-background-primary/50 p-4"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">
                    {collection.title}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {collection.links.map((link) => (
                      <span
                        key={link}
                        className="rounded-md border border-border-subtle bg-white px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {link}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className={cardClass}>
            <div className={iconWrapClass}>
              <Palette className="h-5 w-5 text-brand-green" strokeWidth={2} />
            </div>

            <h3 className="text-lg font-semibold text-primary">
              Custom themes
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Match your page to your brand with colors, fonts, and layouts.
            </p>

            <div className="mt-6 space-y-2">
              {themes.map((theme) => (
                <div
                  key={theme.name}
                  className="flex items-center gap-3 rounded-lg border border-border-subtle p-2.5"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold"
                    style={{ backgroundColor: theme.bg, color: theme.fg }}
                    aria-hidden="true"
                  >
                    Aa
                  </span>
                  <span className="h-1.5 flex-1 rounded-full bg-border-subtle" />
                  <span className="text-[10px] font-medium text-secondary">
                    {theme.name}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className={cardClass}>
            <div className={iconWrapClass}>
              <QrCode className="h-5 w-5 text-brand-green" strokeWidth={2} />
            </div>

            <h3 className="text-lg font-semibold text-primary">QR codes</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Print it, post it, share it anywhere your audience finds you.
            </p>

            <div className="mt-6 flex items-center gap-4 rounded-xl border border-border-subtle bg-background-primary/50 p-4">
              <QrGlyph />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-primary">
                  linkdrop.co/jules
                </p>
                <p className="mt-1 text-[11px] text-secondary">
                  Scan to open the page
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
