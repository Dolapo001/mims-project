"use client"

import { CheckCircle2, Trophy, BarChart3, TrendingUp, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResultCardProps {
  data?: {
    bestPlatform: string
    confidence: number
    ranking: string[]
  }
}

export function ResultCard({ data }: ResultCardProps) {
  if (!data) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-500">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Prediction Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            Submit the campaign form to see your AI-powered platform recommendation.
          </p>
        </div>
      </div>
    )
  }

  const { bestPlatform, confidence, ranking } = data
  const confidencePercent = Math.round(confidence * 100)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-10 animate-in fade-in zoom-in-95 duration-500">
      {/* Header: Recommendation Badge */}
      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full w-fit">
        <CheckCircle2 className="w-4 h-4" />
        <span className="text-[11px] font-bold uppercase tracking-wider">Top Recommendation Found</span>
      </div>

      {/* Primary Result: Best Platform */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            Predicted Best Platform
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
          </p>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight transition-transform hover:scale-[1.01] cursor-default leading-none">
            {bestPlatform}
          </h2>
        </div>

        {/* Confidence Gauge */}
        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 min-w-[200px] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
              Confidence Score
              <Info className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
            </span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">
              {confidencePercent}%
            </span>
          </div>
          <div className="h-2 w-full bg-blue-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              style={{ width: `${confidencePercent}%` }}
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-1000 ease-out shadow-sm dark:shadow-none"
            />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Based on historical performance patterns
          </p>
        </div>
      </div>

      {/* Platform Rankings */}
      <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Platform Rankings</h4>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {ranking && ranking.slice(0, 3).map((platform, i) => (
            <div 
              key={platform}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-default",
                i === 0 
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg ring-4 ring-slate-100 dark:ring-slate-800" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black",
                i === 0 ? "bg-slate-800" : "bg-slate-100 dark:bg-slate-800"
              )}>
                {i + 1}
              </div>
              <span className="text-sm font-bold">{platform}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
