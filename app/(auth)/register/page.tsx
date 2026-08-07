import { RegisterForm } from "@/components/auth/RegisterForm";
import { Spinner } from "@/components/ui/Spinner";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const meshBackground =
  "radial-gradient(ellipse 80% 50% at 80% 40%, rgba(200, 150, 56, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 60% at 20% 80%, rgba(42, 80, 42, 0.4) 0%, transparent 50%), #1B3A1B";
const glowBackground =
  "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(200, 150, 56, 0.08) 0%, transparent 60%)";

const featurePills = [
  { icon: Check, label: "Free forever" },
  { icon: Zap, label: "No code" },
];

export default function RegisterPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[55%_45%]">
      {/* Form panel */}
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10 sm:px-10">
        {/* mobile top bar */}
        <div className="mb-10 flex w-full max-w-md items-center justify-between lg:hidden">
          <Link href="/" className="text-xl font-medium tracking-tight text-primary">
            LinkDrop
          </Link>
        </div>

        <div className="w-full max-w-md sm:rounded-2xl sm:border sm:border-gray-200 sm:bg-background-elevated sm:p-8 sm:shadow-[0_20px_50px_-12px_rgba(27,58,27,0.18)]">
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

      {/* Brand panel — desktop only */}
      <aside
        className="relative hidden min-h-dvh flex-col items-center justify-between overflow-hidden px-10 py-16 lg:flex"
        style={{ background: meshBackground }}
      >
        <div aria-hidden="true" className="bg-noise pointer-events-none absolute inset-0" />
        {/* warm spotlight behind the text — drifts slowly like a wave */}
        <div
          aria-hidden="true"
          className="animate-glow-drift pointer-events-none absolute -inset-1/4"
          style={{ background: glowBackground }}
        />
        <Link
          href="/"
          className="relative z-10 self-start text-2xl font-medium tracking-tight text-white"
        >
          LinkDrop
        </Link>

        <div className="relative z-10 flex flex-col items-center pb-16 text-center">
          <h2 className="max-w-sm text-4xl font-medium leading-tight tracking-tight text-white">
            Make it unmistakably{" "}
            <span className="headline-underline">yours</span>.
          </h2>
          <p className="mt-4 max-w-sm text-center text-base leading-relaxed text-white/70">
            Your work deserves a better link-in-bio.
          </p>

          <div className="mt-8 flex items-center gap-3">
            {featurePills.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/50">© 2026 LinkDrop</p>
      </aside>
    </div>
  );
}
