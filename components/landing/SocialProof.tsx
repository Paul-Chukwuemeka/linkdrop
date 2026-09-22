const creators = [
  { initial: "J", className: "bg-[#eef4ea] text-brand-green" },
  { initial: "K", className: "bg-[#f7efdd] text-[#8a6420]" },
  { initial: "S", className: "bg-white text-primary" },
  { initial: "M", className: "bg-[#dce8dc] text-brand-green" },
  { initial: "A", className: "bg-[#e8d5b8] text-[#5c3d1e]" },
];

export default function SocialProof() {
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <div className="flex -space-x-2" aria-hidden="true">
        {creators.map((creator) => (
          <span
            key={creator.initial}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-background-primary ${creator.className}`}
          >
            {creator.initial}
          </span>
        ))}
      </div>
      <p className="text-xs font-medium text-secondary">
        Trusted by creators and makers
      </p>
    </div>
  );
}
