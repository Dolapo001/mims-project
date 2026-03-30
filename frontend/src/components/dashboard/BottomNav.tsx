"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Target, History, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Predict", href: "/dashboard/predictions", icon: Target },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 lg:hidden safe-area-pb transition-colors duration-300">
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide transition-colors",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              {item.label}
              {isActive && <div className="absolute bottom-0 w-6 h-0.5 bg-blue-600 rounded-full" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
