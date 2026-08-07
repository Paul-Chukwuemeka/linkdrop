const templates = [
  {
    name: "Minimal",
    cardBg: "bg-white",
    avatarBg: "bg-neutral-200",
    linkBgs: ["bg-neutral-100 border border-neutral-200", "bg-neutral-100 border border-neutral-200", "bg-neutral-100 border border-neutral-200"],
    nameColor: "text-[#1A1A1A]",
    handleColor: "text-[#6B6B6B]",
  },
  {
    name: "Bold",
    cardBg: "bg-[#1A1A1A]",
    avatarBg: "bg-white/20",
    linkBgs: ["bg-white/15", "bg-white/10", "bg-white/15"],
    nameColor: "text-white",
    handleColor: "text-white/50",
  },
  {
    name: "Editorial",
    cardBg: "bg-[#f7efdd]",
    avatarBg: "bg-[#e8d5b8]",
    linkBgs: ["bg-white/60 border border-[#e8d5b8]", "bg-white/60 border border-[#e8d5b8]", "bg-white/60 border border-[#e8d5b8]"],
    nameColor: "text-[#3d2b1f]",
    handleColor: "text-[#6B6B6B]",
  },
];

export default function TemplatePreview() {
  return (
    <section className="px-6 py-16 md:px-12 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 className="mb-10 text-center text-2xl font-medium text-primary">
          A profile for every vibe
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
          {templates.map((t) => (
            <div key={t.name} className="w-72 shrink-0 snap-start md:w-auto">
              {/* thumbnail */}
              <div
                className={`aspect-[4/5] rounded-xl border border-[rgba(26,26,26,0.08)] p-4 ${t.cardBg}`}
                aria-hidden="true"
              >
                {/* avatar */}
                <div className="flex justify-center">
                  <div className={`h-10 w-10 rounded-full ${t.avatarBg}`} />
                </div>

                {/* name bars */}
                <div className="mt-3 flex flex-col items-center gap-1.5">
                  <div className={`h-2 w-20 rounded-full ${t.avatarBg}`} />
                  <div className={`h-1.5 w-14 rounded-full ${t.avatarBg} opacity-60`} />
                </div>

                {/* link cards */}
                <div className="mt-5 flex flex-col gap-2">
                  {t.linkBgs.map((bg, j) => (
                    <div key={j} className={`rounded-lg px-3 py-2.5 ${bg}`}>
                      <div className="h-1.5 w-full rounded-full bg-current opacity-[0.08]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* label */}
              <p className="mt-3 text-center text-sm font-medium text-primary">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
