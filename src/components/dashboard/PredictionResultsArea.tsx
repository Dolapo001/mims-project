"use client"

import { usePrediction } from "@/context/PredictionContext"
import { ResultCard } from "./ResultCard"
import { PredictionChart } from "./PredictionChart"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PredictionSkeleton } from "@/components/ui/Skeleton"

export function PredictionResultsArea() {
  const { result, isLoading, error } = usePrediction()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <PredictionSkeleton />
        {/* Optional: Add a second, generic skeleton for the chart area */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="w-1/4 h-5 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" />
            <div className="w-1/3 h-3 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-md" />
          </div>
          <div className="h-[250px] w-full flex items-end gap-4 px-4">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="flex-1 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-t-lg" style={{ height: `${20 * i}%` }} />
             ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <ResultCard data={result ? {
        bestPlatform: result.best_platform,
        confidence: result.confidence,
        ranking: result.ranking
      } : undefined} />

      {result && result.all_probabilities && (
        <PredictionChart data={Object.entries(result.all_probabilities).map(([platform, prob]) => ({
          platform,
          probability: prob as number
        }))} />
      )}
    </div>
  )
}
