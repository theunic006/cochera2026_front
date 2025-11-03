/**
 * ✅ FASE 3 - OPTIMIZACIÓN: ThemeStore con Zustand
 * 
 * Migración de ThemeContext a Zustand para mejor performance.
 * 
 * BENEFICIOS:
 * - ✅ Persistencia automática en localStorage
 * - ✅ Sin re-renders del Provider
 * - ✅ Acceso directo sin Context
 * - ✅ Sincronización entre tabs
 * 
 * @author Sistema de Gestión de Cochera
 * @date 2025-11-03
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { theme } from 'antd';

/**
 * Generar configuración de tema para Ant Design
 * Esta función es pura y no causa re-renders
 */
const generateAntdTheme = (isDarkMode) => ({
  algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    // Colores específicos del tema
    colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
    colorBgElevated: isDarkMode ? '#2d2d2d' : '#ffffff',
    colorBgLayout: isDarkMode ? '#141414' : '#f0f2f5',
    colorText: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
    colorTextSecondary: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
    colorBorder: isDarkMode ? '#434343' : '#d9d9d9',
    boxShadow: isDarkMode 
      ? '0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 9px 28px 8px rgba(0, 0, 0, 0.20)'
      : '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  },
  components: {
    Layout: {
      headerBg: isDarkMode ? '#1f1f1f' : '#ffffff',
      siderBg: isDarkMode ? '#1f1f1f' : '#001529',
      bodyBg: isDarkMode ? '#141414' : '#f0f2f5',
    },
    Menu: {
      darkItemBg: isDarkMode ? '#1f1f1f' : '#001529',
      darkItemSelectedBg: '#1890ff',
    },
    Card: {
      colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
    },
    Table: {
      headerBg: isDarkMode ? '#2d2d2d' : '#fafafa',
      rowHoverBg: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    },
    Modal: {
      contentBg: isDarkMode ? '#1f1f1f' : '#ffffff',
      headerBg: isDarkMode ? '#1f1f1f' : '#ffffff',
    }
  }
});

// Store de tema con Zustand
export const useThemeStore = create(
  devtools(
    persist(
      (set, get) => {
        // ✅ Inicializar tema al crear el store
        const initialIsDarkMode = true;
        const initialTheme = generateAntdTheme(initialIsDarkMode);
        
        return {
          // ==================== ESTADO ====================
          isDarkMode: initialIsDarkMode, // Por defecto tema oscuro
          _antdTheme: initialTheme, // ✅ Cache del tema inicializado

        // ==================== ACCIONES ====================
        
        /**
         * Alternar entre tema claro y oscuro
         */
        toggleTheme: () => {
          set((state) => {
            const newMode = !state.isDarkMode;
            const newTheme = generateAntdTheme(newMode);
            console.log(`🎨 Tema cambiado a: ${newMode ? 'Oscuro' : 'Claro'}`);
            return { 
              isDarkMode: newMode,
              _antdTheme: newTheme // ✅ Actualizar cache
            };
          });
        },

        /**
         * Establecer tema específico
         */
        setTheme: (isDark) => {
          const newTheme = generateAntdTheme(isDark);
          set({ 
            isDarkMode: isDark,
            _antdTheme: newTheme // ✅ Actualizar cache
          });
        },

        /**
         * Obtener configuración de tema para Ant Design
         * Retorna el tema cacheado o genera uno nuevo si no existe
         */
        getAntdTheme: () => {
          const state = get();
          // Si no hay tema cacheado, generar uno nuevo
          if (!state._antdTheme) {
            const newTheme = generateAntdTheme(state.isDarkMode);
            set({ _antdTheme: newTheme });
            return newTheme;
          }
          return state._antdTheme;
        }
        }; // ✅ Cerrar el objeto return
      },
      {
        name: 'theme-storage', // Nombre en localStorage
        partialize: (state) => ({
          isDarkMode: state.isDarkMode
        })
      }
    ),
    {
      name: 'ThemeStore',
      enabled: import.meta.env.DEV
    }
  )
);

// ==================== SELECTORES ====================

/**
 * Selector para obtener el modo del tema
 */
export const selectIsDarkMode = (state) => state.isDarkMode;

/**
 * Selector para obtener el tema de Ant Design
 * ✅ OPTIMIZADO: Retorna el tema cacheado para evitar renders infinitos
 */
export const selectAntdTheme = (state) => {
  // Si no hay tema cacheado, generarlo (solo ocurre en la primera carga)
  if (!state._antdTheme) {
    return generateAntdTheme(state.isDarkMode);
  }
  return state._antdTheme;
};

// ==================== HOOKS CUSTOM ====================

/**
 * Hook personalizado para acceder al theme store
 * Compatible con el antiguo useTheme() de Context API
 * 
 * ⚠️ IMPORTANTE: No incluimos antdTheme aquí para evitar renders infinitos.
 * El tema se debe obtener directamente con getAntdTheme() donde se necesite.
 */
export const useTheme = () => {
  const isDarkMode = useThemeStore(selectIsDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
  };
};

export default useThemeStore;
