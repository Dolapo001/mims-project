/**
 * Prediction Service Layer (frontend/src/lib/predictionService.ts)
 * 
 * This service handles communication between our Next.js frontend
 * and the Django backend inference module.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface PredictionPayload {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  engagement_rate: number;
}

export interface PredictionResponse {
  best_platform: string;
  probabilities: Record<string, number>;
  status: string;
}

/**
 * Sends campaign metrics to the backend and returns the prediction results.
 */
export async function getBestPlatformPrediction(data: PredictionPayload): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Prediction request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to connect to AdWise Prediction API:', error);
    throw error;
  }
}
