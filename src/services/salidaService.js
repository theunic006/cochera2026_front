import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

export const salidaService = {
  async getSalidas(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/salidas?page=${page}&per_page=${perPage}`);
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },
  async searchSalidas(query, page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/salidas/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },
  async getSalidaById(id) {
    try {
      const response = await apiClient.get(`/salidas/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
  // ...eliminada función handleError, ahora se usa handleApiError global
};

export default salidaService;
