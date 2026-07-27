"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Spinner } from "@/components/ui/Spinner"
import { signIn } from "next-auth/react"
import React, { useState } from "react"
import { FcGoogle } from "react-icons/fc"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        redirectTo: "/dashboard",
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
        onClick={() => signIn("google", { redirectTo: "/dashboard" })}
        className="w-full flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
      >
        <FcGoogle className="h-5 w-5" />
        Sign in with Google
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-neutral-900 px-3 text-neutral-500 dark:text-neutral-400">or continue with</span>
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Username
          <Input
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Password
          <Input
            autoComplete="current-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error && (
          <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="h-4 w-4 border-t-white" />
              Logging in…
            </span>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </div>
  )
}
