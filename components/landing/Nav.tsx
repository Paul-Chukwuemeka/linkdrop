import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="mt-4 sm:mt-6 flex items-center justify-between rounded-full bg-white w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-[var(--shadow-nav)]">
      <Link
        href="/"
        className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--text-primary)]"
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
          <Button variant="primary" size="sm">
            Sign up free
          </Button>
        </Link>
        <Link href="/register" className="sm:hidden">
          <Button variant="primary" size="sm">
            Sign up
          </Button>
        </Link>
      </div>
    </nav>
  );
}
