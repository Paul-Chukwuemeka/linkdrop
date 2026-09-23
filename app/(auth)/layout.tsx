import { authFontClass } from "@/lib/fonts";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`${authFontClass} paper-grain min-h-dvh bg-background-paper font-[family-name:var(--font-inter)] text-primary`}
    >
      {children}
    </main>
  );
}

