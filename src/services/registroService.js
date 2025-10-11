import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

export const registroService = {
  async getRegistros(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get('/registros', {
        params: { page, per_page: perPage }
      });
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },
  async createRegistro(data) {
    try {
      const response = await apiClient.post('/registros', data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
  async getRegistroById(id) {
    try {
      const response = await apiClient.get(`/registros/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
  async updateRegistro(id, data) {
    try {
      const response = await apiClient.put(`/registros/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
  async deleteRegistro(id) {
    try {
      const response = await apiClient.delete(`/registros/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
};
