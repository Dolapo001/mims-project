"use client"

import { useState, useMemo } from "react"
import { Calendar, TrendingUp, History, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { PredictionHistoryItem } from "@/types"

interface HistoryTableProps {
  data?: PredictionHistoryItem[]
  compact?: boolean
}

type SortKey = "date" | "budget" | "confidence"
type SortDir = "asc" | "desc"

export function HistoryTable({ data, compact = false }: HistoryTableProps) {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const router = useRouter()

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const processed = useMemo(() => {
    if (!data) return []
    const filtered = data.filter(item =>
      [item.industry, item.result, item.date, String(item.budget)]
        .some(val => val.toLowerCase().includes(query.toLowerCase()))
    )
    return [...filtered].sort((a, b) => {
      let aVal: number | string = a[sortKey]
      let bVal: number | string = b[sortKey]
      if (sortKey === "date") {
        aVal = new Date(aVal as string).getTime()
        bVal = new Date(bVal as string).getTime()
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [data, query, sortKey, sortDir])

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />
    return sortDir === "asc"
      ? <ArrowUp className="w-3 h-3 text-blue-600" />
      : <ArrowDown className="w-3 h-3 text-blue-600" />
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600">
          <History className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No History Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            Your past campaign analyses will appear here once processed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-300 font-sans">
      {/* Toolbar */}
      <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Recent Predictions</h3>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter list..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Mobile: Card list ── */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {processed.map(item => {
          const pct = Math.round(item.confidence * 100)
          return (
            <div 
              key={item.id} 
              onClick={() => router.push(`/dashboard/predictions/${item.id}`)}
              className="flex items-center justify-between px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer active:bg-slate-100"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{item.result}</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{item.industry}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                  <span>·</span>
                  <span className="text-slate-500 dark:text-slate-400">₦{item.budget.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-sm font-black",
                  pct >= 85 ? "text-emerald-600" : pct >= 70 ? "text-blue-600" : "text-amber-600"
                )}>
                  {pct}%
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Desktop: Full table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80">
              <th className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => handleSort("date")} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-700 transition-colors">
                  Date <SortIcon col="date" />
                </button>
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Context</th>
              <th className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => handleSort("budget")} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-700 transition-colors">
                  Budget <SortIcon col="budget" />
                </button>
              </th>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">AI Result</th>
              <th className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 text-right">
                <button onClick={() => handleSort("confidence")} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-700 transition-colors ml-auto">
                  Score <SortIcon col="confidence" />
                </button>
              </th>
              <th className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {processed.map(item => {
              const pct = Math.round(item.confidence * 100)
              return (
                <tr 
                  key={item.id} 
                  onClick={() => router.push(`/dashboard/predictions/${item.id}`)}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all cursor-pointer border-l-2 border-l-transparent hover:border-l-blue-600"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 transition-colors">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{item.date}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{item.industry}</span>
                       <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{item.campaign_goal || "Campaign"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">₦{item.budget.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                      <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.result}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={cn(
                      "inline-flex items-center gap-1 text-sm font-black",
                      pct >= 85 ? "text-emerald-600" : pct >= 70 ? "text-blue-600" : "text-amber-600"
                    )}>
                      <TrendingUp className="w-3.5 h-3.5 opacity-60" />
                      {pct}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                     <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 text-center">
        {compact ? (
          <Link href="/dashboard/history" className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            View Analytics Archive →
          </Link>
        ) : (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
            {processed.length} of {data.length} campaign records
          </p>
        )}
      </div>
    </div>
  )
}
