import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/apiHelpers';


export const printerService = {
  // Obtener todas las impresoras disponibles
  getPrinters: async () => {
    try {
      const response = await apiClient.get('/printers');
      return response.data;
      //return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error completo al obtener impresoras:', error);
      throw error;
    }
  }
};

export default printerService;

