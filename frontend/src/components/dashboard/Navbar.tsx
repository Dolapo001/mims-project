"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Bell, Settings, Target, LogOut, ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import { cn } from "@/lib/utils"

function getTitle(pathname: string) {
  if (pathname.includes("/predictions")) return "Predictions"
  if (pathname.includes("/history")) return "History"
  if (pathname.includes("/settings")) return "Settings"
  return "Dashboard"
}

export function Navbar() {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Prediction complete — Instagram recommended", time: "2 min ago", unread: true },
    { id: 2, text: "Budget threshold reached (₦500,000)", time: "1 hr ago", unread: true },
    { id: 3, text: "Weekly digest is ready to review", time: "Yesterday", unread: false },
  ])

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  // Use stable handlers
  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowNotifications(!showNotifications)
    setShowProfile(false)
  }

  const toggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowProfile(!showProfile)
    setShowNotifications(false)
  }

  const closeAll = useCallback(() => {
    setShowNotifications(false)
    setShowProfile(false)
  }, [])

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (notifRef.current && !notifRef.current.contains(target)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(target)) setShowProfile(false)
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="fixed top-0 left-0 lg:left-[240px] right-0 z-[100] h-16 md:h-18 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between transition-colors duration-300 shadow-sm pointer-events-auto">
      <div className="flex items-center gap-4">

        <Link href="/dashboard" className="flex items-center gap-2 group lg:hidden">
          <div className="w-8 h-8 bg-slate-900 dark:bg-slate-700 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md shrink-0">
            <Target className="text-white w-5 h-5 pointer-events-none" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg hidden sm:block">AdWise</span>
        </Link>
        <div className="hidden lg:block h-6 w-px bg-slate-100 dark:border-slate-800 mx-2" />
        <span className="text-[10px] sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] ml-1 sm:ml-0 truncate">
          {getTitle(pathname)}
        </span>
      </div>

      <div className="flex items-center gap-2 relative">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotifications}
            className={cn(
              "relative p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer",
              showNotifications && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
            )}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white dark:border-slate-950" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-[calc(100%+12px)] w-[min(320px,90vw)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Recent Activity</span>
                  <span className="text-[10px] h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-black">
                    {unreadCount}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`flex gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${n.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                  >
                    <div className={`mt-1.5 w-2 h-2 rounded-full ${n.unread ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{n.text}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer ring-2 ring-transparent active:scale-95",
              showProfile && "ring-blue-500 ring-offset-2 dark:ring-offset-slate-950"
            )}
            aria-label="Toggle profile menu"
          >
            AD
          </button>

          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+12px)] w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Adedolapo Atiba</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-bold uppercase tracking-widest leading-none">Enterprise Plan</p>
              </div>
              <div className="p-2">
                <Link
                  href="/dashboard/settings"
                  onClick={closeAll}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Account Settings
                </Link>
                <button
                  onClick={closeAll}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all text-left cursor-pointer"
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
