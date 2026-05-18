import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'codealchemy_token';

// ─── Axios instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s for AI conversion calls
  headers: { 'Content-Type': 'application/json' }
});

// ─── Request interceptor — attach JWT ─────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle 401 globally ───────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear local storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('codealchemy_session_user');
      // Reload to show login screen
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// ─── Token helpers ─────────────────────────────────────────────────────────────

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (name, email, password) =>
    api.post('/api/auth/register', { name, email, password }),

  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  me: () =>
    api.get('/api/auth/me')
};

// ─── Conversion API ───────────────────────────────────────────────────────────

export const convertAPI = {
  convertCode: (code, sourceLanguage, targetLanguage) =>
    api.post('/api/convert', { code, sourceLanguage, targetLanguage }),

  detectBugs: (code, language) =>
    api.post('/api/bugs', { code, language }),

  health: () =>
    api.get('/api/health')
};

export default api;
