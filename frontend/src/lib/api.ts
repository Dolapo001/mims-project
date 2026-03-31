import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adwise_token') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adwise_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export interface CampaignData {
  budget: number;
  industry: string;
  targetAge: string;
  goal: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  engagement_rate?: number;
  cost_per_click?: number;
}

export const predictCampaign = async (data: CampaignData) => {
  try {
    const payload = {
      budget: data.budget,
      industry: data.industry,
      target_age_group: data.targetAge,
      campaign_goal: data.goal,
      impressions: data.impressions || data.budget * 20,
      clicks: data.clicks || data.budget * 2,
      conversions: data.conversions || data.budget * 0.1,
      engagement_rate: 0.05,
      cost_per_click: 0.25
    };
    return (await api.post('/predict/', payload)).data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'API Error');
  }
};

export const getHistory = async () => {
    try {
        return (await api.get('/history/')).data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch history.');
    }
}

export const getStats = async () => {
    try {
        return (await api.get('/stats/')).data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch stats.');
    }
}

export const getPredictionDetail = async (id: string) => {
    try {
        return (await api.get(`/history/${id}/`)).data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to retrieve analysis details.');
    }
}
