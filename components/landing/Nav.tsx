import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="mt-4 sm:mt-6 flex items-center justify-between rounded-full bg-white/70 backdrop-blur-sm ring-1 ring-[var(--border-soft)] w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-[var(--shadow-nav)]">
      <Link
        href="/"
        className="text-lg sm:text-xl tracking-tight text-[var(--ink)]"
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        LinkDrop
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/register" className="hidden sm:block">
          <Button
            variant="primary"
            size="sm"
            className="bg-[var(--forest)] text-white hover:bg-[var(--forest)]/90 hover:shadow-md hover:-translate-y-px active:scale-95"
          >
            Sign up free
          </Button>
        </Link>
        <Link href="/register" className="sm:hidden">
          <Button
            variant="primary"
            size="sm"
            className="bg-[var(--forest)] text-white hover:bg-[var(--forest)]/90 active:scale-95"
          >
            Sign up
          </Button>
        </Link>
      </div>
    </nav>
  );
}
