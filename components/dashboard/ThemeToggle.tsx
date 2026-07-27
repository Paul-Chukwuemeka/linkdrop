"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useProfile } from "@/context/ProfileContext"
import { apiFetch } from "@/lib/api"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const { profile, setProfile } = useProfile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Sync DB theme preference with next-themes on mount
  useEffect(() => {
    if (profile?.theme && mounted) {
      setTheme(profile.theme)
    }
  }, [profile?.theme, mounted, setTheme])

  if (!mounted) return null

  function cycle() {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
    setTheme(next)
    apiFetch("/api/profile", {
      method: "PATCH",
      json: { theme: next },
    }).catch(() => {})
    setProfile((prev) => prev ? { ...prev, theme: next } : prev)
  }

  return (
    <button
      onClick={cycle}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${className || ""}`}
      aria-label={`Theme: ${theme}. Click to switch.`}
    >
      {theme === "light" && <Sun className="w-4 h-4" />}
      {theme === "dark" && <Moon className="w-4 h-4" />}
      {theme === "system" && <Monitor className="w-4 h-4" />}
      <span className="capitalize">{theme}</span>
    </button>
  )
}
