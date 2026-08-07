import { RegisterForm } from "@/components/auth/RegisterForm";
import { Spinner } from "@/components/ui/Spinner";
import PhoneMockup from "@/components/landing/PhoneMockup";
import Link from "next/link";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[45%_55%]">
      {/* Brand panel — desktop only */}
      <aside className="hidden flex-col items-center justify-center gap-12 bg-brand-green px-10 py-16 lg:flex">
        <Link href="/" className="text-2xl font-medium tracking-tight text-white">
          LinkDrop
        </Link>
        <PhoneMockup variant="dark" />
        <p className="max-w-xs text-center text-lg text-white/80">
          Your work deserves a better link-in-bio.
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10 sm:px-10">
        {/* mobile top bar */}
        <div className="mb-10 flex w-full max-w-md items-center justify-between lg:hidden">
          <Link href="/" className="text-xl font-medium tracking-tight text-primary">
            LinkDrop
          </Link>
          <Link
            href="/login"
            className="rounded-md text-sm font-medium text-primary transition-colors hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2"
          >
            Log in
          </Link>
        </div>

        <div className="w-full max-w-md sm:rounded-2xl sm:border sm:border-border-subtle sm:bg-background-elevated sm:p-8 sm:shadow-xl sm:shadow-black/5">
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Create your LinkDrop
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Claim your username and start building your public page.
          </p>

          <div className="mt-8">
            <Suspense fallback={<Spinner className="h-6 w-6 text-black" />}>
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
