"use client"
import { NavBar, Sidebar } from "@/components/dashboard/Sidebar"
import { FullScreenLoader } from "@/components/ui/FullScreenLoader"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { Providers } from "@/context/Providers"
import AppWrapper from "@/components/dashboard/Wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <FullScreenLoader className="min-h-dvh w-full" />
  }

  if (!session) return null

  return (
    <Providers>
      <div className="min-h-dvh flex bg-neutral-100 dark:bg-neutral-950 p-2 sm:p-3 lg:p-4">
        <AppWrapper>
          <Sidebar />
          <NavBar />
          <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="min-w-0 h-full pb-24 md:pb-0">{children}</div>
          </div>
        </AppWrapper>
      </div>
    </Providers>
  )
}
