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

export const toleranceService = {
  /**
   * Obtener todas las tolerancias con paginación
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async getTolerances(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/tolerancias?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tolerancias:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener una tolerancia específica por ID
   * @param {number} id - ID de la tolerancia
   * @returns {Promise} Respuesta de la API
   */
  async getToleranceById(id) {
    try {
      const response = await apiClient.get(`/tolerancias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tolerancia:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Crear una nueva tolerancia
   * @param {Object} toleranceData - Datos de la tolerancia
   * @returns {Promise} Respuesta de la API
   */
  async createTolerance(toleranceData) {
    try {
      const response = await apiClient.post('/tolerancias', toleranceData);
      return response.data;
    } catch (error) {
      console.error('Error al crear tolerancia:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Actualizar una tolerancia existente
   * @param {number} id - ID de la tolerancia
   * @param {Object} toleranceData - Datos actualizados
   * @returns {Promise} Respuesta de la API
   */
  async updateTolerance(id, toleranceData) {
    try {
      const response = await apiClient.put(`/tolerancias/${id}`, toleranceData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar tolerancia:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Eliminar una tolerancia
   * @param {number} id - ID de la tolerancia
   * @returns {Promise} Respuesta de la API
   */
  async deleteTolerance(id) {
    try {
      const response = await apiClient.delete(`/tolerancias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar tolerancia:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Buscar tolerancias
   * @param {string} query - Término de búsqueda
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async searchTolerances(query, page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/tolerancias/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar tolerancias:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Manejo centralizado de errores
   * @param {Object} error - Error de axios
   * @returns {Object} Error formateado
   */
  handleError(error) {
    if (error.response) {
      // El servidor respondió con un código de estado de error
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return {
            type: 'validation',
            message: data.message || 'Datos inválidos',
            errors: data.errors || {}
          };
        case 401:
          return {
            type: 'auth',
            message: 'No autorizado. Por favor, inicia sesión nuevamente.'
          };
        case 403:
          return {
            type: 'forbidden',
            message: 'No tienes permisos para realizar esta acción.'
          };
        case 404:
          return {
            type: 'not_found',
            message: 'Tolerancia no encontrada.'
          };
        case 422:
          return {
            type: 'validation',
            message: data.message || 'Errores de validación',
            errors: data.errors || {}
          };
        case 500:
          return {
            type: 'server',
            message: 'Error interno del servidor. Inténtalo más tarde.'
          };
        default:
          return {
            type: 'unknown',
            message: data.message || 'Ha ocurrido un error inesperado.'
          };
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      return {
        type: 'network',
        message: 'Error de conexión. Verifica tu conexión a internet.'
      };
    } else {
      // Algo pasó al configurar la petición
      return {
        type: 'unknown',
        message: error.message || 'Error desconocido'
      };
    }
  }
};