import Background from "@/components/background";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { HeroForm } from "@/components/landing/HeroForm";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh overflow-hidden">
      <Background />
      <div className="relative flex-1 z-10 mx-auto flex justify-center w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8 pb-16">
        <nav className="mt-4 sm:mt-6 flex items-center justify-between rounded-full bg-white w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-(--shadow-nav)">
          <Link
            href="/"
            className="text-lg sm:text-xl font-extrabold tracking-tight text-(--color-dark)"
          >
            LinkForge
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
        <section className="mt-12 sm:mt-16 lg:mt-20 items-start justify-start py-6 sm:py-10 flex w-full flex-1">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black italic leading-tight tracking-tight text-(--color-dark-alt)">
              One link for everything you build.
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg font-medium text-neutral-800/80">
              Create cards, group links into collections, and share a clean
              public profile in minutes.
            </p>

            <HeroForm />
          </div>
          <div className="hidden lg:block flex-1">

          </div>
        </section>
      </div>
    </main>
  );
}
