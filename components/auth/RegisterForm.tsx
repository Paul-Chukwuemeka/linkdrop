"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ButtonLoader } from "@/components/ui/ButtonLoader"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { PASSWORD_PATTERN, PASSWORD_MIN_LENGTH } from "@/lib/validations/auth"
import React, { useState } from "react"
import { FcGoogle } from "react-icons/fc"

interface FormState {
  username: string
  email: string
  fullname: string
  password: string
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function validateField(key: string, value: string) {
    let msg = ""
    if (key === "username") {
      if (!value.trim()) msg = "Username required."
      else if (!/^[a-zA-Z0-9_-]+$/.test(value)) msg = "Only letters, numbers, _, and - allowed."
    }
    if (key === "email") {
      if (!value.trim()) msg = "Email required."
      else if (!/^[^@]+@[^@]+\.[^@]+$/.test(value)) msg = "Invalid email format."
    }
    if (key === "password") {
      if (value.length > 0 && value.length < PASSWORD_MIN_LENGTH) {
        msg = `Minimum ${PASSWORD_MIN_LENGTH} characters.`
      } else if (value.length > 0 && !PASSWORD_PATTERN.test(value)) {
        msg = "Need an uppercase letter, a lowercase letter, and a number."
      }
    }
    setFieldErrors((prev) => ({ ...prev, [key]: msg }))
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    validateField(key, value)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
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
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant="ghost"
        onClick={async () => {
          setIsGoogleSubmitting(true)
          try {
            await signIn("google", { redirectTo: "/dashboard" })
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
            Create account with Google
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
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            placeholder="yourname"
            required
            minLength={3}
            className="!bg-white !text-(--text-primary) !placeholder:text-neutral-500"
          />
          {fieldErrors.username && <span className="text-xs text-red-600 font-normal">{fieldErrors.username}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
          Email
          <Input
            autoComplete="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            required
            className="!bg-white !text-(--text-primary) !placeholder:text-neutral-500"
          />
          {fieldErrors.email && <span className="text-xs text-red-600 font-normal">{fieldErrors.email}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
          Full name
          <Input
            autoComplete="name"
            value={form.fullname}
            onChange={(e) => update("fullname", e.target.value)}
            placeholder="Jane Doe"
            required
            className="!bg-white !text-(--text-primary) !placeholder:text-neutral-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
          Password
          <Input
            autoComplete="new-password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="Minimum 8 characters"
            required
            minLength={8}
            className="!bg-white !text-(--text-primary) !placeholder:text-neutral-500"
          />
          {fieldErrors.password && <span className="text-xs text-red-600 font-normal">{fieldErrors.password}</span>}
        </label>

        {error && (
          <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700  ring-red-100">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <ButtonLoader label="Creating account…" onDark />
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </div>
  )
}
