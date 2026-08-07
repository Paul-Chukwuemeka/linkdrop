"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-(--shadow-card)">
        <h1 className="text-3xl font-extrabold tracking-tight text-(--text-primary)">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Log in to manage your cards, links, and collections.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-sm text-neutral-700">
          New here?{" "}
          <Link href="/register" className="font-semibold underline">
            Create an account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
