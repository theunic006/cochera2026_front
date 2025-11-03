import axios from 'axios'

// URL base para las APIs de facturación
const API_FACTURACION_BASE_URL = 'http://127.0.0.1:8000/apifactura'

const apiFacturacion = axios.create({
  baseURL: API_FACTURACION_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 30000, // 30 segundos
  withCredentials: false // No enviar cookies
})

// Interceptor para agregar token si existe
apiFacturacion.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
apiFacturacion.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta (Facturación):', error.response.data)
      
      // NO redirigir a login desde las APIs de facturación
      // El login se maneja solo desde la API principal
      if (error.response.status === 401) {
        console.warn('API de facturación requiere autenticación. Verifica el token.')
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('Error de red (Facturación):', error.request)
      console.warn('Verifica que el servidor Laravel esté corriendo en http://127.0.0.1:8000')
    } else {
      // Algo pasó al configurar la petición
      console.error('Error (Facturación):', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiFacturacion
