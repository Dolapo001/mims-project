"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { PredictionResponse } from "@/types"

interface PredictionState {
  result: PredictionResponse | null
  isLoading: boolean
  error: string | null
}

interface PredictionContextType extends PredictionState {
  setResult: (result: PredictionResponse | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined)

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PredictionState>({
    result: null,
    isLoading: false,
    error: null,
  })

  const setResult = (result: PredictionResponse | null) => 
    setState(prev => ({ ...prev, result, error: null }))
  
  const setLoading = (isLoading: boolean) => 
    setState(prev => ({ ...prev, isLoading }))
  
  const setError = (error: string | null) => 
    setState(prev => ({ ...prev, error }))

  return (
    <PredictionContext.Provider value={{ ...state, setResult, setLoading, setError }}>
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
