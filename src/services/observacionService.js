import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/apiHelpers';

export const observacionService = {
  async getObservaciones() {
    try {
      const response = await apiClient.get('/observaciones');
      // Adaptar según la estructura real
      let data = response.data;
      // Si la respuesta tiene una propiedad 'observaciones', usarla
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

export default observacionService;
