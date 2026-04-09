"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { SignupRequest } from "@/lib/types";
import React, { useState } from "react";

export function RegisterForm() {
  const { register } = useAuth();

  const [form, setForm] = useState<SignupRequest>({
    username: "",
    email: "",
    fullname: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof SignupRequest>(key: K, value: SignupRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        fullname: form.fullname.trim(),
        password: form.password,
      });
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
        />
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
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
        Full name
        <Input
          autoComplete="name"
          value={form.fullname}
          onChange={(e) => update("fullname", e.target.value)}
          placeholder="Jane Doe"
          required
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
            Creating account…
          </span>
        ) : (
          "Sign up"
        )}
      </Button>
    </form>
  );
}

