"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Navbar } from "@/components/dashboard/Navbar"
import { BottomNav } from "@/components/dashboard/BottomNav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen font-sans transition-colors duration-300">
      {/* Sidebar — desktop only, always visible */}
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>

      {/* Main content — offset on desktop via sidebar width */}
      <div className="flex flex-col flex-1 min-h-screen lg:pl-[240px]">
        <Navbar title={
          pathname?.includes("/predictions") ? "Predictions" :
          pathname?.includes("/history") ? "History" :
          pathname?.includes("/settings") ? "Settings" :
          "Dashboard"
        } />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-20 md:pt-24 pb-24 lg:pb-12 w-full max-w-7xl mx-auto">
          {children}
        </main>
        {/* Bottom tab bar — mobile only */}
        <BottomNav />
      </div>
    </div>
  )
}

