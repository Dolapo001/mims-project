"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getPredictionDetail } from "@/lib/api"
import { ResultCard } from "@/components/dashboard/ResultCard"
import { PredictionChart } from "@/components/dashboard/PredictionChart"
import { Loader2, ArrowLeft, Calendar, Briefcase, Users, Target, ShieldCheck, Zap, History, Info, Trophy } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function PredictionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await getPredictionDetail(id as string)
        setData(res.data)
      } catch (err: any) {
        setError(err.message || "Failed to load prediction details.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Analyzing Logic...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-2xl flex items-center justify-center mb-6 border border-rose-100 dark:border-rose-900/50">
           <Target className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Analysis Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">{error}</p>
        <Link href="/dashboard/history" className="mt-8 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold">
           Return to History
        </Link>
      </div>
    )
  }

  // Get Top 3 Rankings if available
  const topRankings = data.ranking?.slice(0, 3) || []

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-5xl mx-auto pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-4">
          <button onClick={() => router.back()} className="group flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="space-y-1">
             <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">AI Prediction Report</h1>
             <p className="text-slate-500 dark:text-slate-400 font-medium">Deep analysis for <span className="text-blue-600 dark:text-blue-400 font-bold">{data.industry}</span> campaign.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
           </div>
           <div className="flex flex-col pr-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">ML Accuracy Verified</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          {/* Recommendation Summary */}
          <ResultCard data={{
            bestPlatform: data.result,
            confidence: data.confidence,
            ranking: data.ranking?.map((r: any) => r.platform) || []
          }} />

          {/* Top 3 Rankings Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Top 3 Performance Rankings
             </h3>
             {topRankings.length > 0 ? (
                <div className="space-y-4">
                   {topRankings.map((rank: any, index: number) => (
                      <div key={rank.platform} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-blue-200 transition-all">
                         <div className="flex items-center gap-4">
                            <span className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg text-xs font-black text-slate-400 border border-slate-100 dark:border-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">#{index + 1}</span>
                            <span className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">{rank.platform}</span>
                         </div>
                         <span className="text-sm font-black text-blue-600 dark:text-blue-400">{Math.round(rank.probability * 100)}% Match</span>
                      </div>
                   ))}
                </div>
             ) : (
                <div className="p-6 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                   <Info className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">Comparative ranking data unavailable for legacy records.</p>
                </div>
             )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Platform Probability Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Comparative Platform Probability</h3>
             {data.ranking && data.ranking.length > 0 ? (
               <PredictionChart data={data.ranking.map((r: any) => ({
                 platform: r.platform,
                 probability: r.probability
               }))} />
             ) : (
               <div className="h-[300px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center p-8">
                  <BarChartSkeleton />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">No Probability Distribution Found</p>
               </div>
             )}
          </div>

          {/* Parameters Metadata */}
          <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl" />
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Campaign Source Data</h4>
             <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <Metric label="Budget" value={`₦${data.budget.toLocaleString()}`} />
                <Metric label="Demographic" value={data.target_age_group} />
                <Metric label="Objective" value={data.campaign_goal} />
                <Metric label="Industry" value={data.industry} />
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
       <p className="text-lg font-black tracking-tight">{value}</p>
    </div>
  )
}

function BarChartSkeleton() {
  return (
     <div className="w-full space-y-3 px-4">
        {[80, 60, 45, 30].map((w, i) => (
           <div key={i} className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" style={{ width: `${w}%` }} />
        ))}
     </div>
  )
}
