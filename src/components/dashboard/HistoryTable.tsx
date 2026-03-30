"use client"

import { useState, useMemo } from "react"
import { Calendar, TrendingUp, History, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
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
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <History className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">No History Yet</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Your past campaign analyses will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Toolbar */}
      <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Prediction History</h3>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 dark:focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* ── Mobile: Card list ── */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {processed.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400 dark:text-slate-500">No results match &ldquo;{query}&rdquo;</p>
        ) : (
          processed.map(item => {
            const pct = Math.round(item.confidence * 100)
            return (
              <div key={item.id} className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">{item.result}</span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{item.industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">₦{item.budget.toLocaleString()}</span>
                  </div>
                </div>
                <span className={cn(
                  "text-sm font-black flex-shrink-0 ml-4",
                  pct >= 85 ? "text-emerald-600" : pct >= 70 ? "text-blue-600" : "text-amber-600"
                )}>
                  {pct}%
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* ── Desktop: Full table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80">
              <th className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => handleSort("date")} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  Date <SortIcon col="date" />
                </button>
              </th>
              <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Industry</th>
              <th className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => handleSort("budget")} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  Budget <SortIcon col="budget" />
                </button>
              </th>
              <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Platform</th>
              <th className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 text-right">
                <button onClick={() => handleSort("confidence")} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-700 dark:hover:text-slate-300 transition-colors ml-auto">
                  Confidence <SortIcon col="confidence" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {processed.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                  No results match &ldquo;{query}&rdquo;
                </td>
              </tr>
            ) : (
              processed.map(item => {
                const pct = Math.round(item.confidence * 100)
                return (
                  <tr key={item.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500 transition-colors">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{item.date}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{item.industry}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-black text-slate-900 dark:text-white">₦{item.budget.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-sm font-black text-slate-900 dark:text-white">{item.result}</span>
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
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 text-center">
        {compact ? (
          <Link href="/dashboard/history" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            View Detailed Analytics Report →
          </Link>
        ) : (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Showing {processed.length} of {data.length} records
          </p>
        )}
      </div>
    </div>
  )
}
