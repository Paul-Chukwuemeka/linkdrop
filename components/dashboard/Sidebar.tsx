"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { ReactNode } from "react"
import { useCard } from "@/context/CardContext"
import { useProfile } from "@/context/ProfileContext"
import { PiEyesLight, PiEyeBold } from "react-icons/pi"
import { FaPaintbrush } from "react-icons/fa6"
import { IoIdCardSharp } from "react-icons/io5"
import { TbLogout } from "react-icons/tb"
import { logout } from "@/lib/logout"
import { Home, Settings, PenLine } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

function PreviewToggle() {
  const { setIsPreview, isPreview } = useCard()

  return (
    <button
      className={`flex items-center lg:hidden justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        isPreview
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      }`}
      onClick={() => setIsPreview(!isPreview)}
      aria-label={isPreview ? "Hide preview" : "Show preview"}
    >
      {isPreview ? (
        <PiEyeBold className="text-lg font-extrabold" />
      ) : (
        <PiEyesLight className="text-lg" />
      )}
      <span className="hidden sm:inline">{isPreview ? "Hide Preview" : "Show Preview"}</span>
    </button>
  )
}

function NavItem({
  href,
  label,
  icon,
  mobile,
}: {
  href: string
  label: string
  icon?: ReactNode | null
  mobile?: boolean
}) {
  const pathname = usePathname()
  const active =
    label === "Links"
      ? pathname === "/dashboard"
      : pathname.toLowerCase().includes(label.toLowerCase())

  return (
    <Link
      href={href}
      className={[
        "transition-colors duration-150",
        mobile
          ? "flex md:hidden flex-col items-center justify-center px-1 py-1 h-10 w-10 touch-manipulation"
          : "px-3 py-2.5 rounded-lg text-sm lg:text-base",
        !mobile && active
          ? "bg-[#1B3A1B]/10 text-[#1B3A1B] font-medium dark:bg-brand-green/25 dark:text-[#7ece7e]"
          : "font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        // mobile && active ? "bg-black text-white dark:bg-white dark:text-black rounded-full" : "rounded-full",
      ]
        .filter(Boolean)
        .join(" ")}

    >
      {icon}
      {!mobile && label}
    </Link>
  )
}

export function Sidebar() {
  const { data: session } = useSession()
  const user = session?.user
  const { profile } = useProfile()

  return (
    <aside className="hidden md:flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto rounded-xl bg-white/60 dark:bg-neutral-900/60 p-4 shadow-(--shadow-nav)    backdrop-blur">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-xl lg:text-2xl font-extrabold tracking-tight text-dark dark:text-dark"
        >
          LinkDrop
        </Link>
      </div>

      <div className="px-3 py-4 border-b border-gray-100 dark:border-neutral-800">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-semibold text-gray-900 dark:text-neutral-100">
            {profile?.fullname || user?.name}
          </p>
          <Link
            href="/dashboard/appearance#fullname"
            className="shrink-0 text-gray-400 hover:text-brand-green transition-colors"
            aria-label="Edit name"
          >
            <PenLine className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="truncate text-xs text-gray-500 dark:text-neutral-400">
          @{profile?.username || user?.username}
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        <NavItem href="/dashboard" label="Links" />
        <NavItem href="/dashboard/cards" label="Cards" />
        <NavItem href="/dashboard/appearance" label="Appearance" />
        <NavItem href="/dashboard/settings" label="Settings" />
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <PreviewToggle />
        <div className="space-y-2">
          {user?.username && (
            <Link
              href={`/u/${encodeURIComponent(user.username)}`}
              target="_blank"
              className="inline-flex items-center justify-center w-full bg-brand-green hover:bg-brand-green-hover text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              View public page
            </Link>
          )}
          <button
            className="inline-flex items-center justify-center w-full bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 py-2.5 px-4 rounded-lg transition-colors"
            onClick={() => logout()}
          >
            Log out
          </button>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-neutral-800 pt-2 flex justify-center">
        <ThemeToggle iconOnly />
      </div>
    </aside>
  )
}

export function NavBar() {
  const { isPreview, setIsPreview } = useCard()
  const pathname = usePathname()

  const isLinkActive = pathname === "/dashboard"
  const isCardsActive = pathname.toLowerCase().includes("cards")
  const isAppearanceActive = pathname.toLowerCase().includes("appearance")
  const isSettingsActive = pathname.toLowerCase().includes("settings")

  return (
    <nav className="fixed md:hidden bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-700 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)] safe-area-bottom">
      <div className="flex items-center justify-between px-5 h-[68px]">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all shadow-lg touch-manipulation ${
            isLinkActive
              ? "bg-black text-white dark:bg-white dark:text-black shadow-black/30"
              : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
            aria-label="Home"
          >
            <Home className="text-lg" />
          </Link>

          <Link
            href="/dashboard/cards"
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-colors touch-manipulation ${
              isCardsActive
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
            aria-label="Cards"
          >
            <IoIdCardSharp className="text-xl" />
          </Link>

          <Link
            href="/dashboard/appearance"
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-colors touch-manipulation ${
              isAppearanceActive
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
            aria-label="Appearance"
          >
            <FaPaintbrush className="text-xl" />
          </Link>

          <Link
            href="/dashboard/settings"
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-colors touch-manipulation ${
              isSettingsActive
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
            aria-label="Settings"
          >
            <Settings className="text-xl" />
          </Link>
        </div>

        <button
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-colors touch-manipulation ${
            isPreview
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
          onClick={() => setIsPreview(!isPreview)}
          aria-label={isPreview ? "Hide preview" : "Show preview"}
        >
          <PiEyeBold className="text-xl" />
        </button>
        <button
          className="flex items-center justify-center w-11 h-11 rounded-xl transition-colors text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 touch-manipulation"
          onClick={() => logout()}
          aria-label="Log out"
        >
          <TbLogout className="text-xl" />
        </button>
      </div>
    </nav>
  )
}
