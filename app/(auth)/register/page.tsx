"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-[var(--shadow-card)] ring-1 ring-(--color-border)">
      <h1
        className="text-3xl font-extrabold tracking-tight text-(--color-dark)"
  
      >
        Create your LinkForge
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Claim your username and start building your public page.
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>

      <p className="mt-6 text-sm text-neutral-700">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold underline">
          Log in
        </Link>
        .
      </p>
    </div>
  );
}

