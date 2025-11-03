/**
 * ✅ FASE 3 - OPTIMIZACIÓN: AuthStore con Zustand
 * 
 * Migración de AuthContext a Zustand para mejor performance
 * y gestión de estado global más eficiente.
 * 
 * BENEFICIOS:
 * - ✅ Sin re-renders innecesarios del Provider
 * - ✅ Acceso directo al estado sin Context
 * - ✅ DevTools para debugging
 * - ✅ Menos boilerplate que Context API
 * - ✅ Mejor performance con selectores
 * 
 * @author Sistema de Gestión de Cochera
 * @date 2025-11-03
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Store de autenticación con Zustand
export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==================== ESTADO ====================
        user: null,
        token: null,
        loading: true,

        // ==================== ACCIONES ====================
        
        /**
         * Inicializar store desde localStorage
         */
        initialize: () => {
          try {
            const savedToken = localStorage.getItem('access_token');
            const savedUser = localStorage.getItem('user');
            
            if (savedToken && savedUser) {
              set({
                token: savedToken,
                user: JSON.parse(savedUser),
                loading: false
              });
            } else {
              set({ loading: false });
            }
          } catch (error) {
            console.error('❌ Error al cargar datos del usuario:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            set({ loading: false });
          }
        },

        /**
         * Login: Guardar usuario y token
         */
        login: (userData, accessToken) => {
          console.log('✅ Login exitoso:', userData.nombre);
          
          set({
            user: userData,
            token: accessToken
          });
          
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('user', JSON.stringify(userData));
        },

        /**
         * Logout: Limpiar estado y localStorage
         */
        logout: () => {
          console.log('👋 Logout ejecutado');
          
          set({
            user: null,
            token: null
          });
          
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        },

        /**
         * Verificar si el usuario está autenticado
         */
        isAuthenticated: () => {
          const { token, user } = get();
          return !!token && !!user;
        },

        /**
         * Actualizar datos del usuario sin cambiar token
         */
        updateUser: (userData) => {
          console.log('🔄 Actualizando usuario:', userData);
          
          set({ user: userData });
          localStorage.setItem('user', JSON.stringify(userData));
        },

        /**
         * Actualizar token sin cambiar usuario
         */
        updateToken: (newToken) => {
          set({ token: newToken });
          localStorage.setItem('access_token', newToken);
        }
      }),
      {
        name: 'auth-storage', // Nombre en localStorage
        // Solo persistir user y token (no loading)
        partialize: (state) => ({
          user: state.user,
          token: state.token
        })
      }
    ),
    {
      name: 'AuthStore', // Nombre en Redux DevTools
      enabled: import.meta.env.DEV // Solo en desarrollo
    }
  )
);

// ==================== SELECTORES ====================
// Selectores optimizados para evitar re-renders

/**
 * Selector para obtener el usuario
 */
export const selectUser = (state) => state.user;

/**
 * Selector para obtener el token
 */
export const selectToken = (state) => state.token;

/**
 * Selector para obtener el estado de loading
 */
export const selectLoading = (state) => state.loading;

/**
 * Selector para obtener si está autenticado
 */
export const selectIsAuthenticated = (state) => state.isAuthenticated();

/**
 * Selector para obtener el rol del usuario
 */
export const selectUserRole = (state) => state.user?.role?.nombre;

/**
 * Selector para obtener la empresa del usuario
 */
export const selectUserCompany = (state) => state.user?.company;

/**
 * Selector para obtener los permisos del usuario
 */
export const selectUserPermissions = (state) => state.user?.role?.permissions || [];

// ==================== HOOKS CUSTOM ====================

/**
 * Hook personalizado para acceder al auth store
 * Compatible con el antiguo useAuth() de Context API
 */
export const useAuth = () => {
  const user = useAuthStore(selectUser);
  const token = useAuthStore(selectToken);
  const loading = useAuthStore(selectLoading);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    updateUser
  };
};

/**
 * Hook para verificar si el usuario tiene un permiso específico
 */
export const useHasPermission = (permissionName) => {
  return useAuthStore((state) => {
    const permissions = state.user?.role?.permissions || [];
    return permissions.some(p => p.nombre === permissionName);
  });
};

/**
 * Hook para verificar si el usuario tiene un rol específico
 */
export const useHasRole = (roleName) => {
  return useAuthStore((state) => {
    return state.user?.role?.nombre === roleName;
  });
};

export default useAuthStore;
