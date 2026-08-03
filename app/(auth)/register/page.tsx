"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-(--shadow-card) ring-1 ring-(--border-color)">
      <h1
        className="text-3xl font-extrabold tracking-tight text-(--text-primary)"
  
      >
        Create your LinkForge
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Claim your username and start building your public page.
      </p>

      <div className="mt-8">
        <Suspense fallback={<Spinner className="h-6 w-6 text-black" />}>
          <RegisterForm />
        </Suspense>
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

