"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Settings, LogOut, Target } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { ThemeToggle } from "@/components/ThemeToggle"

interface NavbarProps {
  title?: string
}

const NOTIFICATIONS = [
  { id: 1, text: "Prediction complete — Instagram recommended", time: "2 min ago", unread: true },
  { id: 2, text: "Budget threshold reached (₦500,000)", time: "1 hr ago", unread: true },
  { id: 3, text: "Weekly digest is ready to review", time: "Yesterday", unread: false },
]

export function Navbar({ title = "AdWise AI" }: NavbarProps) {
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const handleSignOut = () => {
    setShowProfile(false)
    logout()
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  return (
    <header className="fixed top-0 left-0 lg:left-[240px] right-0 z-40 h-14 md:h-16 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl px-4 flex items-center justify-between transition-colors duration-300 shadow-sm shadow-slate-200/20 dark:shadow-slate-900/20">
      {/* Left: Logo + hamburger on mobile (desktop sidebar handles nav) */}
      <div className="flex items-center gap-3">
        {/* Desktop-only sidebar toggle hidden — sidebar always visible on desktop */}
        {/* Logo — always shown on mobile */}
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
            <Target className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base">AdWise AI</span>
        </Link>
        {/* Title on desktop */}
        <span className="hidden lg:block text-base font-semibold text-slate-700 dark:text-slate-200">{title}</span>
      </div>

      {/* Right: Theme Toggle + Notifications + Profile */}
      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(p => !p); setShowProfile(false) }}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-[min(320px,90vw)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{unreadCount} new</span>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50 max-h-64 overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${n.unread ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.unread ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{n.text}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(p => !p); setShowNotifications(false) }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
              {user?.name?.slice(0, 2).toUpperCase() ?? "?"}
            </div>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-xs font-semibold text-slate-900 leading-none">{user?.name ?? "Guest"}</span>
              <span className="text-[10px] text-slate-400 leading-none mt-0.5">Account</span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name ?? "Guest"}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{user?.email ?? ""}</p>
              </div>
              <div className="py-1">
                <Link href="/dashboard/settings" onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  Settings
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
