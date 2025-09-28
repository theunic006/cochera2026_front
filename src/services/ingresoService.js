import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ingresoService = {
  async getIngresos(page = 1, perPage = 15) {
    try {
      const response = await apiClient.get(`/ingresos?page=${page}&per_page=${perPage}`);
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  async getIngresoById(id) {
    try {
      const response = await apiClient.get(`/ingresos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  async createIngreso(data) {
    try {
      const response = await apiClient.post('/ingresos', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  async updateIngreso(id, data) {
    try {
      const response = await apiClient.put(`/ingresos/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  async deleteIngreso(id) {
    try {
      const response = await apiClient.delete(`/ingresos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};
