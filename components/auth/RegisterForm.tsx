"use client"

import { FormField } from "@/components/auth/FormField"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { UsernameField } from "@/components/auth/UsernameField"
import { PasswordField } from "@/components/auth/PasswordField"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { PASSWORD_PATTERN, PASSWORD_MIN_LENGTH } from "@/lib/validations/auth"
import { Check, Loader2 } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"

interface FormState {
  username: string
  email: string
  fullname: string
  password: string
}

function getFieldError(key: keyof FormState, value: string) {
  if (key === "username") {
    if (!value.trim()) return "Username required."
    if (value.trim().length < 3) return "At least 3 characters."
    if (!/^[a-zA-Z0-9_-]+$/.test(value.trim())) return "Only letters, numbers, _, and - allowed."
  }
  if (key === "email") {
    if (!value.trim()) return "Email required."
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(value.trim())) return "Invalid email format."
  }
  if (key === "fullname") {
    if (!value.trim()) return "Full name required."
  }
  if (key === "password") {
    if (!value) return "Password required."
    if (value.length < PASSWORD_MIN_LENGTH) return `Minimum ${PASSWORD_MIN_LENGTH} characters.`
    if (!PASSWORD_PATTERN.test(value)) return "Need an uppercase letter, a lowercase letter, and a number."
  }
  return ""
}

export function RegisterForm() {
  const searchParams = useSearchParams()
  const initialUsername = searchParams.get("username") || ""

  const [form, setForm] = useState<FormState>({
    username: initialUsername,
    email: "",
    fullname: "",
    password: "",
  })

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key !== "username") {
      const msg = getFieldError(key, value)
      setFieldErrors((prev) => (touched[key] ? { ...prev, [key]: msg } : prev))
    }
  }

  function handleBlur(key: keyof FormState) {
    setTouched((prev) => ({ ...prev, [key]: true }))
    const msg = getFieldError(key, form[key])
    setFieldErrors((prev) => ({ ...prev, [key]: msg }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const errors: Partial<Record<keyof FormState, string>> = {}
    let hasErrors = false
    ;(Object.keys(form) as (keyof FormState)[]).forEach((key) => {
      const msg = getFieldError(key, form[key])
      if (msg) hasErrors = true
      errors[key] = msg
    })
    if (hasErrors) {
      setFieldErrors(errors)
      setTouched({ username: true, email: true, fullname: true, password: true })
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          fullname: form.fullname.trim(),
          password: form.password,
        }),
      })

      if (res.status === 409) {
        const data = await res.json()
        const detail: string = data.detail || ""
        const field = detail.toLowerCase().startsWith("email") ? "email" : "username"
        setFieldErrors({ [field]: detail || "Already in use." })
        setError(null)
        setIsSubmitting(false)
        return
      }

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || "Registration failed. Please try again.")
        setIsSubmitting(false)
        return
      }

      await signIn("credentials", {
        username: form.username.trim(),
        password: form.password,
        redirectTo: "/dashboard",
      })
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <GoogleButton
        onClick={() => {
          setIsGoogleSubmitting(true)
          signIn("google", { redirectTo: "/dashboard" }).finally(() =>
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
        <UsernameField
          id="register-username"
          value={form.username}
          onChange={(value) => update("username", value)}
          onBlur={() => handleBlur("username")}
          error={fieldErrors.username}
        />

        <FormField id="register-email" label="Email" error={fieldErrors.email}>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
        </FormField>

        <FormField id="register-fullname" label="Full name" error={fieldErrors.fullname}>
          <input
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={form.fullname}
            onChange={(e) => update("fullname", e.target.value)}
            onBlur={() => handleBlur("fullname")}
          />
        </FormField>

        <PasswordField
          id="register-password"
          value={form.password}
          onChange={(value) => update("password", value)}
          onBlur={() => handleBlur("password")}
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
              <span className="sr-only">Creating account…</span>
            </>
          ) : (
            "Sign up free"
          )}
        </button>
      </form>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-secondary">
        <Check className="h-3.5 w-3.5 text-brand-green" aria-hidden="true" />
        No credit card required. Free forever.
      </p>

      <p className="mt-6 text-center text-sm text-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-green underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}
