"use client"

import { PredictionForm } from "@/components/dashboard/PredictionForm"
import { PredictionResultsArea } from "@/components/dashboard/PredictionResultsArea"

export default function PredictionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">New Prediction</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Fill in your campaign details to get an AI-powered platform recommendation.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        <div className="xl:col-span-2">
          <PredictionForm />
        </div>
        <div className="xl:col-span-3">
          <PredictionResultsArea />
        </div>
      </div>
    </div>
  )
}
