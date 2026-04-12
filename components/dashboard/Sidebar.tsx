"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { PiEyesLight, PiEyes } from "react-icons/pi";
import { FaPlus, FaPaintbrush } from "react-icons/fa6";
import { IoIdCardSharp } from "react-icons/io5";

function PreviewToggle() {
  const { setIsPreview, isPreview } = useContext(AppContext)!;

  return (
    <button
      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-none text-sm font-semibold transition-all ${
        isPreview
          ? "bg-black text-white"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
      }`}
      onClick={() => setIsPreview(!isPreview)}
    >
      {isPreview ? (
        <PiEyes className="text-lg font-extrabold" />
      ) : (
        <PiEyesLight className="text-lg" />
      )}
      {isPreview ? "Hide Preview" : "Show Preview"}
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
      className={`
        px-2 py-2 ${mobile && "md:hidden"} text-sm md:text-md max-md:flex items-center justify-between flex-col font-semibold transition-colors",
        ${!mobile && active ? "bg-black text-white" : "md:hover:bg-white/60"}
      `}
    >
      {icon}
      {label}
    </Link>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full max-md:hidden w-full flex-col gap-4 rounded bg-white/60 p-4 shadow-(--shadow-nav) ring-1 ring-(--color-border) backdrop-blur">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="md:text-2xl text-xl font-extrabold tracking-tight text-(--color-dark)"

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
          <Link href={`/u/${encodeURIComponent(user.username)}`}>
            <Button variant="primary" className="w-full">
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
  return (
    <div className="fixed md:hidden z-100 overflow-hidden right-10 bottom-10 max-md:px-2 md:p-[0_0] h-13 duration-300 w-13 max-md:w-60 flex items-center justify-center shadow-[0px_0px_5px] shadow-gray-500/50 bg-white rounded-3xl ">
      <NavItem
        href="/dashboard"
        label="Links"
        mobile={true}
        icon={<FaPlus className="text-lg" />}
      />
      <NavItem
        href="/dashboard/cards"
        label="Cards"
        mobile={true}
        icon={<IoIdCardSharp className="text-lg" />}
      />
      <NavItem
        href="/dashboard/appearance"
        label="Appearance"
        mobile={true}
        icon={<FaPaintbrush className="text-lg" />}
      />
    </div>
  );
}
