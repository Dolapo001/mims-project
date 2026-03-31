"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { getHistory, getStats } from "@/lib/api"
import { useAuth } from "./AuthContext"

interface PredictionContextType {
  result: any | null
  setResult: (res: any) => void
  isLoading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (err: string | null) => void
  history: any[]
  stats: any
  refreshData: () => void
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined)

export function PredictionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [result, setResult] = useState<any | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [stats, setStats] = useState<any>({ total: 0, avg_confidence: 0, best_platform: "None" })

  const refreshData = async () => {
    if (!user) return
    try {
      const [h, s] = await Promise.all([getHistory(), getStats()])
      setHistory(h)
      setStats(s)
    } catch (err) {
      console.error("Failed to refresh dashboard data", err)
    }
  }

  useEffect(() => {
    if (user) refreshData()
  }, [user])

  return (
    <PredictionContext.Provider value={{ 
      result, setResult, 
      isLoading, setLoading, 
      error, setError, 
      history, stats, refreshData 
    }}>
      {children}
    </PredictionContext.Provider>
  )
}

export function usePrediction() {
  const context = useContext(PredictionContext)
  if (context === undefined) {
    throw new Error("usePrediction must be used within a PredictionProvider")
  }
  return context
}
