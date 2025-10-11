import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';

export const vehicleTypeService = {
  async getVehicleTypes(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get('/tipo-vehiculos', {
        params: { page, per_page: perPage }
      });
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createVehicleType(vehicleTypeData) {
    try {
      const response = await apiClient.post('/tipo-vehiculos', vehicleTypeData);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getVehicleTypeById(id) {
    try {
      const response = await apiClient.get(`/tipo-vehiculos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateVehicleType(id, vehicleTypeData) {
    try {
      const response = await apiClient.put(`/tipo-vehiculos/${id}`, vehicleTypeData);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteVehicleType(id) {
    try {
      const response = await apiClient.delete(`/tipo-vehiculos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getAllVehicleTypes() {
    try {
      const response = await apiClient.get('/tipo-vehiculos', {
        params: { per_page: 1000 }
      });
      const items = response?.data?.data ?? [];
      return { success: true, data: items };
    } catch (error) {
      return handleApiError(error);
    }
  }
};