import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/apiHelpers';

export const observacionService = {
  async getObservaciones() {
    try {
      const response = await apiClient.get('/observaciones');
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default observacionService;
