"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Target, History, Settings, LogOut, LucideIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { useNotify } from "@/context/NotificationContext"

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
  const { user, logout } = useAuth()
  const { notify } = useNotify()

  const handleLogout = () => {
    logout()
    notify("Logged out successfully.", "info")
  }

  return (
    <aside className="w-[240px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl lg:shadow-none font-sans">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800 mb-6">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 dark:bg-blue-900/60 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shadow-blue-100 dark:shadow-none">
            <Target className="text-white w-5 h-5 group-hover:animate-pulse" />
          </div>
          <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white leading-none">AdWise AI</span>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 space-y-1.5">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard" 
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border border-transparent",
                isActive
                  ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white border-slate-200/60 dark:border-slate-700/50 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-colors", 
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer: User Profille & Logout */}
      <div className="p-4 border-t border-slate-50 dark:border-slate-800 mt-auto bg-slate-50/30 dark:bg-slate-900/10 space-y-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl border border-transparent bg-white dark:bg-slate-900 shadow-sm transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate tracking-tight">{user?.username || "Quest User"}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5 font-medium tracking-tight">Standard Plan</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-black text-rose-500 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all border border-rose-100 dark:border-rose-900/50 group"
        >
          <span className="flex items-center gap-2">
             <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
             LOG OUT
          </span>
        </button>
      </div>
    </aside>
  )
}
