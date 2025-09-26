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

export const ownerService = {
  // 1. GET /api/propietarios - Listar propietarios con paginación y filtros
  async getOwners(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get('/propietarios', {
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
      console.error('Error fetching owners:', error);
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al cargar propietarios'
      };
    }
  },

  // 2. POST /api/propietarios - Crear nuevo propietario
  async createOwner(ownerData) {
    console.log('🔥 ownerService.createOwner llamado con:', ownerData);
    try {
      const response = await apiClient.post('/propietarios', ownerData);
      console.log('🔥 Respuesta del API:', response.data);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Propietario creado exitosamente'
      };
    } catch (error) {
      console.error('🔥 Error creating owner:', error);
      console.log('🔥 Error response:', error.response?.data);
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al crear propietario',
        errors: error.response?.data?.errors || {}
      };
    }
  },

  // 3. GET /api/propietarios/{id} - Ver propietario específico
  async getOwnerById(id) {
    try {
      const response = await apiClient.get(`/propietarios/${id}`);
      
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching owner:', error);
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al cargar propietario'
      };
    }
  },

  // 4. PUT /api/propietarios/{id} - Actualizar propietario existente
  async updateOwner(id, ownerData) {
    try {
      const response = await apiClient.put(`/propietarios/${id}`, ownerData);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Propietario actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error updating owner:', error);
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al actualizar propietario',
        errors: error.response?.data?.errors || {}
      };
    }
  },

  // 5. DELETE /api/propietarios/{id} - Eliminar propietario
  async deleteOwner(id) {
    try {
      const response = await apiClient.delete(`/propietarios/${id}`);
      
      return {
        success: true,
        message: response.data.message || 'Propietario eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error deleting owner:', error);
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al eliminar propietario'
      };
    }
  },

  // Método auxiliar para buscar propietarios
  async searchOwners(searchTerm, searchField = 'nombres') {
    try {
      const response = await apiClient.get('/propietarios', {
        params: { 
          search: searchTerm,
          page: 1,
          per_page: 50
        }
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {
          current_page: 1,
          per_page: 50,
          total: response.data.total || 0
        }
      };
    } catch (error) {
      console.error('Error searching owners:', error);
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Error en la búsqueda'
      };
    }
  }
};