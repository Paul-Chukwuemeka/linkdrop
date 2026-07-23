"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Spinner } from "@/components/ui/Spinner"
import { signIn } from "next-auth/react"
import React, { useState } from "react"

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
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
        Username
        <Input
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          required
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
  )
}
