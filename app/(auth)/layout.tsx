import Background from "@/components/background";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-dvh flex items-center justify-center overflow-hidden px-4 sm:px-6 py-8 sm:py-12">
      <Background/>
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </main>
  );
}

