import Link from "next/link";

const centerLinks = [
  { label: "Features", href: "#how-it-works" },
  { label: "Templates", href: "#how-it-works" },
  { label: "Pricing", href: "#how-it-works" },
  { label: "Examples", href: "#example-mockup" },
  { label: "Changelog", href: "#" },
];

// Legal pages don't exist as routes yet — keep as placeholders.
const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

const linkClass =
  "text-sm text-secondary transition-colors hover:text-primary rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2";

export default function Footer() {
  return (
    <footer className="bg-background-primary px-6 pb-8 pt-16 md:px-12">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="text-xl font-medium tracking-tight text-primary">
              LinkDrop
            </Link>
            <p className="mt-3 max-w-xs text-sm text-secondary">
              The link-in-bio for makers who care.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="mb-4 text-sm font-semibold text-primary">Product</h3>
            <ul className="space-y-3">
              {centerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="mb-4 text-sm font-semibold text-primary">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border-subtle pt-8 text-xs text-secondary sm:flex-row">
          <p>&copy; 2026 LinkDrop</p>
          <p>Made for creators.</p>
        </div>
      </div>
    </footer>
  );
}
