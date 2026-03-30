import axios from 'axios'
import { PredictionRequest, PredictionResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Prediction API
export const predictCampaign = async (data: PredictionRequest): Promise<PredictionResponse> => {
  // Mock API implementation since there's no backend provided
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const platforms = ["Instagram", "LinkedIn", "TikTok", "YouTube", "Facebook", "Twitter (X)"]
  const bestPlatform = platforms[Math.floor(Math.random() * platforms.length)]
  
  // Create mock probabilities
  const all_probabilities: Record<string, number> = {}
  let remaining = 1.0
  platforms.forEach((p, i) => {
    if (i === platforms.length - 1) {
      all_probabilities[p] = Number(remaining.toFixed(2))
    } else {
      const val = Math.random() * (remaining / 2)
      all_probabilities[p] = Number(val.toFixed(2))
      remaining -= val
    }
  })
  
  // Set the best one to a higher value
  all_probabilities[bestPlatform] = 0.7 + Math.random() * 0.2
  
  return {
    best_platform: bestPlatform,
    confidence: all_probabilities[bestPlatform],
    all_probabilities,
    ranking: platforms.sort((a, b) => (all_probabilities[b] || 0) - (all_probabilities[a] || 0))
  }
}

export default api


