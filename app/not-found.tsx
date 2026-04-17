import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="max-w-sm text-neutral-600 sm:text-lg">
          Sorry, we couldn&apos;t find the user profile or page you were looking for.
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-900 px-8 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
