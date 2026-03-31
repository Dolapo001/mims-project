"use client"

import { useTheme } from "@/components/ThemeProvider"
import { Sun, Moon, Laptop, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const THEMES = ["light", "dark", "system"] as const
type Theme = typeof THEMES[number]

const THEME_CONFIG: Record<Theme, { label: string; icon: React.ElementType; iconClass: string }> = {
  light:  { label: "Light",  icon: Sun,    iconClass: "text-amber-500" },
  dark:   { label: "Dark",   icon: Moon,   iconClass: "text-blue-400" },
  system: { label: "System", icon: Laptop, iconClass: "text-slate-400 dark:text-slate-300" },
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only showing UI once mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-20 h-8 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse flex items-center justify-center">
        <Loader2 className="w-3 h-3 animate-spin text-slate-300" />
      </div>
    )
  }

  const current = (theme as Theme) ?? "light"
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]
  const { label, icon: Icon, iconClass } = THEME_CONFIG[current]

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        setTheme(next)
      }}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-[10px] uppercase tracking-wider cursor-pointer shadow-sm active:scale-95 group",
        "relative z-[150]"
      )}
      aria-label={`Current: ${label}. Switch to ${next}`}
    >
      <Icon className={cn("w-3.5 h-3.5 transition-transform group-hover:rotate-12", iconClass)} />
      <span className="hidden sm:inline-block">{label}</span>
    </button>
  )
}
