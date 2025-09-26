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
  (error) => {
    return Promise.reject(error);
  }
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

export const vehicleService = {
  async getVehicles(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get('/vehiculos', {
        params: { page, per_page: perPage }
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {
          current_page: page,
          per_page: perPage,
          total: response.data.total || 0
        },
        message: 'Vehículos obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      return {
        success: false,
        data: [],
        pagination: {
          current_page: 1,
          per_page: perPage,
          total: 0
        },
        message: error.response?.data?.message || 'Error al obtener los vehículos'
      };
    }
  },

  async createVehicle(vehicleData) {
    try {
      const response = await apiClient.post('/vehiculos', vehicleData);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Vehículo creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear el vehículo',
        errors: error.response?.data?.errors || {}
      };
    }
  },

  async getVehicleById(id) {
    try {
      const response = await apiClient.get(`/vehiculos/${id}`);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Vehículo obtenido exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener el vehículo'
      };
    }
  },

  async updateVehicle(id, vehicleData) {
    try {
      const response = await apiClient.put(`/vehiculos/${id}`, vehicleData);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Vehículo actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar el vehículo',
        errors: error.response?.data?.errors || {}
      };
    }
  },

  async deleteVehicle(id) {
    try {
      const response = await apiClient.delete(`/vehiculos/${id}`);
      
      return {
        success: true,
        message: response.data.message || 'Vehículo eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar el vehículo'
      };
    }
  },

  async getVehicleOwners(vehicleId) {
    try {
      const response = await apiClient.get('/vehiculo-propietarios', {
        params: { vehiculo_id: vehicleId }
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Propietarios obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener propietarios del vehículo:', error);
      return {
        success: false,
        data: { vehiculo: null, propietarios: [] },
        message: error.response?.data?.message || 'Error al obtener los propietarios'
      };
    }
  }
};