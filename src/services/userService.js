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

export const userService = {
  /**
   * Obtener todos los usuarios con paginación
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async getUsers(page = 1, perPage = 15) {
    try {
      console.log('Obteniendo usuarios - página:', page, 'por página:', perPage);
      const response = await apiClient.get(`/users?page=${page}&per_page=${perPage}`);
      console.log('Respuesta de usuarios:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener un usuario específico por ID
   * @param {number} id - ID del usuario
   * @returns {Promise} Respuesta de la API
   */
  async getUserById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña
   * @param {string} userData.password_confirmation - Confirmación de contraseña
   * @returns {Promise} Respuesta de la API
   */
  async createUser(userData) {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Actualizar un usuario existente
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @param {string} userData.name - Nombre del usuario (opcional)
   * @param {string} userData.email - Email del usuario (opcional)
   * @param {string} userData.password - Nueva contraseña (opcional)
   * @param {string} userData.password_confirmation - Confirmación de contraseña (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Eliminar un usuario
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise} Respuesta de la API
   */
  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Buscar usuarios por nombre o email
   * @param {string} query - Término de búsqueda
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async searchUsers(query, page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/users/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
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
            message: data.message || 'Usuario no encontrado',
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

export default userService;