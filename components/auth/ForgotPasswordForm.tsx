"use client"

import { FormField } from "@/components/auth/FormField"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.trim())) {
      setError("Invalid email format.")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) {
        setError("Something went wrong. Please try again.")
        return
      }
      setSent(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-md border-2 border-dashed border-[#b9b19b] bg-[#f7efdd] p-4 text-center">
        <p className="font-[family-name:var(--font-space-grotesk)] text-lg font-extrabold text-brand-green">
          check your inbox.
        </p>
        <p className="mt-1 font-[family-name:var(--font-jetbrains)] text-[11px] text-[#5a5a48]">
          {"// if that email has an account, the link is on its way"}
        </p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <FormField id="forgot-email" label="Email" error={error ?? undefined}>
        <input
          type="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-md bg-brand-green py-2.5 font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold text-background-primary sticker-shadow-gold transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Sending reset link…</span>
          </>
        ) : (
          "send reset link"
        )}
      </button>
    </form>
  )
}
