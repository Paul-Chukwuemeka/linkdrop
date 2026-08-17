"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#how-it-works" },
  { label: "Templates", href: "#how-it-works" },
  { label: "Pricing", href: "#how-it-works" },
  { label: "Examples", href: "#example-mockup" },
];

const focusRing =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="mx-auto w-full max-w-300 px-6 md:px-12">
      <div className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-xl font-medium tracking-tight text-primary"
        >
          LinkDrop
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`text-sm font-medium text-primary opacity-70 transition-opacity duration-200 hover:opacity-100 ${focusRing}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={`px-4 py-2 text-sm font-medium text-primary transition-colors hover:text-brand-green ${focusRing}`}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className={`rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-green-hover ${focusRing}`}
          >
            Sign up free
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className={`ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-primary md:hidden ${focusRing}`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border-subtle py-3 md:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-sm font-medium text-primary opacity-70 transition-opacity duration-200 hover:opacity-100 ${focusRing}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
