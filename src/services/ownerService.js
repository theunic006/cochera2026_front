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
      console.log('Token enviado:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.warn('No se encontró token de acceso');
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

export const ownerService = {
  /**
   * Obtener todos los propietarios con paginación
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async getOwners(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/propietarios?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener propietarios:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener un propietario específico por ID
   * @param {number} id - ID del propietario
   * @returns {Promise} Respuesta de la API
   */
  async getOwnerById(id) {
    try {
      const response = await apiClient.get(`/propietarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener propietario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Crear un nuevo propietario
   * @param {Object} ownerData - Datos del propietario
   * @param {string} ownerData.nombres - Nombres del propietario
   * @param {string} ownerData.apellidos - Apellidos del propietario
   * @param {string} ownerData.documento - Documento del propietario
   * @param {string} ownerData.telefono - Teléfono del propietario
   * @param {string} ownerData.email - Email del propietario
   * @param {string} ownerData.direccion - Dirección del propietario
   * @returns {Promise} Respuesta de la API
   */
  async createOwner(ownerData) {
    try {
      const response = await apiClient.post('/propietarios', ownerData);
      return response.data;
    } catch (error) {
      console.error('Error al crear propietario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Actualizar un propietario existente
   * @param {number} id - ID del propietario
   * @param {Object} ownerData - Datos a actualizar
   * @param {string} ownerData.nombres - Nombres del propietario (opcional)
   * @param {string} ownerData.apellidos - Apellidos del propietario (opcional)
   * @param {string} ownerData.documento - Documento del propietario (opcional)
   * @param {string} ownerData.telefono - Teléfono del propietario (opcional)
   * @param {string} ownerData.email - Email del propietario (opcional)
   * @param {string} ownerData.direccion - Dirección del propietario (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async updateOwner(id, ownerData) {
    try {
      const response = await apiClient.put(`/propietarios/${id}`, ownerData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar propietario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Eliminar un propietario
   * @param {number} id - ID del propietario a eliminar
   * @returns {Promise} Respuesta de la API
   */
  async deleteOwner(id) {
    try {
      const response = await apiClient.delete(`/propietarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar propietario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Buscar propietarios por nombre, apellido, documento o email
   * @param {string} query - Término de búsqueda
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async searchOwners(query, page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/propietarios/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar propietarios:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener vehículos de un propietario específico
   * @param {number} propietarioId - ID del propietario
   * @returns {Promise} Respuesta de la API
   */
  async getOwnerVehicles(propietarioId) {
    try {
      const response = await apiClient.get(`/vehiculo-propietarios?propietario_id=${propietarioId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículos del propietario:', error);
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
      // El servidor respondió con un código de estado de error
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return {
            type: 'validation',
            message: data.message || 'Parámetros incorrectos',
            errors: data.errors || {},
          };
        case 404:
          return {
            type: 'not_found',
            message: data.message || 'Propietario no encontrado',
          };
        case 422:
          return {
            type: 'validation',
            message: data.message || 'Errores de validación',
            errors: data.errors || {},
          };
        case 500:
          return {
            type: 'server_error',
            message: 'Error interno del servidor. Inténtalo más tarde.',
          };
        default:
          return {
            type: 'unknown',
            message: data.message || 'Ha ocurrido un error inesperado',
          };
      }
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      return {
        type: 'network',
        message: 'Error de conexión. Verifica tu conexión a internet.',
      };
    } else {
      // Algo pasó al configurar la petición
      return {
        type: 'unknown',
        message: 'Ha ocurrido un error inesperado',
      };
    }
  },
};

export default ownerService;
