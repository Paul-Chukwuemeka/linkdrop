"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ButtonLoader } from "@/components/ui/ButtonLoader"
import { signIn } from "next-auth/react"
import React, { useState } from "react"
import { FcGoogle } from "react-icons/fc"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  // Only same-site relative paths are honored (no open redirects).
  // The initializer also runs during SSR render, so guard for window.
  const [next] = useState(() => {
    if (typeof window === "undefined") return "/dashboard"
    const raw = new URLSearchParams(window.location.search).get("next")
    return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard"
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password) {
      setError("Username and password are required.")
      return
    }

    setIsSubmitting(true)

    try {
      await signIn("credentials", {
        username: username.trim(),
        password,
        redirectTo: next,
      })
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant="ghost"
        onClick={async () => {
          setIsGoogleSubmitting(true)
          try {
            await signIn("google", { redirectTo: next })
          } finally {
            setIsGoogleSubmitting(false)
          }
        }}
        disabled={isGoogleSubmitting || isSubmitting}
        className="w-full flex items-center justify-center gap-2 border border-neutral-200 hover:bg-neutral-50"
      >
        {isGoogleSubmitting ? (
          <ButtonLoader label="Redirecting…" />
        ) : (
          <>
            <FcGoogle className="h-5 w-5" />
            Sign in with Google
          </>
        )}
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-neutral-500">or continue with</span>
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
          Username
          <Input
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            required
            className="!bg-white !text-(--text-primary) !placeholder:text-neutral-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
          Password
          <Input
            autoComplete="current-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="!bg-white !text-(--text-primary) !placeholder:text-neutral-500"
          />
        </label>

        {error && (
          <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700  ring-red-100">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <ButtonLoader label="Logging in…" onDark />
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </div>
  )
}
