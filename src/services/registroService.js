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

export const registroService = {
  async getRegistros(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get('/registros', {
        params: { page, per_page: perPage }
      });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {
          current_page: page,
          per_page: perPage,
          total: response.data.total || 0
        }
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al cargar registros'
      };
    }
  },
  async createRegistro(data) {
    try {
      const response = await apiClient.post('/registros', data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Registro creado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al crear registro',
        errors: error.response?.data?.errors || {}
      };
    }
  },
  async getRegistroById(id) {
    try {
      const response = await apiClient.get(`/registros/${id}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al cargar registro'
      };
    }
  },
  async updateRegistro(id, data) {
    try {
      const response = await apiClient.put(`/registros/${id}`, data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Registro actualizado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al actualizar registro',
        errors: error.response?.data?.errors || {}
      };
    }
  },
  async deleteRegistro(id) {
    try {
      const response = await apiClient.delete(`/registros/${id}`);
      return {
        success: true,
        message: response.data.message || 'Registro eliminado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al eliminar registro'
      };
    }
  }
};
