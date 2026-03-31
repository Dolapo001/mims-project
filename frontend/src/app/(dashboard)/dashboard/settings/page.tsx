"use client"

import { useState } from "react"
import { User, Bell, Shield, Globe, Trash2, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Profile State
  const [profile, setProfile] = useState({
    name: "Alex Reed",
    email: "alex@adwise.ai",
    role: "Admin"
  })

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailReports: true,
    budgetAlerts: true,
    weeklyDigest: false
  })

  // API State
  const [api, setApi] = useState({
    endpoint: "http://localhost:8000/api",
    key: "sk-adwise-••••••••••••••••"
  })

  const handleSave = async (section: string) => {
    setIsSaving(section)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSaving(null)
    setSuccess(section)
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <div className="space-y-8 max-w-3xl pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account, notifications, and app preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Profile</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Personal account information.</p>
            </div>
          </div>
          {success === 'profile' && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-4 h-4" /> Changes saved
            </div>
          )}
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">User Role</label>
            <input
              type="text"
              value={profile.role}
              readOnly
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-2xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
          <div className="pt-2">
            <button
              onClick={() => handleSave('profile')}
              disabled={isSaving === 'profile'}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isSaving === 'profile' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Notifications</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Email and app alerts.</p>
          </div>
        </div>
        <div className="px-6 py-4 divide-y dark:divide-slate-800">
          {[
            { id: 'emailReports', label: 'Email Reports', sub: 'Receive prediction summaries via email' },
            { id: 'budgetAlerts', label: 'Budget Alerts', sub: 'Notify when thresholds are reached' },
            { id: 'weeklyDigest', label: 'Weekly Digest', sub: 'A roundup of your activity' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-5">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{item.sub}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                className={cn(
                  "relative inline-flex w-12 h-6.5 rounded-full transition-all duration-300",
                  notifications[item.id as keyof typeof notifications] ? "bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-500/20" : "bg-slate-200 dark:bg-slate-700"
                )}
              >
                <span className={cn(
                  "absolute top-1 left-1 w-4.5 h-4.5 bg-white rounded-full transition-all duration-300 shadow-sm",
                  notifications[item.id as keyof typeof notifications] ? "translate-x-5.5" : "translate-x-0"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">API & Integrations</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Connect your backend services.</p>
            </div>
          </div>
          {success === 'api' && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-4 h-4" /> Key updated
            </div>
          )}
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">API Endpoint</label>
            <input
              type="text"
              value={api.endpoint}
              onChange={(e) => setApi({ ...api, endpoint: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Private API Key</label>
            <input
              type="password"
              value={api.key}
              onChange={(e) => setApi({ ...api, key: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm transition-all focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-500"
            />
          </div>
          <div className="pt-2">
            <button
              onClick={() => handleSave('api')}
              disabled={isSaving === 'api'}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isSaving === 'api' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Connectivity"}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/50 dark:bg-red-950/10 rounded-3xl border border-red-100 dark:border-red-900/30 overflow-hidden mt-12">
        <div className="px-6 py-5 border-b border-red-100 dark:border-red-900/20 flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-500" />
          <h2 className="text-base font-bold text-red-900 dark:text-red-400">Security & Privacy</h2>
        </div>
        <div className="px-6 py-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-red-900 dark:text-red-400">Close Account</p>
            <p className="text-xs text-red-600/70 dark:text-red-500/70 mt-1">This action is permanent and cannot be undone.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-red-200 dark:shadow-none whitespace-nowrap">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
