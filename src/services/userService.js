import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

export const userService = {
  /**
   * Obtener todos los usuarios con paginación
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async getUsers(page = 1, perPage = 10) {
    try {
      const response = await apiClient.get(`/users?page=${page}&per_page=${perPage}`);
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Buscar usuarios por nombre o email
   * @param {string} query - Término de búsqueda
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async searchUsers(query, page = 1, perPage = 10) {
    try {
      const response = await apiClient.get(`/users/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ...eliminada función handleError, ahora se usa handleApiError global
};

export default userService;