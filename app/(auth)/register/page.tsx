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
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="mb-10 flex w-full max-w-md items-center justify-between lg:hidden">
          <Link
            href="/"
            className="font-[family-name:var(--font-space-grotesk)] text-xl font-extrabold tracking-tight text-brand-green"
          >
            Dropcard
          </Link>
        </div>

        <div className="w-full max-w-md rounded-lg border-2 border-dashed border-[#b9b19b] bg-background-elevated p-6 shadow-[0_20px_50px_-12px_rgba(27,58,27,0.18)] sm:p-8">
          <p className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#5a5a48]">
            {"// sign up"}
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-space-grotesk)] text-3xl font-extrabold tracking-tight text-brand-green">
            claim your name
          </h1>
          <p className="mt-1 text-sm text-secondary">
            claim your username and start building your public page.
          </p>

          <div className="mt-8">
            <Suspense fallback={<Spinner className="h-6 w-6 text-black" />}>
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>

      <aside
        className="relative hidden min-h-dvh flex-col items-center justify-between overflow-hidden px-10 py-16 lg:flex"
        style={{ background: meshBackground }}
      >
        <div aria-hidden="true" className="bg-noise pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="animate-glow-drift pointer-events-none absolute -inset-1/4"
          style={{ background: glowBackground }}
        />
        <Link
          href="/"
          className="relative z-10 self-start font-[family-name:var(--font-space-grotesk)] text-2xl font-extrabold tracking-tight text-white"
        >
          Dropcard
        </Link>

        <div className="relative z-10 flex flex-col items-center pb-16 text-center">
          <h2 className="max-w-sm font-[family-name:var(--font-space-grotesk)] text-5xl font-extrabold leading-[1.02] tracking-tight text-white">
            make it unmistakably <span className="marker-phrase">yours.</span>
          </h2>
          <p className="mt-4 font-[family-name:var(--font-jetbrains)] text-xs text-white/70">
            {"// free forever · no card"}
          </p>

          <div className="mt-8 flex items-center gap-3">
            {featurePills.map(({ icon: Icon, label }, i) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm ${i % 2 === 0 ? "-rotate-2" : "rotate-1"}`}
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/50">© 2026 Dropcard</p>
      </aside>
    </div>
  );
}
