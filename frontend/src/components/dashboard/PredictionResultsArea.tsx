"use client"

import { usePrediction } from "@/context/PredictionContext"
import { ResultCard } from "./ResultCard"
import { PredictionChart } from "./PredictionChart"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PredictionSkeleton } from "@/components/ui/Skeleton"
import { Sparkles, BarChart3, HelpCircle } from "lucide-react"

export function PredictionResultsArea() {
  const { result, isLoading, error } = usePrediction()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <PredictionSkeleton />
        {/* Simplified chart skeleton for immediate visual feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-4">
             <BarChart3 className="w-4 h-4 text-slate-300 animate-pulse" />
             <div className="w-1/4 h-5 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" />
          </div>
          <div className="h-[250px] w-full flex flex-col gap-4 px-4">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="w-full h-8 bg-slate-100/50 dark:bg-slate-800 animate-pulse rounded-md" style={{ width: `${80 - (10 * i)}%` }} />
             ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  // Final State: Correct Mapping for Backend Data Format
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {!result ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-950/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800/50 transition-all">
          <div className="mb-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
             <Sparkles className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
             No Prediction Yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto font-medium">
             Enter campaign metrics on the left and run analysis to see AI platform recommendations and probabilities.
          </p>
          <div className="mt-6 flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-900 py-1.5 px-4 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
             <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Step-by-Step AI Logic</span>
          </div>
        </div>
      ) : (
        <>
          <ResultCard data={{
            bestPlatform: result.best_platform,
            confidence: result.confidence,
            ranking: result.ranking.map((item: any) => item.platform)
          }} />

          <PredictionChart data={result.ranking.map((item: any) => ({
             platform: item.platform,
             probability: item.probability
          }))} />
        </>
      )}
    </div>
  )
}
