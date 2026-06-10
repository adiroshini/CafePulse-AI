import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:8000'; // Change to your server IP for device testing

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ──────────────────────────────────────────────────────────────
export const authAPI = {
  register: (email: string, phone: string, password: string) =>
    api.post('/api/auth/register', { email, phone, password }),

  verifyOTP: (email: string, otp: string) =>
    api.post('/api/auth/verify-otp', { email, otp }),

  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),

  setupBusiness: (data: {
    cafe_name: string;
    location: string;
    business_type: string;
    num_employees: number;
    operating_hours: string;
  }) => api.post('/api/auth/business-setup', data),

  getMe: () => api.get('/api/auth/me'),
};

// ─── Data Upload ───────────────────────────────────────────────────────
export const dataAPI = {
  upload: (payload: {
    sales?: any[];
    reviews?: any[];
    inventory?: any[];
    feedback?: any[];
  }) => api.post('/api/data/upload', payload),

  getSummary: () => api.get('/api/data/summary'),
};

// ─── Analysis ──────────────────────────────────────────────────────────
export const analysisAPI = {
  runAnalysis: () => api.post('/api/analysis/run'),
  getDashboard: () => api.get('/api/analysis/dashboard'),
  getReviews: () => api.get('/api/analysis/reviews'),
  getRevenue: () => api.get('/api/analysis/revenue'),
  getInventory: () => api.get('/api/analysis/inventory'),
  getCustomerExit: () => api.get('/api/analysis/customer-exit'),
  whatIf: (scenario: string, params: object) =>
    api.post('/api/analysis/what-if', { scenario, params }),
};

// ─── AI Assistant ──────────────────────────────────────────────────────
export const aiAPI = {
  ask: (question: string, language: string = 'english') =>
    api.post('/api/ai/ask', { question, language }),

  weeklyReport: (language: string = 'english') =>
    api.post('/api/ai/weekly-report', { language }),

  sentiment: (text: string) =>
    api.post('/api/ai/sentiment', { text }),
};

// ─── Menu ──────────────────────────────────────────────────────────────
export const menuAPI = {
  getAnalysis: () => api.get('/api/menu/analysis'),
  createExperiment: (data: {
    product_name: string;
    experiment_type: string;
    details?: object;
  }) => api.post('/api/menu/experiment', data),
  recordResult: (experiment_id: string, result: string, notes?: string) =>
    api.post('/api/menu/experiment/result', { experiment_id, result, notes }),
  getExperiments: () => api.get('/api/menu/experiments'),
  getCombos: () => api.get('/api/menu/combos'),
};

// ─── Actions ───────────────────────────────────────────────────────────
export const actionsAPI = {
  getPending: () => api.get('/api/actions/pending'),
  create: (recommendation: string, category: string) =>
    api.post('/api/actions/create', { recommendation, category }),
  update: (action_id: string, status: string, impact_notes?: string) =>
    api.post('/api/actions/update', { action_id, status, impact_notes }),
  getHistory: () => api.get('/api/actions/history'),
};

// ─── Notifications ─────────────────────────────────────────────────────
export const notificationsAPI = {
  autoCheck: () => api.post('/api/notifications/auto-check'),
  send: (channel: string, alert_type: string, to_number: string) =>
    api.post('/api/notifications/send', { channel, alert_type, to_number }),
};

export default api;
