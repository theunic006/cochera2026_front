import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

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
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ...eliminada función handleError, ahora se usa handleApiError global
};

export default roleService;