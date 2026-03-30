"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * 🎨 Robust Theme Provider
 * 
 * We use `next-themes` here because it elegantly solves the SSR hydration mismatch problem.
 * In Next.js (Server-Side Rendering), the server doesn't know the client's `localStorage` or 
 * system preference. If we render a dark theme on the server but the client wants light, 
 * React will throw a hydration error and flash the wrong colors.
 * 
 * `next-themes` solves this by:
 * 1. Injecting a tiny script at the top of the `<body>` before React loads.
 * 2. Reading `localStorage` and `prefers-color-scheme` immediately.
 * 3. Adding the `class="dark"` to `<html>`.
 * 4. Silencing the hydration warning on the initial React mount.
 * 
 * This ensures:
 * ✅ Zero flash of incorrect theme (FOUC).
 * ✅ System preference auto-detection.
 * ✅ Extensible for future themes ("light", "dark", "dim", "neon", etc).
 */
export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    // NextThemesProvider acts as a standard React Context provider.
    // It passes `theme`, `setTheme`, `resolvedTheme`, and `systemTheme` down the tree.
    <NextThemesProvider 
      attribute="class" // Use class-based switching (adds .dark to <html>)
      defaultTheme="system" // Default to OS preference on first load
      enableSystem={true} // Allow matching OS preference via media queries
      disableTransitionOnChange // Prevents CSS transition bugs when flipping themes
      storageKey="adwise-theme" // Extensible persistence in localStorage
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
