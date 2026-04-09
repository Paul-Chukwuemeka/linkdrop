import Background from "@/components/background";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh overflow-hidden">
      <Background />
      <div className="relative flex-1 z-10 mx-auto flex justify-center w-full max-w-350 flex-col px-6 pb-16">
        <nav className="mt-6 flex items-center justify-between rounded-full bg-white w-full px-8 py-4 shadow-(--shadow-nav)">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-(--color-dark)"
          >
            LinkForge
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Sign up free
              </Button>
            </Link>
          </div>
        </nav>
        <section className="mt-20 items-start justify-start py-10 flex w-full flex-1">
          <div className="max-w-2xl">
            <h1
              className="text-5xl font-black italic leading-[1.05] tracking-tight text-(--color-dark-alt) sm:text-6xl"
   
            >
              One link for everything you build.
            </h1>

            <p className="mt-6 text-lg font-medium text-neutral-800/80">
              Create cards, group links into collections, and share a clean
              public profile in minutes.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:max-w-xs">
                <Input placeholder="yourname" aria-label="Username" />
              </div>
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Get started for free
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1">

          </div>
        </section>
      </div>
    </main>
  );
}
