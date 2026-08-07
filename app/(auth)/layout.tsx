export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-background-primary font-[family-name:var(--font-inter)] text-primary">
      {children}
    </main>
  );
}

