"use client"

import { useState } from "react"
import { Briefcase, Users, Target, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePrediction } from "@/context/PredictionContext"
import { useNotify } from "@/context/NotificationContext"
import { predictCampaign } from "@/lib/api"

interface FormData {
  budget: string
  industry: string
  targetAge: string
  campaignGoal: string
}

const INDUSTRIES = ["E-commerce", "Tech", "Fashion", "Food", "Services", "Gaming"]
const AGE_GROUPS = ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"]
const GOALS = ["Awareness", "Traffic", "Conversion", "Engagement"]

export function PredictionForm() {
  const { setResult, setLoading, setError, isLoading, refreshData } = usePrediction()
  const { notify } = useNotify()
  const [formData, setFormData] = useState<FormData>({
    budget: "",
    industry: "",
    targetAge: "",
    campaignGoal: "",
  })

  const isFormValid = 
    formData.budget !== "" && 
    Number(formData.budget) > 0 && 
    formData.industry !== "" && 
    formData.targetAge !== "" && 
    formData.campaignGoal !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isLoading) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await predictCampaign({
        budget: Number(formData.budget),
        industry: formData.industry,
        targetAge: formData.targetAge,
        goal: formData.campaignGoal,
        impressions: Number(formData.budget) * 20,
        clicks: Number(formData.budget) * 2,
        conversions: Number(formData.budget) * 0.1,
        engagement_rate: 0.05,
        cost_per_click: 0.25
      })
      
      if (response.status === "success") {
        setResult(response.data)
        notify(`Prediction complete! Best platform: ${response.data.best_platform}`, "success")
        // Trigger live refresh of history and stats
        refreshData()
      } else {
        const msg = response.message || "Prediction failed."
        setError(msg)
        notify(msg, "error")
      }
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred. Please try again."
      setError(msg)
      notify(msg, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-2xl transition-all duration-300">
      <div className="mb-8 font-sans">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          New Campaign Prediction
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Fill in your campaign details to predict the best advertising platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
              <span className="text-slate-400 dark:text-slate-500 font-black text-sm">₦</span>
              Budget (₦)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="e.g. 500,000"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm transition-all text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {/* Industry Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              Industry
            </label>
            <select
              required
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm transition-all text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 appearance-none cursor-pointer disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="" disabled>Select industry...</option>
              {INDUSTRIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* Target Age Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
              <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              Target Age
            </label>
            <select
              required
              value={formData.targetAge}
              onChange={(e) => setFormData({ ...formData, targetAge: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm transition-all text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 appearance-none cursor-pointer disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="" disabled>Select age range...</option>
              {AGE_GROUPS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* Campaign Goal Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
              <Target className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              Campaign Goal
            </label>
            <select
              required
              value={formData.campaignGoal}
              onChange={(e) => setFormData({ ...formData, campaignGoal: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm transition-all text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 appearance-none cursor-pointer disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="" disabled>Select goal...</option>
              {GOALS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={cn(
              "w-full px-6 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg",
              !isFormValid || isLoading
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                : "bg-blue-600 dark:bg-blue-900/60 dark:border dark:border-blue-800/50 dark:text-blue-50 text-white hover:bg-blue-700 dark:hover:bg-blue-800/80 hover:shadow-blue-200 dark:hover:shadow-none hover:-translate-y-1 active:scale-[0.98] shadow-blue-100 dark:shadow-none"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              <>
                Run AI Prediction
                <Target className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
