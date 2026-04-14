"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { PiEyesLight, PiEyes, PiEyeBold } from "react-icons/pi";
import { FaPlus, FaPaintbrush } from "react-icons/fa6";
import { IoIdCardSharp } from "react-icons/io5";

function PreviewToggle() {
  const { setIsPreview, isPreview } = useContext(AppContext)!;

  return (
    <button
      className={`flex items-center lg:hidden justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        isPreview
          ? "bg-black text-white"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
      }`}
      onClick={() => setIsPreview(!isPreview)}
      aria-label={isPreview ? "Hide preview" : "Show preview"}
    >
      {isPreview ? (
        <PiEyes className="text-lg font-extrabold" />
      ) : (
        <PiEyesLight className="text-lg" />
      )}
      <span className="hidden sm:inline">{isPreview ? "Hide Preview" : "Show Preview"}</span>
    </button>
  );
}

function NavItem({
  href,
  label,
  icon,
  mobile,
}: {
  href: string;
  label: string;
  icon?: ReactNode | null;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const active =
    label == "Links"
      ? pathname === "/dashboard"
      : pathname.toLowerCase().includes(label.toLowerCase());

  return (
    <Link
      href={href}
      className={[
        "font-semibold transition-colors",
        mobile
          ? "flex md:hidden flex-col items-center justify-center px-3 py-2 min-h-11 min-w-11 touch-manipulation"
          : "px-3 py-2.5 rounded-lg text-sm lg:text-base",
        !mobile && active ? "bg-black text-white" : "hover:bg-white/60",
        mobile && active ? "bg-black text-white rounded-full" : ""
      ].filter(Boolean).join(" ")}
    >
      {icon}
      {!mobile && label}
    </Link>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex h-full w-full flex-col gap-4 rounded-xl bg-white/60 p-4 shadow-(--shadow-nav) ring-1 ring-(--color-border) backdrop-blur">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-xl lg:text-2xl font-extrabold tracking-tight text-(--color-dark)"
        >
          LinkForge
        </Link>
      </div>

      <nav className="flex flex-col gap-1">
        <NavItem href="/dashboard" label="Links" />
        <NavItem href="/dashboard/cards" label="Cards" />
        <NavItem href="/dashboard/appearance" label="Appearance" />
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <PreviewToggle />
        {user?.username && (
          <Link href={`/u/${encodeURIComponent(user.username)}`} target="_blank">
            <Button variant="primary" size="sm" className="w-full h-12">
              View public page
            </Button>
          </Link>
        )}
        <Button variant="ghost" className="w-full" onClick={logout}>
          Log out
        </Button>
      </div>
    </aside>
  );
}

export function NavBar() {
  const { isPreview, setIsPreview } = useContext(AppContext)!;
  return (
    <nav className="fixed md:hidden bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center shadow-lg shadow-gray-500/30 bg-white rounded-full px-2 sm:px-3  safe-area-bottom">
      <NavItem
        href="/dashboard"
        label="Links"
        mobile={true}
        icon={<FaPlus className="text-base sm:text-lg" />}
      />
      <NavItem
        href="/dashboard/cards"
        label="Cards"
        mobile={true}
        icon={<IoIdCardSharp className="text-base sm:text-lg" />}
      />
      <NavItem
        href="/dashboard/appearance"
        label="Appearance"
        mobile={true}
        icon={<FaPaintbrush className="text-base sm:text-lg" />}
      />
      <button
        className="flex items-center justify-center text-black rounded-full px-3 py-2 text-lg sm:text-xl min-h-11 min-w-11 touch-manipulation"
        onClick={() => setIsPreview(!isPreview)}
        aria-label={isPreview ? "Hide preview" : "Show preview"}
      >
        <PiEyes strokeWidth={5} />
      </button>
    </nav>
  );
}
