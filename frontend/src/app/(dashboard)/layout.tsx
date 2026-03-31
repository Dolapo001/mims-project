"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Navbar } from "@/components/dashboard/Navbar"
import { BottomNav } from "@/components/dashboard/BottomNav"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-[0.2em] ml-1">Authenticating...</p>
      </div>
    )
  }

  // Only render dashboard if user is authenticated
  if (!user) return null

  return (
    <div className="flex min-h-screen font-sans transition-colors duration-300">
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 min-h-screen lg:pl-[240px]">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-24 md:pt-32 pb-24 lg:pb-12 w-full max-w-7xl mx-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
