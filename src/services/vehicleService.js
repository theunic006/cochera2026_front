import apiClient from '../utils/apiClient';
import { handleApiError, normalizePaginationResponse } from '../utils/apiHelpers';
export const vehicleService = {
  async getVehicles(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get('/vehiculos', {
        params: { page, per_page: perPage }
      });
      return normalizePaginationResponse(response, page, perPage);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createVehicle(vehicleData) {
    try {
      const response = await apiClient.post('/vehiculos', vehicleData);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getVehicleById(id) {
    try {
      const response = await apiClient.get(`/vehiculos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateVehicle(id, vehicleData) {
    try {
      const response = await apiClient.put(`/vehiculos/${id}`, vehicleData);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteVehicle(id) {
    try {
      const response = await apiClient.delete(`/vehiculos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getVehicleOwners(vehicleId) {
    try {
      const response = await apiClient.get('/vehiculo-propietarios', {
        params: { vehiculo_id: vehicleId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
};