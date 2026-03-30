"use client"

import { PredictionForm } from "@/components/dashboard/PredictionForm"
import { PredictionResultsArea } from "@/components/dashboard/PredictionResultsArea"
import { HistoryTable } from "@/components/dashboard/HistoryTable"
import { TrendingUp, Users, Target, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { PredictionHistoryItem } from "@/types"

const MOCK_HISTORY: PredictionHistoryItem[] = [
  { id: "1", date: "2026-03-30", industry: "Fashion", budget: 500000, targetAge: "18–24", goal: "Awareness", result: "Instagram", confidence: 0.91 },
  { id: "2", date: "2026-03-28", industry: "Tech", budget: 1200000, targetAge: "25–34", goal: "Conversions", result: "LinkedIn", confidence: 0.83 },
  { id: "3", date: "2026-03-25", industry: "Food", budget: 250000, targetAge: "18–24", goal: "Engagement", result: "TikTok", confidence: 0.88 },
  { id: "4", date: "2026-03-22", industry: "Education", budget: 80000, targetAge: "13–17", goal: "Awareness", result: "YouTube", confidence: 0.74 },
  { id: "5", date: "2026-03-18", industry: "Health", budget: 320000, targetAge: "35–44", goal: "Conversions", result: "Facebook", confidence: 0.79 },
]

const STATS = [
  { label: "Predictions", value: "1,284", change: "+12%", icon: Target, color: "text-blue-600 dark:text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
  { label: "Avg Confidence", value: "87.4%", change: "+2.4%", icon: Zap, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
  { label: "Best Platform", value: "Instagram", change: "Steady", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  { label: "Campaigns", value: "12 active", change: "+4", icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your campaign snapshot.</p>
      </div>

      {/* Stats — 2 col on mobile, 4 col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5">
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] md:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight leading-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Action CTA on mobile */}
      <Link
        href="/dashboard/predictions"
        className="flex lg:hidden items-center justify-between bg-blue-600 dark:bg-blue-900/60 dark:border dark:border-blue-800/50 text-white dark:text-blue-50 px-5 py-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none active:scale-[0.98] transition-transform"
      >
        <div>
          <p className="font-bold text-base">Run a New Prediction</p>
          <p className="text-blue-200 dark:text-blue-300/80 text-xs mt-0.5">Find the best platform for your campaign</p>
        </div>
        <ArrowRight className="w-5 h-5 flex-shrink-0 dark:text-blue-400" />
      </Link>

      {/* Main Grid: Form + Results (desktop only inline, mobile stacked) */}
      <div className="hidden lg:grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        <div className="xl:col-span-2">
          <PredictionForm />
        </div>
        <div className="xl:col-span-3">
          <PredictionResultsArea />
        </div>
      </div>

      {/* History Section */}
      <div className="pt-4 md:pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Recent History</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Your last 5 campaign analyses</p>
        </div>
        <HistoryTable data={MOCK_HISTORY} compact />
      </div>
    </div>
  )
}
