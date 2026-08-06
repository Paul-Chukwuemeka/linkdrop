"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/register?username=${encodeURIComponent(username.trim())}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:items-center"
    >
      <div className="w-full sm:max-w-sm">
        <Input
          placeholder="yourname"
          aria-label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="focus:ring-[var(--forest)] focus:border-[var(--forest)]"
        />
      </div>
      <Button
        variant="primary"
        size="lg"
        className="w-full sm:w-auto bg-[var(--forest)] text-white hover:bg-[var(--forest)]/90 hover:shadow-md hover:-translate-y-px active:scale-95"
        type="submit"
      >
        Get started for free
      </Button>
    </form>
  );
}
