"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

type NotificationType = "success" | "error" | "info"

interface Notification {
  id: string
  message: string
  type: NotificationType
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void
  notifications: Notification[]
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const notify = useCallback((message: string, type: NotificationType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification = { id, message, type }
    
    setNotifications(prev => [...prev, newNotification])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }, [removeNotification])

  return (
    <NotificationContext.Provider value={{ notify, notifications, removeNotification }}>
      {children}
      {/* Toast Portal Area */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <ToastItem key={n.id} notification={n} onDismiss={() => removeNotification(n.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

function ToastItem({ notification, onDismiss }: { notification: Notification, onDismiss: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  const styles = {
    success: "border-emerald-100 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800/50",
    error: "border-rose-100 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-800/50",
    info: "border-blue-100 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800/50"
  }

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-xl backdrop-blur-md animate-in slide-in-from-right-10 fade-in duration-300 min-w-[280px] ${styles[notification.type]}`}>
      {icons[notification.type]}
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex-1">{notification.message}</p>
      <button onClick={onDismiss} className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  )
}

export function useNotify() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotify must be used within a NotificationProvider")
  }
  return context
}
