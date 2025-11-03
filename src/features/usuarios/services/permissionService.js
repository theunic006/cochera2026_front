import axios from '../../../utils/axios';

export const permissionService = {
  /**
   * Obtener todos los permisos disponibles
   */
  getAllPermissions: async () => {
    try {
      const response = await axios.get('/permissions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener permisos' };
    }
  },

  /**
   * Obtener permisos de un usuario específico
   */
  getUserPermissions: async (userId) => {
    try {
      const response = await axios.get(`/permissions/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener permisos del usuario' };
    }
  },

  /**
   * Asignar permisos a un usuario
   * @param {number} userId - ID del usuario
   * @param {array} permissionIds - Array de IDs de permisos [1, 2, 3, 4, 5, 14, 15, 16, 17]
   */
  assignPermissions: async (userId, permissionIds) => {
    try {
      const response = await axios.post(`/permissions/users/${userId}/assign`, {
        permission_ids: permissionIds
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al asignar permisos' };
    }
  }
};

