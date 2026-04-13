"use client";
import { NavBar, Sidebar } from "@/components/dashboard/Sidebar";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AppContextProvider } from "@/context/AppContext";
import AppWrapper from "@/components/dashboard/Wrapper";
import CardPreview from "@/components/cards/CardPreview";

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
      <div className="min-h-dvh flex bg-neutral-100 p-2 sm:p-3 lg:p-4">
          <AppWrapper>
            <Sidebar />
            <NavBar />
            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
              <div className="min-w-0 h-full pb-20 md:pb-0">{children}</div>
            </div>
          </AppWrapper>
      </div>
    </AppContextProvider>
  );
}
