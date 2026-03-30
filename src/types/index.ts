// User related types
export interface User {
  id: string
  email: string
  name: string
  role?: string
}

// Prediction related types
export interface PredictionRequest {
  budget: number
  industry: string
  targetAge: string
  goal: string
}

export interface PredictionResponse {
  best_platform: string
  confidence: number
  all_probabilities: Record<string, number>
  ranking: string[]
}

export interface PredictionHistoryItem extends PredictionRequest {
  id: string
  date: string
  result: string
  confidence: number
}

// UI specific types (e.g., chart data)
export interface ChartDataPoint {
  platform: string
  probability: number
  percentage?: number
}
