export default function Blob({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="relative h-[68px] w-[78px] -rotate-[8deg] rounded-[52%_48%_46%_54%] bg-brand-green/90">
        <span className="absolute left-[20px] top-[26px] h-3 w-2 rounded-full bg-background-primary" />
        <span className="absolute right-[20px] top-[26px] h-3 w-2 rounded-full bg-background-primary" />
        <span className="absolute -top-[10px] left-1/2 h-3 w-0.5 -translate-x-1/2 bg-brand-green" />
      </div>
    </div>
  );
}
