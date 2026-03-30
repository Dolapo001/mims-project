import { Sidebar } from "@/components/dashboard/Sidebar"
import { Navbar } from "@/components/dashboard/Navbar"
import { BottomNav } from "@/components/dashboard/BottomNav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen font-sans transition-colors duration-300">
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 min-h-screen lg:pl-[240px]">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-20 md:pt-24 pb-24 lg:pb-12 w-full max-w-7xl mx-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
