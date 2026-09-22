const stickers = [
  {
    label: "18 fonts",
    className:
      "-rotate-2 rounded-full bg-brand-green text-background-primary sticker-shadow-gold",
  },
  {
    label: "any hex color",
    className:
      "rotate-1 rounded border-2 border-brand-green bg-white text-brand-green sticker-shadow",
  },
  {
    label: "collections",
    className:
      "-rotate-1 rounded-full bg-accent-gold text-brand-green sticker-shadow",
  },
  {
    label: "multiple cards",
    className:
      "rotate-2 rounded-full border-2 border-brand-green bg-white text-brand-green sticker-shadow",
  },
  {
    label: "background images",
    className:
      "-rotate-1 rounded border-2 border-brand-green bg-[#eef4ea] text-brand-green sticker-shadow",
  },
  {
    label: "button shapes",
    className:
      "rotate-1 rounded-full bg-accent-coral-dark text-white sticker-shadow-gold",
  },
  {
    label: "live editor",
    className:
      "-rotate-1 rounded border-2 border-brand-green bg-white text-brand-green sticker-shadow",
  },
];

export default function FeatureStickers() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pt-10 md:px-9">
      <h2 className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#8a8a76]">
        {"// what you get"}
      </h2>
      <div className="mt-3 flex max-w-[760px] flex-wrap gap-3">
        {stickers.map((sticker) => (
          <span
            key={sticker.label}
            className={`px-3.5 py-2 text-[13px] font-extrabold transition-transform hover:-translate-y-0.5 ${sticker.className}`}
          >
            {sticker.label}
          </span>
        ))}
      </div>
    </section>
  );
}
