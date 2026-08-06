import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 sm:py-10 px-4 border-t border-[var(--border-soft)]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="text-base tracking-tight text-[var(--ink)]"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          LinkDrop
        </Link>

        <div className="flex items-center gap-5 text-sm text-[var(--text-secondary)]">
          <Link
            href="/login"
            className="hover:text-[var(--forest)] transition-colors duration-200"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="hover:text-[var(--forest)] transition-colors duration-200"
          >
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
