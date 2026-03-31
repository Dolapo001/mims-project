"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useNotify } from "@/context/NotificationContext"
import api from "@/lib/api"
import { Sparkles, Loader2, Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const { notify } = useNotify()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await api.post("/token/", formData)
      const token = response.data.access
      
      // Fetch user profile after login
      const profileRes = await api.get("/accounts/profile/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      login(token, profileRes.data)
      notify("Welcome back to AdWise AI!", "success")
    } catch (err: any) {
      notify(err.response?.data?.detail || "Invalid credentials. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent dark:from-blue-900/10 dark:via-transparent">
      <div className="w-full max-w-md transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-600 dark:bg-blue-900/40 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none mb-4">
            <Sparkles className="w-8 h-8 text-white dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AdWise AI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Log in to your specialized campaign engine.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="enter your username"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm transition-all focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm transition-all focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 dark:bg-blue-900/60 dark:border dark:border-blue-800/50 text-white dark:text-blue-50 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
