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

// Interceptor para agregar token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token enviado para empresas:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.warn('No se encontró token de acceso para empresas');
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

export const companyService = {
  /**
   * Obtener todas las empresas con paginación
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async getCompanies(page = 1, perPage = 15) {
    try {
      console.log('CompanyService: Obteniendo empresas...');
      const response = await apiClient.get('/companies', {
        params: { page, per_page: perPage }
      });
      console.log('CompanyService: Respuesta cruda:', response);
      return response.data;
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener una empresa por ID
   * @param {number} id - ID de la empresa
   * @returns {Promise} Respuesta de la API
   */
  async getCompanyById(id) {
    try {
      const response = await apiClient.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener empresa:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Crear una nueva empresa
   * @param {Object} companyData - Datos de la empresa
   * @param {string} companyData.nombre - Nombre de la empresa
   * @param {string} companyData.ubicacion - Ubicación de la empresa
   * @param {string} companyData.descripcion - Descripción de la empresa (opcional)
   * @param {string} companyData.estado - Estado de la empresa: 'activo' o 'suspendido' (opcional, por defecto 'activo')
   * @returns {Promise} Respuesta de la API
   */
  async createCompany(companyData) {
    try {
      const response = await apiClient.post('/companies', companyData);
      return response.data;
    } catch (error) {
      console.error('Error al crear empresa:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Actualizar una empresa existente
   * @param {number} id - ID de la empresa
   * @param {Object} companyData - Datos a actualizar
   * @param {string} companyData.nombre - Nombre de la empresa (opcional)
   * @param {string} companyData.ubicacion - Ubicación de la empresa (opcional)
   * @param {string} companyData.descripcion - Descripción de la empresa (opcional)
   * @param {string} companyData.estado - Estado de la empresa: 'activo' o 'suspendido' (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async updateCompany(id, companyData) {
    try {
      const response = await apiClient.put(`/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Eliminar una empresa
   * @param {number} id - ID de la empresa
   * @returns {Promise} Respuesta de la API
   */
  async deleteCompany(id) {
    try {
      const response = await apiClient.delete(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar empresa:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Buscar empresas por término de búsqueda
   * @param {string} searchTerm - Término de búsqueda
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async searchCompanies(searchTerm, page = 1, perPage = 15) {
    try {
      const response = await apiClient.get('/companies/search', {
        params: { 
          q: searchTerm,
          page, 
          per_page: perPage 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar empresas:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener estados disponibles
   * @returns {Promise} Lista de estados disponibles
   */
  async getStatuses() {
    try {
      const response = await apiClient.get('/companies/statuses');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estados:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Filtrar empresas por estado
   * @param {string} status - Estado a filtrar
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async getCompaniesByStatus(status, page = 1, perPage = 15) {
    try {
      const response = await apiClient.get('/companies/by-status', {
        params: { 
          status,
          page, 
          per_page: perPage 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al filtrar empresas por estado:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Activar una empresa
   * @param {number} id - ID de la empresa
   * @returns {Promise} Respuesta de la API
   */
  async activateCompany(id) {
    try {
      const response = await apiClient.patch(`/companies/${id}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error al activar empresa:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Suspender una empresa
   * @param {number} id - ID de la empresa
   * @returns {Promise} Respuesta de la API
   */
  async suspendCompany(id) {
    try {
      const response = await apiClient.patch(`/companies/${id}/suspend`);
      return response.data;
    } catch (error) {
      console.error('Error al suspender empresa:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Cambiar estado de una empresa
   * @param {number} id - ID de la empresa
   * @param {string} status - Nuevo estado
   * @returns {Promise} Respuesta de la API
   */
  async changeCompanyStatus(id, status) {
    try {
      const response = await apiClient.patch(`/companies/${id}/change-status`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado de empresa:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Manejar errores de la API
   * @param {Object} error - Error de axios
   * @returns {Object} Error formateado
   */
  handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      
      if (status === 422 && data.errors) {
        // Errores de validación
        return {
          type: 'validation',
          errors: data.errors,
          message: data.message || 'Errores de validación'
        };
      }
      
      if (status === 401) {
        return {
          type: 'auth',
          message: 'No tienes autorización para realizar esta acción'
        };
      }
      
      if (status === 404) {
        return {
          type: 'not_found',
          message: 'Empresa no encontrada'
        };
      }
      
      return {
        type: 'server',
        message: data.message || `Error del servidor (${status})`
      };
    }
    
    if (error.request) {
      // Error de red o conexión
      return {
        type: 'network',
        message: 'Error de conexión. Verifica tu conexión a internet.'
      };
    }
    
    // Error desconocido
    return {
      type: 'unknown',
      message: error.message || 'Error desconocido'
    };
  }
};