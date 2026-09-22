import {
  ChevronRight,
  Globe,
  Mail,
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
];

export default function PhoneMockup({ id }: { id?: string }) {
  return (
    <div
      id={id}
      className="phone-wrapper relative mx-auto w-[420px] max-w-full sm:w-[450px]"
    >
      <div className="animate-float">
        <div
          className="relative rounded-[3rem] border border-border-subtle bg-background-elevated p-3"
          style={{
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.03), 0 12px 40px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.05)",
          }}
        >
          <div className="absolute left-1/2 top-6 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-primary" />

          <div className="relative h-[696px] overflow-hidden rounded-[2.6rem] bg-background-primary px-5 pb-8 pt-16">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-brand-green to-brand-green-hover text-xl font-semibold text-white shadow-md">
                J
              </div>
              <div className="mt-3 text-base font-semibold text-primary">
                @jules
              </div>
              <p className="mt-1 max-w-50 text-center text-xs text-secondary">
                Designer &amp; creator building on the web.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">
                    {group.title}
                  </p>
                  <div className="flex flex-col gap-2">
                    {group.links.map((link) => {
                      const Icon = link.Icon;
                      return (
                        <div
                          key={link.label}
                          className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-sm font-medium shadow-sm ${link.className}`}
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <Icon
                              className={`h-4 w-4 shrink-0 ${link.iconClassName}`}
                              strokeWidth={2}
                            />
                            <span className="truncate">{link.label}</span>
                          </span>
                          <ChevronRight
                            className="h-4 w-4 shrink-0 opacity-40"
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
