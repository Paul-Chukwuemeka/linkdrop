"use client"

import { Button } from "@/components/ui/Button"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { ReactNode } from "react"
import { useCard } from "@/context/CardContext"
import { PiEyesLight, PiEyeBold } from "react-icons/pi"
import { FaPaintbrush } from "react-icons/fa6"
import { IoIdCardSharp } from "react-icons/io5"
import { signOut } from "next-auth/react"
import { Home } from "lucide-react"
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
        "font-semibold transition-colors",
        mobile
          ? "flex md:hidden flex-col items-center justify-center px-1 py-1 h-10 w-10 touch-manipulation"
          : "px-3 py-2.5 rounded-lg text-sm lg:text-base",
        !mobile && active ? "text-(--text-primary) bg-white dark:bg-neutral-800" : " ",
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

  return (
    <aside className="hidden md:flex h-full w-full flex-col gap-4 rounded-xl bg-white/60 dark:bg-neutral-900/60 p-4 shadow-(--shadow-nav) ring-1 ring-(--border-color) backdrop-blur">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-xl lg:text-2xl font-extrabold tracking-tight text-dark dark:text-dark"
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
        <ThemeToggle />
        {user?.username && (
          <Link href={`/u/${encodeURIComponent(user.username)}`} target="_blank">
            <Button variant="primary" size="sm" className="w-full h-12">
              View public page
            </Button>
          </Link>
        )}
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Log out
        </Button>
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
      </div>
    </nav>
  )
}
