"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Settings, LogOut, Target } from "lucide-react"
import Link from "next/link"
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
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  return (
    <header className="fixed top-0 left-0 lg:left-[240px] right-0 z-40 h-14 md:h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 flex items-center justify-between transition-colors duration-300 shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 bg-slate-900 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <Target className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base">AdWise AI</span>
        </Link>
        <span className="hidden lg:block text-base font-semibold text-slate-700 dark:text-slate-200">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(prev => !prev)
              setShowProfile(false)
            }}
            className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-950" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[min(320px,90vw)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{unreadCount} new</span>
                )}
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${n.unread ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}
                  >
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.unread ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{n.text}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{n.time}</p>
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
            onClick={() => {
              setShowProfile(prev => !prev)
              setShowNotifications(false)
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-[11px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            aria-label="Profile menu"
          >
            AD
          </button>

          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Adedolapo Atiba</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Enterprise Plan</p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  Settings
                </Link>
                <button
                  onClick={() => setShowProfile(false)}
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
