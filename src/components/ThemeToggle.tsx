"use client"

import { useTheme } from "@/components/ThemeProvider"
import { Sun, Moon, Laptop } from "lucide-react"

const THEMES = ["light", "dark", "system"] as const
type Theme = typeof THEMES[number]

const THEME_CONFIG: Record<Theme, { label: string; icon: React.ElementType; iconClass: string }> = {
  light:  { label: "Light",  icon: Sun,    iconClass: "text-amber-500" },
  dark:   { label: "Dark",   icon: Moon,   iconClass: "text-blue-400" },
  system: { label: "System", icon: Laptop, iconClass: "text-slate-400 dark:text-slate-300" },
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const current = (theme as Theme) ?? "light"
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]
  const { label, icon: Icon, iconClass } = THEME_CONFIG[current]

  return (
    <button
      onClick={() => setTheme(next)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 text-xs font-semibold"
      aria-label={`Theme: ${label}. Click to switch to ${next}`}
    >
      <Icon className={`w-3.5 h-3.5 ${iconClass}`} />
      <span>{label}</span>
    </button>
  )
}
