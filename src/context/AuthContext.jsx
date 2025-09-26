import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Función helper para compatibilidad con Fast Refresh
function useAuthHook() {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth llamado fuera de AuthProvider');
    // Devolver valores por defecto en lugar de lanzar error
    return {
      user: null,
      token: null,
      loading: false,
      login: () => {},
      logout: () => {},
      isAuthenticated: () => false
    };
  }
  return context;
}

export const useAuth = useAuthHook;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay datos guardados al cargar la aplicación
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};