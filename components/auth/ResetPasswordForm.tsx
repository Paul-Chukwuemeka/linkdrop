"use client"

import { PasswordField } from "@/components/auth/PasswordField"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { useState } from "react"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      })
      if (res.status === 204) {
        setDone(true)
        return
      }
      const data = await res.json().catch(() => null)
      setError(data?.detail ?? "This reset link is invalid or has expired.")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div role="alert" className="rounded-md border border-accent-coral/40 bg-[#fbe9e1] p-3 text-sm text-accent-coral-dark">
        this page needs a reset link — request a new one from the{" "}
        <Link href="/forgot-password" className="font-semibold underline underline-offset-2">
          forgot password
        </Link>{" "}
        page.
      </div>
    )
  }

  if (done) {
    return (
      <div className="rounded-md border-2 border-dashed border-[#b9b19b] bg-[#f7efdd] p-4 text-center">
        <p className="font-[family-name:var(--font-space-grotesk)] text-lg font-extrabold text-brand-green">
          password updated.
        </p>
        <p className="mt-2 text-sm text-secondary">
          <Link href="/login" className="font-semibold text-brand-green underline-offset-2 hover:underline">
            log in with your new password
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <PasswordField
        id="reset-password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        placeholder="New password"
      />
      <PasswordField
        id="reset-password-confirm"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        placeholder="Repeat new password"
        showStrength={false}
      />

      {error && (
        <div role="alert" className="rounded-md border border-accent-coral/40 bg-[#fbe9e1] p-3 text-sm text-accent-coral-dark">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-md bg-brand-green py-2.5 font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-background-primary sticker-shadow-gold transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Updating password…</span>
          </>
        ) : (
          "set new password"
        )}
      </button>
    </form>
  )
}
