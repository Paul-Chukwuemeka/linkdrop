export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-background-primary px-4 py-8 sm:px-6 sm:py-12">
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </main>
  );
}

