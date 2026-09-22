import {
  ChevronRight,
  Globe,
  Mail,
  PenLine,
  Podcast,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type ProfileLink = {
  label: string;
  Icon: LucideIcon;
  className: string;
  iconClassName: string;
};

const groups: { title: string; links: ProfileLink[] }[] = [
  {
    title: "Work",
    links: [
      {
        label: "Portfolio",
        Icon: Globe,
        className: "border-transparent bg-[#1a1a1a] text-white",
        iconClassName: "text-white/80",
      },
      {
        label: "Latest project — LinkDrop",
        Icon: Sparkles,
        className: "border-[rgba(26,26,26,0.06)] bg-white text-primary",
        iconClassName: "text-accent-gold",
      },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "Newsletter",
        Icon: Mail,
        className: "border-[rgba(26,26,26,0.06)] bg-[#eef4ea] text-primary",
        iconClassName: "text-brand-green",
      },
      {
        label: "Merch store",
        Icon: ShoppingBag,
        className: "border-[rgba(26,26,26,0.06)] bg-[#f7efdd] text-primary",
        iconClassName: "text-[#8a6420]",
      },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      {
        label: "Podcast",
        Icon: Podcast,
        className: "border-[rgba(26,26,26,0.06)] bg-white text-primary",
        iconClassName: "text-brand-green",
      },
      {
        label: "Blog",
        Icon: PenLine,
        className: "border-[rgba(26,26,26,0.06)] bg-[#f1ece0] text-primary",
        iconClassName: "text-[#8a6420]",
      },
    ],
  },
];

export default function PhoneMockup({ id }: { id?: string }) {
  return (
    <div
      id={id}
      className="phone-wrapper relative mx-auto w-[22.75rem] max-w-full sm:w-[24.375rem]"
    >
      <div className="animate-float">
        <div
          className="relative rounded-[3.75rem] border border-border-subtle bg-background-elevated p-4"
          style={{
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.03), 0 12px 40px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.05)",
          }}
        >
          <div className="absolute left-1/2 top-7 z-20 h-7 w-30 -translate-x-1/2 rounded-full bg-primary" />

          <div className="relative h-[54.375rem] overflow-hidden rounded-[3.25rem] bg-background-primary px-6 pb-10 pt-24">
            <div className="flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-brand-green to-brand-green-hover text-2xl font-semibold text-white shadow-md">
                J
              </div>
              <div className="mt-4 text-lg font-semibold text-primary">
                @jules
              </div>
              <p className="mt-1.5 max-w-60 text-center text-sm text-secondary">
                Designer &amp; creator building on the web.
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-7">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                    {group.title}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {group.links.map((link) => {
                      const Icon = link.Icon;
                      return (
                        <div
                          key={link.label}
                          className={`flex items-center justify-between gap-3.5 rounded-2xl border px-4 py-4 text-base font-medium shadow-sm ${link.className}`}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <Icon
                              className={`h-5 w-5 shrink-0 ${link.iconClassName}`}
                              strokeWidth={2}
                            />
                            <span className="truncate">{link.label}</span>
                          </span>
                          <ChevronRight
                            className="h-5 w-5 shrink-0 opacity-40"
                            strokeWidth={2}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
