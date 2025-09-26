import { createContext, useContext, useState, useEffect } from 'react';
import { theme } from 'antd';

const ThemeContext = createContext();

// Función helper para compatibilidad con Fast Refresh
function useThemeHook() {
  const context = useContext(ThemeContext);
  if (!context) {
    console.error('useTheme llamado fuera de ThemeProvider');
    // Devolver valores por defecto en lugar de lanzar error
    return {
      isDarkMode: true,
      toggleTheme: () => {},
      antdTheme: {
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontSize: 14,
        }
      }
    };
  }
  return context;
}

export const useTheme = useThemeHook;

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Por defecto tema oscuro

  // Cargar el tema guardado al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Guardar el tema cuando cambie
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Configuración del tema para Ant Design
  const antdTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 8,
      fontSize: 14,
      ...(isDarkMode ? {
        colorBgContainer: '#141414',
        colorBgElevated: '#1f1f1f',
        colorBgLayout: '#000000',
        colorBgMask: 'rgba(0, 0, 0, 0.45)',
        colorBorder: '#303030',
        colorText: 'rgba(255, 255, 255, 0.85)',
        colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
        colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
        colorFill: 'rgba(255, 255, 255, 0.18)',
        colorFillSecondary: 'rgba(255, 255, 255, 0.12)',
        colorFillTertiary: 'rgba(255, 255, 255, 0.08)',
      } : {
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBgLayout: '#f5f5f5',
        colorBgMask: 'rgba(0, 0, 0, 0.45)',
        colorBorder: '#d9d9d9',
        colorText: 'rgba(0, 0, 0, 0.88)',
        colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
        colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
        colorFill: 'rgba(0, 0, 0, 0.15)',
        colorFillSecondary: 'rgba(0, 0, 0, 0.06)',
        colorFillTertiary: 'rgba(0, 0, 0, 0.04)',
      })
    },
    components: {
      Layout: {
        // Nuevos tokens v5 - reemplazando los deprecated
        headerBg: isDarkMode ? '#001529' : '#ffffff',
        bodyBg: isDarkMode ? '#141414' : '#f5f5f5',
        triggerBg: isDarkMode ? '#1f1f1f' : '#ffffff',
        siderBg: isDarkMode ? '#001529' : '#ffffff',
      },
      Menu: {
        // Nuevos tokens v5 - reemplazando los deprecated
        itemBg: 'transparent',
        itemSelectedBg: isDarkMode ? '#1f1f1f' : '#e6f4ff',
        itemSelectedColor: isDarkMode ? '#1890ff' : '#1890ff',
        itemHoverBg: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        itemHoverColor: isDarkMode ? '#fff' : '#000',
      },
      Card: {
        colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
      },
      Input: {
        colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
      },
      Button: {
        colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
      }
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
    antdTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};