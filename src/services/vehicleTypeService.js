import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token JWT en todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const vehicleTypeService = {
  // Obtener todos los tipos de vehículos con paginación
  getVehicleTypes: async (page = 1, limit = 15, search = '') => {
    try {
      const params = {
        page,
        limit,
        ...(search && { search })
      };
      
      const response = await apiClient.get('/tipo-vehiculos', { params });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {
          current: page,
          total: response.data.total || 0,
          pageSize: limit
        },
        message: 'Tipos de vehículos obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener tipos de vehículos:', error);
      return {
        success: false,
        data: [],
        pagination: { current: 1, total: 0, pageSize: limit },
        message: error.response?.data?.message || 'Error al obtener los tipos de vehículos'
      };
    }
  },

  // Obtener todos los tipos de vehículos sin paginación (para selects)
  getAllVehicleTypes: async () => {
    try {
      const response = await apiClient.get('/tipo-vehiculos');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Tipos de vehículos obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener tipos de vehículos:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener los tipos de vehículos'
      };
    }
  },

  // Crear nuevo tipo de vehículo
  createVehicleType: async (vehicleTypeData) => {
    try {
      const response = await apiClient.post('/tipo-vehiculos', vehicleTypeData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Tipo de vehículo creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear tipo de vehículo:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el tipo de vehículo';
      const errorDetails = error.response?.data?.errors || {};
      
      return {
        success: false,
        message: errorMessage,
        errors: errorDetails,
        type: error.response?.status === 422 ? 'validation' : 'server'
      };
    }
  },

  // Obtener tipo de vehículo por ID
  getVehicleTypeById: async (id) => {
    try {
      const response = await apiClient.get(`/tipo-vehiculos/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Tipo de vehículo obtenido exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener tipo de vehículo:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener el tipo de vehículo'
      };
    }
  },

  // Actualizar tipo de vehículo
  updateVehicleType: async (id, vehicleTypeData) => {
    try {
      const response = await apiClient.put(`/tipo-vehiculos/${id}`, vehicleTypeData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Tipo de vehículo actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar tipo de vehículo:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el tipo de vehículo';
      const errorDetails = error.response?.data?.errors || {};
      
      return {
        success: false,
        message: errorMessage,
        errors: errorDetails,
        type: error.response?.status === 422 ? 'validation' : 'server'
      };
    }
  },

  // Eliminar tipo de vehículo
  deleteVehicleType: async (id) => {
    try {
      const response = await apiClient.delete(`/tipo-vehiculos/${id}`);
      return {
        success: true,
        message: response.data.message || 'Tipo de vehículo eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar tipo de vehículo:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar el tipo de vehículo'
      };
    }
  },

  // Buscar tipos de vehículos por nombre
  searchVehicleTypes: async (query) => {
    try {
      const response = await apiClient.get('/tipo-vehiculos/search', {
        params: { query }
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Búsqueda completada exitosamente'
      };
    } catch (error) {
      console.error('Error en búsqueda de tipos de vehículos:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error en la búsqueda'
      };
    }
  },

  // Obtener tipos de vehículos con valor definido
  getVehicleTypesWithValue: async () => {
    try {
      const response = await apiClient.get('/tipo-vehiculos/con-valor');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Tipos de vehículos con valor obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener tipos de vehículos con valor:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener los tipos de vehículos'
      };
    }
  },

  // Filtrar tipos de vehículos por rango de valor
  getVehicleTypesByValueRange: async (minValue, maxValue) => {
    try {
      const response = await apiClient.get('/tipo-vehiculos/rango-valor', {
        params: { min_valor: minValue, max_valor: maxValue }
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Tipos de vehículos filtrados exitosamente'
      };
    } catch (error) {
      console.error('Error al filtrar tipos de vehículos por valor:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al filtrar los tipos de vehículos'
      };
    }
  },
};