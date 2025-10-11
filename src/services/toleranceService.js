import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

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
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },
    /**
   * Obtener tolerancia por empresa
   * @param {number} id_empresa - ID de la empresa
   * @returns {Promise} Respuesta de la API
   */
  async getToleranceByEmpresa(id_empresa) {
    try {
      const response = await apiClient.get(`/tolerancias/by-empresa?id_empresa=${id_empresa}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ...eliminada función handleError, ahora se usa handleApiError global
};