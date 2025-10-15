
import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

export const companyService = {
  /**
   * Obtener todas las empresas con paginación
   * @param {number} page - Número de página (opcional)
   * @param {number} perPage - Elementos por página (opcional)
   * @returns {Promise} Respuesta de la API
   */
  async getCompanies(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get('/companies', {
        params: { page, per_page: perPage }
      });
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
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
      let config = {};
      if (companyData instanceof FormData) {
        config = { headers: { ...apiClient.defaults.headers, 'Content-Type': undefined } };
      }
      const response = await apiClient.post('/companies', companyData, config);
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
      let config = {};
      if (companyData instanceof FormData) {
        config = { headers: { ...apiClient.defaults.headers, 'Content-Type': undefined } };
      }
      const response = await apiClient.post(`/companies/${id}?_method=PUT`, companyData, config);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener estados disponibles
   * @returns {Promise} Lista de estados disponibles
   */
  async getStatuses() {
    try {
      const response = await apiClient.get('/companies/statuses');
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
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
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Actualizar configuración de impresoras de una empresa
   * @param {number} id - ID de la empresa
   * @param {Object} printerConfig - Configuración de impresoras
   * @param {string} printerConfig.imp_input - Impresora de entrada
   * @param {string} printerConfig.imp_output - Impresora de salida
   * @returns {Promise} Respuesta de la API
   */
  async updatePrinters(id, printerConfig) {
    try {
      const response = await apiClient.put(`/companies/${id}`, printerConfig);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Registrar nueva empresa con usuario administrador (público, sin autenticación)
   * @param {FormData} formData - Datos de la empresa y administrador
   * @returns {Promise} Respuesta de la API
   */
  async registerCompany(formData) {
    try {
      // Usar axiosPublicInstance en lugar de apiClient para no requerir autenticación
      const { axiosPublicInstance } = await import('../utils/axios');
      const response = await axiosPublicInstance.post('/companies/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // ...eliminada función handleError, ahora se usa handleApiError global
};