"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/components/ThemeProvider"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

interface PredictionData {
  platform: string
  probability: number
}

interface PredictionChartProps {
  data: PredictionData[]
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']

export function PredictionChart({ data }: PredictionChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  const chartData = data.map(item => ({
    ...item,
    percentage: Math.round(item.probability * 100)
  }))

  const gridColor = isDark ? "#1e293b" : "#f1f5f9"
  const tickColor = isDark ? "#94a3b8" : "#64748b"
  const cursorColor = isDark ? "#1e293b" : "#f8fafc"

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-3">
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Probability: <span className="text-blue-600 dark:text-blue-400">{payload[0].value}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Platform Probability</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Comparative AI analysis of potential success rates</p>
        </div>
      </div>

      <div className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barSize={32}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke={gridColor}
            />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              dataKey="platform"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12, fontWeight: 700 }}
              width={100}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: cursorColor, radius: 8 }}
            />
            <Bar
              dataKey="percentage"
              radius={[0, 8, 8, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
          X-Axis: Predicted ROI Potential (%)
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-tighter">AI Inference v1.02</span>
        </div>
      </div>
    </div>
  )
}
