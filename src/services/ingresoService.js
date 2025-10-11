import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

export const ingresoService = {
  async getIngresos(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/ingresos?page=${page}&per_page=${perPage}`);
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
