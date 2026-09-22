type ThemePreview = {
  name: string;
  rotate: string;
  offset?: string;
  tape?: boolean;
  surface: string;
  avatar: string;
  bar: string;
  link: string;
  linkAlt: string;
};

const themes: ThemePreview[] = [
  {
    name: "neon forest",
    rotate: "-rotate-2",
    tape: true,
    surface: "bg-brand-green",
    avatar: "bg-[#b6f04a]",
    bar: "bg-[#b6f04a]",
    link: "rounded-full bg-[#b6f04a]",
    linkAlt: "rounded-full border border-[#b6f04a]",
  },
  {
    name: "gold rush",
    rotate: "rotate-1",
    offset: "mt-2",
    surface: "border border-[#e6ddc6] bg-[#f7efdd]",
    avatar: "bg-accent-gold",
    bar: "bg-accent-gold",
    link: "rounded-sm bg-accent-gold",
    linkAlt: "rounded-sm border border-[#d8cba8] bg-white",
  },
  {
    name: "ink & coral",
    rotate: "-rotate-1",
    tape: true,
    surface: "bg-[#0f1210]",
    avatar: "bg-accent-coral",
    bar: "bg-background-primary",
    link: "rounded-md bg-background-primary",
    linkAlt: "rounded-md border border-background-primary",
  },
  {
    name: "pale garden",
    rotate: "rotate-2",
    offset: "mt-2",
    surface: "border border-[#d5e2cf] bg-[#eef4ea]",
    avatar: "bg-brand-green",
    bar: "bg-brand-green",
    link: "rounded-full bg-brand-green",
    linkAlt: "rounded-full border border-[#cfe0c8] bg-white",
  },
];

export default function ThemeWall() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pt-10 md:px-9">
      <h2 className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#8a8a76]">
        {"// pick a look. any look."}
      </h2>
      <div className="mt-3 flex flex-wrap items-start gap-3.5">
        {themes.map((theme) => (
          <div
            key={theme.name}
            className={`relative w-[150px] rounded bg-white p-[11px] shadow-[0_10px_24px_rgba(27,58,27,0.14)] ${theme.rotate} ${theme.offset ?? ""}`}
          >
            {theme.tape ? (
              <span
                aria-hidden="true"
                className="tape absolute -top-2 left-4 h-4 w-14 -rotate-3"
              />
            ) : null}
            <div className={`rounded-xl p-2.5 ${theme.surface}`}>
              <div className={`mx-auto h-[26px] w-[26px] rounded-full ${theme.avatar}`} />
              <div className={`mx-auto mt-2 h-1.5 w-3/5 rounded-full ${theme.bar}`} />
              <div className={`mt-2 h-3.5 ${theme.link}`} />
              <div className={`mt-1.5 h-3.5 ${theme.linkAlt}`} />
            </div>
            <div className="font-hand mt-2 text-center text-[10px] text-[#5a5a48]">
              {theme.name}
            </div>
          </div>
        ))}
        <p className="font-hand max-w-[180px] self-center text-xs text-[#5a5a48]">
          ← or build your own from the editor. 18 fonts, any hex color, buttons,
          backgrounds.
        </p>
      </div>
    </section>
  );
}
