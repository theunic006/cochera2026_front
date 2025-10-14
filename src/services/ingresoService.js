import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

export const ingresoService = {
  async searchIngresosByPlaca(placa) {
    try {
      // Solicitar hasta 1000 resultados para búsqueda global
      const response = await apiClient.get(`/ingresos?search=${encodeURIComponent(placa)}&per_page=1000`);
      return normalizePaginationResponse(response, 1, response.data?.data?.length || 1000);
    } catch (error) {
      return handleApiError(error);
    }
  },
  async printIngreso(id) {
    try {
      const response = await apiClient.get(`/ingresos/${id}/print`);
      return { success: response.status === 200, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
  async getIngresos(page = 1, perPage = 15, filters = {}) {
    try {
      // Construir query string con filtros adicionales
      let query = `?page=${page}&per_page=${perPage}`;
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      });
      const response = await apiClient.get(`/ingresos${query}`);
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },
  async getIngresoById(id) {
    try {
      const response = await apiClient.get(`/ingresos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
  async createIngreso(data) {
    try {
      const response = await apiClient.post('/ingresos', data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
  async updateIngreso(id, data) {
    try {
      const response = await apiClient.put(`/ingresos/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
  async deleteIngreso(id, data) {
    try {
      // axios permite enviar body en delete usando el segundo argumento como config
      const response = await apiClient.delete(`/ingresos/${id}`, { data });
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
