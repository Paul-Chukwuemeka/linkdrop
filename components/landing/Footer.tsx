import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 sm:py-10 px-4 border-t border-[var(--border-color)]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="text-base font-extrabold tracking-tight text-[var(--text-primary)]"
        >
          LinkDrop
        </Link>

        <div className="flex items-center gap-5 text-sm text-[var(--text-secondary)]">
          <Link href="/login" className="hover:text-[var(--text-primary)] transition-colors">
            Log in
          </Link>
          <Link href="/register" className="hover:text-[var(--text-primary)] transition-colors">
            Sign up
          </Link>
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          &copy; {new Date().getFullYear()} LinkDrop
        </p>
      </div>
    </footer>
  );
}
