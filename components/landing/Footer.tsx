import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-brand-green">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-3.5 font-(family-name:--font-jetbrains) text-2.75 text-[#5a5a48] sm:flex-row sm:items-center sm:justify-between md:px-9">
        <span>dropcard — for people who hate ugly link pages</span>
        <div className="flex gap-4">
          <Link href="/login" className="hover:text-brand-green">
            log in
          </Link>
          <Link href="/register" className="hover:text-brand-green">
            claim your name
          </Link>
        </div>
      </div>
    </footer>
  );
}
