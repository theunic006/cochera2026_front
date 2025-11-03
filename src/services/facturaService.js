import apiFacturacion from '../utils/apiFacturacion';


const facturaService = {
  /**
   * Obtener todas las series disponibles
   * @returns {Promise} Lista de series
   */
  getSeries: async () => {
    try {
      console.log('📊 Obteniendo series desde /apifactura/series...')
      const response = await apiFacturacion.get('/series')
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Error al obtener series:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener series',
        error: error.response?.data
      }
    }
  },

  /**
   * Obtener una serie específica por ID
   * @param {number} id - ID de la serie
   * @returns {Promise} Datos de la serie
   */
  getSerieById: async (id) => {
    try {
      const response = await apiFacturacion.get(`/series/${id}`)
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener serie',
        error: error.response?.data
      }
    }
  },

  /**
   * Actualizar el correlativo de una serie
   * @param {number} id - ID de la serie
   * @param {number} correlativo_actual - Nuevo correlativo
   * @returns {Promise} Resultado de la actualización
   */
  actualizarCorrelativo: async (id, correlativo_actual) => {
    try {
      console.log('🔄 Actualizando correlativo:', { id, correlativo_actual })
      const response = await apiFacturacion.put(`/series/${id}`, {
        correlativo_actual: correlativo_actual
      })
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Error al actualizar correlativo:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar correlativo',
        error: error.response?.data
      }
    }
  },

  /**
   * Guardar comprobante en la base de datos local
   * @param {Object} comprobanteData - Datos del comprobante
   * @returns {Promise} Resultado del guardado
   */
  guardarComprobante: async (comprobanteData) => {
    try {
      console.log('💾 Guardando comprobante en BD...', comprobanteData)
      const response = await apiFacturacion.post('/comprobantes', comprobanteData)
      console.log('✅ Comprobante guardado:', response.data)
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Error al guardar comprobante:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al guardar comprobante',
        error: error.response?.data
      }
    }
  },

  /**
   * Obtener todos los comprobantes
   * @param {Object} params - Parámetros de filtrado (fecha, tipo, etc)
   * @returns {Promise} Lista de comprobantes
   */
  getComprobantes: async (params = {}) => {
    try {
      const response = await apiFacturacion.get('/comprobantes', { params })
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener comprobantes',
        error: error.response?.data
      }
    }
  },

  /**
   * Obtener un comprobante específico por ID
   * @param {number} id - ID del comprobante
   * @returns {Promise} Datos del comprobante
   */
  getComprobanteById: async (id) => {
    try {
      const response = await apiFacturacion.get(`/comprobantes/${id}`)
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener comprobante',
        error: error.response?.data
      }
    }
  },

  /**
   * Anular un comprobante
   * @param {number} id - ID del comprobante
   * @param {string} motivo - Motivo de anulación
   * @returns {Promise} Resultado de la anulación
   */
  anularComprobante: async (id, motivo) => {
    try {
      const response = await apiFacturacion.post(`/comprobantes/${id}/anular`, {
        motivo: motivo
      })
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al anular comprobante',
        error: error.response?.data
      }
    }
  },

  /**
   * Buscar cliente por número de documento en BD local
   * @param {string} numeroDocumento - Número de RUC o DNI
   * @returns {Promise} Datos del cliente si existe
   */
  buscarClientePorDocumento: async (numeroDocumento) => {
    try {
      console.log('🔍 Buscando cliente en BD local:', numeroDocumento)
      
      // Intentar con POST primero
      let response
      try {
        response = await apiFacturacion.post('/clientes/buscar-documento', {
          numero_documento: numeroDocumento
        })
      } catch (postError) {
        // Si falla por CSRF (419), intentar con GET
        if (postError.response?.status === 419) {
          console.log('⚠️ Error CSRF, intentando con GET...')
          response = await apiFacturacion.get('/clientes/buscar-documento', {
            params: { numero_documento: numeroDocumento }
          })
        } else {
          throw postError
        }
      }

      console.log('✅ Respuesta BD local:', response.data)
      
      if (response.data && response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data
        }
      } else {
        return {
          success: false,
          message: 'Cliente no encontrado en BD local'
        }
      }
    } catch (error) {
      console.log('⚠️ Error al buscar en BD local:', error.response?.data?.message || error.message)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al buscar cliente',
        error: error.response?.data
      }
    }
  },

  /**
   * Guardar nuevo cliente en BD local
   * @param {Object} clienteData - Datos del cliente
   * @returns {Promise} Resultado de la operación
   */
  guardarCliente: async (clienteData) => {
    try {
      console.log('💾 Guardando cliente en BD local:', clienteData)
      const response = await apiFacturacion.post('/clientes', clienteData)
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Error al guardar cliente:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al guardar cliente',
        error: error.response?.data
      }
    }
  }
}

export default facturaService
