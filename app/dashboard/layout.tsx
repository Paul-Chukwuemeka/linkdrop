"use client";
import { NavBar, Sidebar } from "@/components/dashboard/Sidebar";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthContext as useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Providers } from "@/context/Providers";
import AppWrapper from "@/components/dashboard/Wrapper";

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
    <Providers>
      <div className="min-h-dvh flex bg-neutral-100 p-2 sm:p-3 lg:p-4">
          <AppWrapper>
            <Sidebar />
            <NavBar />
            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
              <div className="min-w-0 h-full pb-20 md:pb-0">{children}</div>
            </div>
          </AppWrapper>
      </div>
    </Providers>
  );
}
