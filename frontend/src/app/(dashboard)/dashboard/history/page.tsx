"use client"

import { HistoryTable } from "@/components/dashboard/HistoryTable"
import { usePrediction } from "@/context/PredictionContext"

export default function HistoryPage() {
  const { history, stats } = usePrediction()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Prediction History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">A real-time log of all your AI analyses and their performance metrics.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Runs", value: stats.total },
          { label: "Avg. Confidence", value: `${stats.avg_confidence}%` },
          { label: "Top Platform", value: stats.best_platform },
          { label: "Success Rate", value: "92%" }, // Placeholder for advanced metric
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <HistoryTable data={history} />
    </div>
  )
}
