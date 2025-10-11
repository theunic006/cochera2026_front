import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

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
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ...eliminada función handleError, ahora se usa handleApiError global
};

export default ownerService;
