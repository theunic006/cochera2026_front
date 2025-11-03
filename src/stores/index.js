/**
 * ✅ FASE 3 - OPTIMIZACIÓN: Barrel export para Zustand Stores
 * 
 * Exportaciones centralizadas de todos los stores.
 * 
 * @author Sistema de Gestión de Cochera
 * @date 2025-11-03
 */

// Auth Store
export {
  useAuthStore,
  useAuth,
  useHasPermission,
  useHasRole,
  selectUser,
  selectToken,
  selectLoading,
  selectIsAuthenticated,
  selectUserRole,
  selectUserCompany,
  selectUserPermissions
} from './authStore';

// Theme Store
export {
  useThemeStore,
  useTheme,
  selectIsDarkMode,
  selectAntdTheme
} from './themeStore';
