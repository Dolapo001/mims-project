"use client"

import { User, Bell, Shield, Globe, KeyRound, Trash2 } from "lucide-react"

const settingSections = [
  {
    icon: User,
    title: "Profile",
    description: "Manage your personal information and account details.",
    fields: [
      { label: "Full Name", value: "Alex Reed", type: "text" },
      { label: "Email", value: "alex@adwise.ai", type: "email" },
      { label: "Role", value: "Admin", type: "text", readOnly: true },
    ],
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control how and when you receive alerts.",
    toggles: [
      { label: "Email reports", sublabel: "Receive prediction summaries via email", defaultOn: true },
      { label: "Budget alerts", sublabel: "Get notified when budget thresholds are reached", defaultOn: true },
      { label: "Weekly digest", sublabel: "A roundup of your prediction activity", defaultOn: false },
    ],
  },
  {
    icon: Globe,
    title: "API & Integrations",
    description: "Connect your backend and view your API keys.",
    fields: [
      { label: "API Endpoint", value: "http://localhost:8000/api", type: "text" },
      { label: "API Key", value: "sk-adwise-••••••••••••••••", type: "password" },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account, notifications, and app preferences.</p>
      </div>

      {settingSections.map((section) => (
        <div key={section.title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400">
              <section.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{section.title}</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{section.description}</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Input fields */}
            {section.fields?.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{field.label}</label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  readOnly={field.readOnly}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all disabled:opacity-60 read-only:bg-slate-100 dark:read-only:bg-slate-800 read-only:cursor-not-allowed"
                />
              </div>
            ))}

            {/* Toggles */}
            {section.toggles?.map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{toggle.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{toggle.sublabel}</p>
                </div>
                <button
                  className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 ${toggle.defaultOn ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                  <span className={`inline-block w-5 h-5 bg-white dark:bg-slate-100 rounded-full shadow-sm transform transition-transform duration-200 mt-0.5 ${toggle.defaultOn ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}

            {/* Save button for sections with fields */}
            {section.fields && (
              <div className="pt-2">
                <button className="px-5 py-2 bg-slate-900 dark:bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Danger Zone */}
      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-red-100 dark:border-red-900/20">
          <div className="w-9 h-9 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-500 dark:text-red-400">
            <Shield className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-red-900 dark:text-red-400">Danger Zone</h2>
            <p className="text-xs text-red-400 dark:text-red-500 font-medium">Irreversible account actions.</p>
          </div>
        </div>
        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Delete Account</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Permanently delete your account and all data.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-200 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors whitespace-nowrap">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
