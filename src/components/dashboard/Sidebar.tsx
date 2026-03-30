"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Target, History, Settings, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Predictions", href: "/dashboard/predictions", icon: Target },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl lg:shadow-none">
      {/* Sidebar Header: Logo/Title + Mobile Close Button */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800 mb-6 font-sans">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shadow-black/5">
            <Target className="text-white w-5 h-5 group-hover:animate-pulse" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">AdWise AI</span>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 space-y-1.5 font-sans">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard" 
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-transparent shadow-none",
                isActive
                  ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white border-slate-200/60 dark:border-slate-700/50 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              )}
              onClick={undefined}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-colors", 
                isActive ? "text-black dark:text-white" : "text-slate-300 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-black dark:bg-white rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm transition-all duration-300 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-slate-200 dark:shadow-none group-hover:scale-105 transition-transform">
            AR
          </div>
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate tracking-tight">Alex Reed</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5 font-medium tracking-tight">Enterprise Plan</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
