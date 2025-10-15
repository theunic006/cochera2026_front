
import axios from 'axios';

// Usar variables de entorno (Vite)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || 'http://127.0.0.1:8000/storage';

//export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.garage-peru.shop/api';
//export const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || 'https://api.garage-peru.shop/storage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
