import axios from 'axios';

// ==============================
// CONFIGURACIÓN BASE
// ==============================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const API_TIMEOUT = 30000; // 30 segundos

// ==============================
// INSTANCIA PRINCIPAL DE AXIOS
// ==============================

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// ==============================
// INTERCEPTOR DE REQUEST
// ==============================

apiClient.interceptors.request.use(
  (config) => {
    // Obtener token de autenticación
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log profesional de request (solo en desarrollo)
    if (import.meta.env.DEV) {
      console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('📍 URL completa:', `${config.baseURL}${config.url}`);
      console.log('📦 Datos:', config.data || 'Sin datos');
      console.log('🔑 Headers:', config.headers);
      console.groupEnd();
    }

    return config;
  },
  (error) => {
    // Log de error en request
    console.error('❌ Error en Request:', error);
    return Promise.reject(error);
  }
);

// ==============================
// INTERCEPTOR DE RESPONSE
// ==============================

apiClient.interceptors.response.use(
  (response) => {
    // Log profesional de response exitoso (solo en desarrollo)
    if (import.meta.env.DEV) {
      console.group(`✅ API Response: ${response.config.url}`);
      console.log('📊 Status:', response.status);
      console.log('📦 Data:', response.data);
      console.log('⏱️ Tiempo:', response.config.metadata?.duration || 'N/A');
      console.groupEnd();
    }

    return response;
  },
  (error) => {
    // Manejo de errores específicos
    if (error.response) {
      const { status, data } = error.response;

      // Log de error profesional
      console.group('❌ API Error Response');
      console.error('📍 URL:', error.config?.url);
      console.error('📊 Status:', status);
      console.error('💬 Mensaje:', data?.message || 'Sin mensaje');
      console.error('📦 Data completa:', data);
      console.groupEnd();

      // Manejo de errores comunes
      switch (status) {
        case 401:
          // Token expirado o inválido
          console.warn('🔒 Sesión expirada. Redirigiendo al login...');
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;

        case 403:
          // Sin permisos
          console.warn('🚫 Acceso denegado. Sin permisos suficientes.');
          break;

        case 404:
          // Recurso no encontrado
          console.warn('🔍 Recurso no encontrado');
          break;

        case 422:
          // Errores de validación
          console.warn('⚠️ Errores de validación:', data.errors);
          break;

        case 500:
          // Error del servidor
          console.error('💥 Error interno del servidor');
          break;

        default:
          console.error('🔥 Error desconocido');
      }
    } else if (error.request) {
      // Request enviado pero sin respuesta
      console.error('📡 Sin respuesta del servidor. Verifica tu conexión.');
    } else {
      // Error al configurar el request
      console.error('⚙️ Error al configurar la petición:', error.message);
    }

    return Promise.reject(error);
  }
);

// ==============================
// INSTANCIA PÚBLICA (SIN AUTH)
// ==============================

export const apiPublicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para logs en instancia pública
apiPublicClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🌐 Public API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en Public Request:', error);
    return Promise.reject(error);
  }
);

// ==============================
// HELPER FUNCTIONS
// ==============================

/**
 * Extrae el mensaje de error de la respuesta de la API
 * @param {Error} error - Error de axios
 * @returns {string} - Mensaje de error formateado
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Error desconocido. Por favor, intenta nuevamente.';
};

/**
 * Verifica si el error es de red (sin conexión)
 * @param {Error} error - Error de axios
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Verifica si el error es de autenticación
 * @param {Error} error - Error de axios
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

// ==============================
// EXPORTACIONES
// ==============================

export default apiClient;
