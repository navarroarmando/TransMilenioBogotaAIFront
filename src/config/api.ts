export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  TIMEOUT: 30000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // History
  HISTORY: '/history',
  HISTORY_DETAIL: (id: string) => `/history/${id}`,
  HISTORY_DELETE: (id: string) => `/history/${id}`,
  
  // Optimization
  OPTIMIZATION_START: '/optimization/start',
  OPTIMIZATION_STATUS: (id: string) => `/optimization/status/${id}`,
  OPTIMIZATION_CANCEL: (id: string) => `/optimization/cancel/${id}`,
  OPTIMIZATION_RETRAIN: '/optimization/retrain',
  
  // Results
  RESULTS: (id: string) => `/results/${id}`,
  RESULTS_VISUALIZATION: (id: string, type: string) => `/results/${id}/visualization/${type}`,
  
  // Reports
  REPORTS_PDF: '/reports/pdf',
  REPORTS_EXCEL: '/reports/excel',
  REPORTS_HTML: '/reports/html',
  REPORTS_DOWNLOAD: (id: string) => `/reports/download/${id}`,
  
  // WebSocket
  WS_LOGS: (id: string) => `/ws/logs/${id}`,
} as const;
