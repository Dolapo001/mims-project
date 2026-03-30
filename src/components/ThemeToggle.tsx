"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"

/**
 * 🔄 Theme Toggle UI Component
 * 
 * Uses the `useTheme` hook returned by our ThemeProvider.
 * This component handles switching the active theme globally.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait until mounted on client to prevent hydration mismatch 
  // (Server has no concept of what theme the client actually stored)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 border border-slate-200 dark:border-slate-800 rounded-lg animate-pulse bg-slate-100 dark:bg-slate-800" />
    )
  }

  // Iterate to the next theme in the sequence when clicked
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light") // from system -> light
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all border border-transparent dark:border-transparent active:scale-95 flex items-center justify-center gap-2 group"
      aria-label={`Current theme is ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {/* Dynamic Icon Rendering based on current active state */}
      {theme === "light" && <Sun className="w-5 h-5 text-amber-500 " />}
      {theme === "dark" && <Moon className="w-5 h-5 text-blue-400 " />}
      {theme === "system" && <Monitor className="w-5 h-5 text-slate-500 dark:text-slate-400 " />}
      
      {/* Optional tooltip-like label on hover for desktop users */}
      <span className="hidden group-hover:block absolute right-12 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg pointer-events-none">
        {theme}
      </span>
    </button>
  )
}
