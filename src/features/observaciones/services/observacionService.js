import apiClient from '../../../utils/apiClient';
import { handleApiError } from '../../../utils/apiHelpers';

export const observacionService = {
  async getObservaciones() {
    try {
      const response = await apiClient.get('/observaciones');
      let data = response.data;
      if (data && Array.isArray(data.observaciones)) {
        data = data.observaciones;
      } else if (data && data.data && Array.isArray(data.data)) {
        data = data.data;
      } else if (!Array.isArray(data)) {
        data = [];
      }
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
