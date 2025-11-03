import axios from 'axios'

/**
 * Servicio para integración con API SUNAT (PRODUCCIÓN)
 * Consulta de DNI, RUC y emisión de comprobantes electrónicos
 */

// URL PRODUCCIÓN  = v2  // SUNAT DESARROLLO = TEST
const SUNAT_API_URL = 'https://app.apisunat.pe/api/test'

// URLs para consultas de DNI/RUC
const CONSULTA_URLS = {
  ruc: 'https://dev.apisunat.pe/api/v1/business/ruc',
  dni: 'https://dev.apisunat.pe/api/v1/person/dni'
}

// Token de API SUNAT
const DEFAULT_TOKEN = '344.wUlqHz28sGiuYodfeqnnSsU7HX45wtLEUMi2IVQvyMa5GUpbc2THOu9zTSb8wJdYgTWybPmLMh7TwoMQeKbljfNKWgvdKUMUObQUFwtGcQ4tGO2Ns5t1fH27'

// Obtener token
const getToken = () => {
  return localStorage.getItem('sunat_api_token') || DEFAULT_TOKEN
}

const sunatService = {
  /**
   * Consultar DNI
   * Permite obtener datos de una persona por su DNI
   */
  consultarDNI: async (dni) => {
    try {
      const response = await axios.get(
        `${CONSULTA_URLS.dni}/${dni}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
          timeout: 15000
        }
      )
      
      // La API retorna { success, message, payload }
      const data = response.data.payload || response.data.data || response.data
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al consultar DNI',
        error: error.response?.data
      }
    }
  },

  /**
   * Consultar RUC
   * Permite obtener datos de una empresa por su RUC
   */
  consultarRUC: async (ruc) => {
    try {
      const response = await axios.get(
        `${CONSULTA_URLS.ruc}/${ruc}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
          timeout: 15000
        }
      )
      
      // La API retorna { success, message, payload }
      const data = response.data.payload || response.data.data || response.data
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al consultar RUC',
        error: error.response?.data
      }
    }
  },

  /**
   * Emitir Comprobante Electrónico (Factura o Boleta) - PRODUCCIÓN
   * @param {Object} comprobanteData - Datos del comprobante
   * @returns {Promise<Object>} Respuesta de SUNAT
   */
  emitirComprobante: async (comprobanteData) => {
    try {
      console.log('🌐 Enviando comprobante a SUNAT PRODUCCIÓN...')
      console.log('📍 URL:', SUNAT_API_URL + '/documents')
      console.log(' Datos:', JSON.stringify(comprobanteData, null, 2))
      
      const response = await axios.post(
        `${SUNAT_API_URL}/documents`,
        comprobanteData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          timeout: 60000
        }
      )
      
      console.log('✅ Respuesta SUNAT:', response.data)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Error SUNAT:', error.response?.status, error.response?.data)
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al emitir comprobante',
        error: error.response?.data
      }
    }
  }
}

export default sunatService
