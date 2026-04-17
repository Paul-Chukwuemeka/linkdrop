export default function GlobalLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black"></div>
        <p className="font-semibold text-neutral-500 tracking-wide text-sm">Loading LinkForge...</p>
      </div>
    </div>
  );
}
