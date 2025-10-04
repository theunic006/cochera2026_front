import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
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

export const salidaService = {
  async getSalidas(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/salidas?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },
  async searchSalidas(query, page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/salidas/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },
  async getSalidaById(id) {
    try {
      const response = await apiClient.get(`/salidas/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return { type: 'validation', message: data.message || 'Parámetros incorrectos', errors: data.errors || {} };
        case 404:
          return { type: 'not_found', message: data.message || 'No encontrado' };
        case 422:
          return { type: 'validation', message: data.message || 'Errores de validación', errors: data.errors || {} };
        case 500:
          return { type: 'server_error', message: 'Error interno del servidor. Inténtalo más tarde.' };
        default:
          return { type: 'unknown', message: data.message || 'Ha ocurrido un error inesperado' };
      }
    } else if (error.request) {
      return { type: 'network', message: 'Error de conexión. Verifica tu conexión a internet.' };
    } else {
      return { type: 'unknown', message: 'Ha ocurrido un error inesperado' };
    }
  },
};

export default salidaService;
