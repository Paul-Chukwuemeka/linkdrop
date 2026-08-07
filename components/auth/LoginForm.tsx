"use client"

import { FormField } from "@/components/auth/FormField"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { PasswordField } from "@/components/auth/PasswordField"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"

interface FieldErrors {
  username?: string
  password?: string
}

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
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

    const errors: FieldErrors = {}
    if (!username.trim()) errors.username = "Please enter your username."
    if (!password) errors.password = "Please enter your password."
    setFieldErrors(errors)
    if (errors.username || errors.password) return

    setIsSubmitting(true)

    try {
      await signIn("credentials", {
        username: username.trim(),
        password,
        redirectTo: next,
      })
    } catch {
      setError("Invalid username or password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <GoogleButton
        label="Sign in with Google"
        ariaLabel="Sign in with Google"
        onClick={() => {
          setIsGoogleSubmitting(true)
          signIn("google", { redirectTo: next }).finally(() =>
            setIsGoogleSubmitting(false)
          )
        }}
        loading={isGoogleSubmitting}
        disabled={isSubmitting}
      />

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium text-gray-400">Or continue with</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
        <FormField id="login-username" label="Username" error={fieldErrors.username}>
          <input
            type="text"
            autoComplete="username"
            placeholder="yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormField>

        <PasswordField
          id="login-password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="••••••••"
          showStrength={false}
          labelAction={
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-green hover:underline"
            >
              Forgot password?
            </Link>
          }
          error={fieldErrors.password}
        />

        {error && (
          <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isGoogleSubmitting}
          className="flex w-full items-center justify-center rounded-lg bg-brand-green py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-green-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span className="sr-only">Logging in…</span>
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        New here?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-green underline-offset-2 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
