import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { roleService } from '../services/roleService';


/**
 * Hook personalizado para gestionar roles
 * 
 * Maneja toda la lógica de:
 * - Fetch de roles con paginación
 * - CRUD operations (Create, Read, Update, Delete)
 * - Estados de loading
 * - Manejo de errores
 * - Estadísticas calculadas
 * 
 * @returns {Object} - Estados y funciones para gestionar roles
 */
export const useRoles = () => {
  // Estados principales
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  /**
   * Cargar roles desde la API
   */
  const fetchRoles = useCallback(async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const response = await roleService.getRoles(page, pageSize);
      
      if (response.success) {
        setRoles(response.data);
        setPagination({
          current: response.pagination?.current_page || page,
          pageSize: response.pagination?.per_page || pageSize,
          total: response.pagination?.total || response.data.length,
        });
      } else {
        message.error('Error al cargar roles');
      }
    } catch (error) {
      message.error(error.message || 'Error al cargar roles');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nuevo rol
   */
  const createRole = useCallback(async (roleData) => {
    try {
      const response = await roleService.createRole(roleData);
      
      if (response.success) {
        message.success('Rol creado exitosamente');
        // Recargar lista
        await fetchRoles(pagination.current, pagination.pageSize);
        return { success: true };
      } else {
        message.error('Error al crear rol');
        return { success: false };
      }
    } catch (error) {
      if (error.type === 'validation' && error.errors) {
        // Retornar errores de validación para el formulario
        return { success: false, errors: error.errors };
      }
      message.error(error.message || 'Error al crear rol');
      return { success: false };
    }
  }, [fetchRoles, pagination.current, pagination.pageSize]);

  /**
   * Actualizar rol existente
   */
  const updateRole = useCallback(async (roleId, roleData) => {
    try {
      const response = await roleService.updateRole(roleId, roleData);
      
      if (response.success) {
        message.success('Rol actualizado exitosamente');
        // Recargar lista
        await fetchRoles(pagination.current, pagination.pageSize);
        return { success: true };
      } else {
        message.error('Error al actualizar rol');
        return { success: false };
      }
    } catch (error) {
      if (error.type === 'validation' && error.errors) {
        return { success: false, errors: error.errors };
      }
      message.error(error.message || 'Error al actualizar rol');
      return { success: false };
    }
  }, [fetchRoles, pagination.current, pagination.pageSize]);

  /**
   * Eliminar rol
   */
  const deleteRole = useCallback(async (roleId, roleName) => {
    try {
      const response = await roleService.deleteRole(roleId);
      
      if (response.success) {
        message.success(`Rol ${roleName || ''} eliminado exitosamente`);
        await fetchRoles(pagination.current, pagination.pageSize);
        return { success: true };
      } else {
        message.error('Error al eliminar rol');
        return { success: false };
      }
    } catch (error) {
      message.error(error.message || 'Error al eliminar rol');
      return { success: false };
    }
  }, [fetchRoles, pagination.current, pagination.pageSize]);

  /**
   * Manejar cambio de página/tamaño
   */
  const handlePageChange = useCallback((page, pageSize) => {
    fetchRoles(page, pageSize);
  }, [fetchRoles]);

  /**
   * Recargar datos
   */
  const refresh = useCallback(() => {
    fetchRoles(pagination.current, pagination.pageSize);
  }, [fetchRoles, pagination.current, pagination.pageSize]);

  // Cargar roles al montar el componente
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Calcular estadísticas
  const stats = {
    total: pagination.total,
    active: roles.filter(role => role.estado_info?.is_active !== false).length,
    inactive: roles.filter(role => role.estado_info?.is_active === false).length,
    totalUsers: roles.reduce((sum, role) => sum + (role.users_count || 0), 0),
  };

  return {
    // Datos
    roles,
    loading,
    pagination,
    stats,
    
    // Acciones CRUD
    createRole,
    updateRole,
    deleteRole,
    
    // Utilidades
    refresh,
    handlePageChange,
  };
};

export default useRoles;
