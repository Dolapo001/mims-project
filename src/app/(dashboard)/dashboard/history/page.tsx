"use client"

import { HistoryTable } from "@/components/dashboard/HistoryTable"
import type { PredictionHistoryItem } from "@/types"

const MOCK_HISTORY: PredictionHistoryItem[] = [
  { id: "1", date: "2026-03-30", industry: "Fashion", budget: 5000, targetAge: "18–24", goal: "Awareness", result: "Instagram", confidence: 0.91 },
  { id: "2", date: "2026-03-28", industry: "Tech", budget: 12000, targetAge: "25–34", goal: "Conversions", result: "LinkedIn", confidence: 0.83 },
  { id: "3", date: "2026-03-25", industry: "Food", budget: 2500, targetAge: "18–24", goal: "Engagement", result: "TikTok", confidence: 0.88 },
  { id: "4", date: "2026-03-22", industry: "Education", budget: 800, targetAge: "13–17", goal: "Awareness", result: "YouTube", confidence: 0.74 },
  { id: "5", date: "2026-03-18", industry: "Health", budget: 3200, targetAge: "35–44", goal: "Conversions", result: "Facebook", confidence: 0.79 },
  { id: "6", date: "2026-03-14", industry: "Fashion", budget: 7500, targetAge: "25–34", goal: "Engagement", result: "Instagram", confidence: 0.87 },
  { id: "7", date: "2026-03-10", industry: "Tech", budget: 20000, targetAge: "25–34", goal: "Conversions", result: "LinkedIn", confidence: 0.92 },
  { id: "8", date: "2026-03-06", industry: "Food", budget: 1500, targetAge: "13–17", goal: "Awareness", result: "TikTok", confidence: 0.81 },
]

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Prediction History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">A full log of all your past campaign analyses and their results.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Runs", value: "1,284" },
          { label: "Avg. Confidence", value: "87.4%" },
          { label: "Top Platform", value: "Instagram" },
          { label: "This Month", value: "8 runs" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <HistoryTable data={MOCK_HISTORY} />
    </div>
  )
}
