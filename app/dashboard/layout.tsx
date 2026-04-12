"use client";
import { NavBar, Sidebar } from "@/components/dashboard/Sidebar";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AppContextProvider } from "@/context/AppContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);
  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral-50">
        <Spinner />
      </div>
    );
  }

  return (
    <AppContextProvider>
      <div className="min-h-dvh flex bg-neutral-100 p-3 md:p-3">
        <div className="mx-auto flex-1 md:grid w-full grid-cols-1 gap-3 lg:grid-cols-[250px_1fr] md:grid-cols-[200px_1fr]">
          <Sidebar />
          <NavBar />
          <div className=" h-full overflow-y-auto">
            <div className="min-w-0 h-full">{children}</div>
          </div>
        </div>
      </div>
    </AppContextProvider>
  );
}

