import apiClient from '../utils/apiClient';
import { handleApiError } from '../utils/apiHelpers';

export const vehiculoService = {
  async createVehiculo(data) {
    try {
      const response = await apiClient.post('/vehiculos', data);
      // Preservar todos los campos de la respuesta del backend
      return { 
        success: true, 
        data: response.data?.vehiculo || response.data?.data,
        message: response.data?.message,
        comentario: response.data?.comentario,
        ingreso: response.data?.ingreso,
        registro: response.data?.registro
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
};