// User related types
export interface User {
  id: string
  username: string
  email: string
}

// Prediction related types
export interface PredictionRequest {
  budget: number
  industry: string
  target_age_group: string
  campaign_goal: string
  impressions?: number
  clicks?: number
  conversions?: number
  engagement_rate?: number
  cost_per_click?: number
}

export interface PredictionResponse {
  best_platform: string
  confidence: number
  ranking: { platform: string; probability: number }[]
}

export interface PredictionHistoryItem extends PredictionRequest {
  id: string
  date: string
  result: string
  confidence: number
  ranking?: { platform: string; probability: number }[]
}

// UI specific types (e.g., chart data)
export interface ChartDataPoint {
  platform: string
  probability: number
  percentage?: number
}
