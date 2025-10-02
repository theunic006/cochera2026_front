import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token enviado para roles:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.warn('No se encontró token de acceso para roles');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ingresoService = {
  async getIngresos(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/ingresos?page=${page}&per_page=${perPage}`);
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  async getIngresoById(id) {
    try {
      const response = await apiClient.get(`/ingresos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  async createIngreso(data) {
    try {
      const response = await apiClient.post('/ingresos', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  async updateIngreso(id, data) {
    try {
      const response = await apiClient.put(`/ingresos/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  async deleteIngreso(id, data) {
    try {
      // axios permite enviar body en delete usando el segundo argumento como config
      const response = await apiClient.delete(`/ingresos/${id}`, { data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};
