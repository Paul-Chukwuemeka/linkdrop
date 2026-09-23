import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b-2 border-brand-green bg-background-paper">
      <div className="mx-auto flex max-w-300 items-center justify-between px-6 py-3.5 md:px-9">
        <Link
          href="/"
          className="font-(family-name:--font-space-grotesk) text-lg font-extrabold tracking-tight text-brand-green"
        >
          Dropcard
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden font-(family-name:--font-jetbrains) text-xs text-[#5a5a48] hover:text-brand-green sm:block"
          >
            log in
          </Link>
          <Link
            href="/register"
            className="rounded bg-brand-green px-4 py-2 font-(family-name:--font-space-grotesk) text-sm font-extrabold text-background-primary sticker-shadow-gold transition-transform hover:-translate-y-0.5"
          >
            claim your name
          </Link>
        </div>
      </div>
    </nav>
  );
}
