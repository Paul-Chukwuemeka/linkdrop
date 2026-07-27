"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 p-8 shadow-(--shadow-card) ring-1 ring-(--border-color)">
      <h1
        className="text-3xl font-extrabold tracking-tight text-(--text-primary) dark:text-white"
  
      >
        Create your LinkForge
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Claim your username and start building your public page.
      </p>

      <div className="mt-8">
        <Suspense fallback={<Spinner className="h-6 w-6 text-black dark:text-white" />}>
          <RegisterForm />
        </Suspense>
      </div>

      <p className="mt-6 text-sm text-neutral-700 dark:text-neutral-300">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold underline">
          Log in
        </Link>
        .
      </p>
    </div>
  );
}

