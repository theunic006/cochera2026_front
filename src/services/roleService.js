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

export const roleService = {
  /**
   * Obtener todos los roles con paginación
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async getRoles(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/roles?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener un rol específico por ID
   * @param {number} id - ID del rol
   * @returns {Promise} Respuesta de la API
   */
  async getRoleById(id) {
    try {
      const response = await apiClient.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener rol:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Crear un nuevo rol
   * @param {Object} roleData - Datos del rol
   * @param {string} roleData.descripcion - Nombre del rol
   * @param {string} roleData.estado - Estado del rol: 'activo' o 'suspendido' (opcional, por defecto 'activo')
   * @returns {Promise} Respuesta de la API
   */
  async createRole(roleData) {
    try {
      const response = await apiClient.post('/roles', roleData);
      return response.data;
    } catch (error) {
      console.error('Error al crear rol:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Actualizar un rol existente
   * @param {number} id - ID del rol
   * @param {Object} roleData - Datos a actualizar
   * @param {string} roleData.descripcion - Nombre del rol (opcional)
   * @param {string} roleData.estado - Estado del rol: 'activo' o 'suspendido' (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async updateRole(id, roleData) {
    try {
      const response = await apiClient.put(`/roles/${id}`, roleData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Eliminar un rol
   * @param {number} id - ID del rol a eliminar
   * @returns {Promise} Respuesta de la API
   */
  async deleteRole(id) {
    try {
      const response = await apiClient.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Buscar roles por nombre o descripción
   * @param {string} query - Término de búsqueda
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async searchRoles(query, page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/roles/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar roles:', error);
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
            message: data.message || 'Rol no encontrado',
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

export default roleService;