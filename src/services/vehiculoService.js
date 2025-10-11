
import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/apiHelpers';

export const vehiculoService = {
  async createVehiculo(data) {
    try {
      const response = await apiClient.post('/vehiculos', data);
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
