import axios from 'axios'
import authService from './authService'

/**
 * Servicio para integración con API SUNAT
 * Documentación: https://docs.apisunat.pe/
 * 
 * Configuración:
 * - Ambiente Sandbox: https://app.apisunat.pe/api/test
 * - Ambiente Producción: https://app.apisunat.pe/api
 * 
 * Headers requeridos:
 * - Authorization: Bearer {token}
 * - Content-Type: application/json
 */

// Configuración de ambientes
const ENVIRONMENTS = {
  test: 'https://app.apisunat.pe/api/test',
  production: 'https://app.apisunat.pe/api/v2'
}

// URLs para consultas de DNI/RUC (estas no cambian)
const CONSULTA_URLS = {
  ruc: 'https://dev.apisunat.pe/api/v1/business/ruc',
  dni: 'https://dev.apisunat.pe/api/v1/person/dni'
}

// Obtener ambiente desde localStorage o usar test por defecto
const getCurrentEnv = () => {
  return localStorage.getItem('sunat_environment') || 'test'
}

// Token de API SUNAT por defecto (fallback)
const DEFAULT_TOKEN = '344.wUlqHz28sGiuYodfeqnnSsU7HX45wtLEUMi2IVQvyMa5GUpbc2THOu9zTSb8wJdYgTWybPmLMh7TwoMQeKbljfNKWgvdKUMUObQUFwtGcQ4tGO2Ns5t1fH27'

// Obtener token (prioridad: 1. company.token, 2. localStorage, 3. default)
const getToken = () => {
  // Intentar obtener desde la empresa del usuario logueado
  const companyToken = authService.getSunatToken()
  if (companyToken) {
    return companyToken
  }
  
  // Fallback a localStorage
  const storedToken = localStorage.getItem('sunat_api_token')
  if (storedToken) {
    return storedToken
  }
  
  // Fallback al token por defecto
  return DEFAULT_TOKEN
}

// Instancia de Axios para API SUNAT
const sunatApi = axios.create({
  baseURL: ENVIRONMENTS[getCurrentEnv()],
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60 segundos para operaciones SUNAT
})

// Interceptor para agregar token en cada petición
sunatApi.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
sunatApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error API SUNAT:', error.response.data)
    }
    return Promise.reject(error)
  }
)

const sunatService = {
  // ============================================
  // CONFIGURACIÓN
  // ============================================
  
  /**
   * Configurar el token de API SUNAT
   */
  setToken: (token) => {
    localStorage.setItem('sunat_api_token', token)
  },

  /**
   * Obtener el token actual
   */
  getToken: () => {
    return getToken()
  },

  /**
   * Cambiar ambiente (test/production)
   */
  setEnvironment: (env) => {
    if (ENVIRONMENTS[env]) {
      sunatApi.defaults.baseURL = ENVIRONMENTS[env]
      localStorage.setItem('sunat_environment', env)
    }
  },

  /**
   * Obtener ambiente actual
   */
  getEnvironment: () => {
    return getCurrentEnv()
  },

  // ============================================
  // FACTURACIÓN ELECTRÓNICA
  // ============================================

  /**
   * Emitir Comprobante Genérico (Factura o Boleta)
   * Endpoint: POST /documents
   */
  emitirComprobante: async (comprobanteData) => {
    try {
      console.log('🌐 sunatService.emitirComprobante()')
      console.log('📍 URL:', sunatApi.defaults.baseURL + '/documents')
      console.log('🔑 Token:', getToken() ? 'Bearer ' + getToken().substring(0, 20) + '...' : 'No configurado')
      console.log('📤 Datos enviados a SUNAT:')
      console.log(JSON.stringify(comprobanteData, null, 2))
      
      const response = await sunatApi.post('/documents', comprobanteData)
      
      console.log('✅ Respuesta exitosa de SUNAT:')
      console.log(JSON.stringify(response.data, null, 2))
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Error al emitir comprobante en SUNAT:')
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      console.error('Message:', error.message)
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al emitir comprobante',
        error: error.response?.data
      }
    }
  },

  /**
   * Emitir Factura Electrónica
   * Endpoint: POST /documents
   * Doc: https://docs.apisunat.pe/integracion/facturacion-electronica/factura
   */
  emitirFactura: async (facturaData) => {
    try {
      const response = await sunatApi.post('/documents', {
        documento: 'factura',
        ...facturaData
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al emitir factura',
        error: error.response?.data
      }
    }
  },

  /**
   * Emitir Boleta Electrónica
   * Endpoint: POST /documents
   * Doc: https://docs.apisunat.pe/integracion/facturacion-electronica/boleta
   */
  emitirBoleta: async (boletaData) => {
    try {
      const response = await sunatApi.post('/documents', {
        documento: 'boleta',
        ...boletaData
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al emitir boleta',
        error: error.response?.data
      }
    }
  },

  /**
   * Emitir Nota de Crédito
   * Endpoint: POST /documents
   * Doc: https://docs.apisunat.pe/integracion/facturacion-electronica/nota-de-credito
   */
  emitirNotaCredito: async (notaCreditoData) => {
    try {
      const response = await sunatApi.post('/documents', {
        documento: 'nota_credito',
        ...notaCreditoData
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al emitir nota de crédito',
        error: error.response?.data
      }
    }
  },

  /**
   * Emitir Nota de Débito
   * Endpoint: POST /documents
   * Doc: https://docs.apisunat.pe/integracion/facturacion-electronica/nota-de-debito
   */
  emitirNotaDebito: async (notaDebitoData) => {
    try {
      const response = await sunatApi.post('/documents', {
        documento: 'nota_debito',
        ...notaDebitoData
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al emitir nota de débito',
        error: error.response?.data
      }
    }
  },

  /**
   * Anular Comprobante (Comunicación de Baja)
   * Endpoint: POST /voided
   * Doc: https://docs.apisunat.pe/integracion/facturacion-electronica/anular-comprobante
   * 
   * Nota: Solo se puede anular comprobantes emitidos hasta 3 días atrás
   */
  anularComprobante: async (anulacionData) => {
    try {
      const response = await sunatApi.post('/voided', {
        documento: 'comunicacion_baja',
        ...anulacionData
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al anular comprobante',
        error: error.response?.data
      }
    }
  },

  // ============================================
  // APIS DE APOYO
  // ============================================

  /**
   * Consultar CPE (Comprobante de Pago Electrónico)
   * Endpoint: POST https://api.lucode.pe/v1/invoice-detail
   * Doc: https://docs.apisunat.pe/apis-de-apoyo/consulta-cpe
   * 
   * Permite consultar detalles de cualquier comprobante (no necesita ser de su empresa)
   */
  consultarCPE: async (consultaData) => {
    try {
      const response = await axios.post(
        'https://api.lucode.pe/v1/invoice-detail',
        consultaData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          timeout: 30000
        }
      )
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al consultar CPE',
        error: error.response?.data
      }
    }
  },

  /**
   * Consultar DNI
   * Endpoint: Disponible en APIs de apoyo
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
      // Extraemos el payload que contiene los datos reales
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
   * Endpoint: Disponible en APIs de apoyo
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
      // Extraemos el payload que contiene los datos reales
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
   * Validar CPE
   * Verifica si un comprobante es válido
   */
  validarCPE: async (validacionData) => {
    try {
      const response = await axios.post(
        'https://api.lucode.pe/v1/validate-cpe',
        validacionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          timeout: 15000
        }
      )
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al validar CPE',
        error: error.response?.data
      }
    }
  },

  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================

  /**
   * Construir estructura de Factura Simple
   * Ejemplo basado en: https://docs.apisunat.pe/integracion/facturacion-electronica/factura/ejemplo-factura-simple
   */
  buildFacturaSimple: (data) => {
    return {
      serie: data.serie || 'F001',
      numero: data.numero,
      fecha_de_emision: data.fecha_de_emision || new Date().toISOString().split('T')[0],
      fecha_de_vencimiento: data.fecha_de_vencimiento,
      moneda: data.moneda || 'PEN',
      tipo_operacion: data.tipo_operacion || '0101',
      
      // Datos del cliente
      cliente_tipo_de_documento: data.cliente_tipo_de_documento, // 1=DNI, 6=RUC
      cliente_numero_de_documento: data.cliente_numero_de_documento,
      cliente_denominacion: data.cliente_denominacion,
      cliente_direccion: data.cliente_direccion,
      cliente_email: data.cliente_email,
      
      // Items
      items: data.items.map(item => ({
        unidad_de_medida: item.unidad_de_medida || 'NIU',
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        valor_unitario: item.valor_unitario,
        precio_unitario: item.precio_unitario,
        porcentaje_igv: item.porcentaje_igv || '18',
        codigo_tipo_afectacion_igv: item.codigo_tipo_afectacion_igv || '10',
        descuento: item.descuento || '0'
      })),
      
      // Totales
      total_gravada: data.total_gravada,
      total_igv: data.total_igv,
      total: data.total,
      
      // Opcionales
      ...(data.observaciones && { observaciones: data.observaciones }),
      ...(data.orden_compra && { orden_compra: data.orden_compra })
    }
  },

  /**
   * Construir estructura de Boleta Simple
   */
  buildBoletaSimple: (data) => {
    return {
      serie: data.serie || 'B001',
      numero: data.numero,
      fecha_de_emision: data.fecha_de_emision || new Date().toISOString().split('T')[0],
      fecha_de_vencimiento: data.fecha_de_vencimiento,
      moneda: data.moneda || 'PEN',
      tipo_operacion: data.tipo_operacion || '0101',
      
      // Datos del cliente (DNI principalmente)
      cliente_tipo_de_documento: data.cliente_tipo_de_documento || '1',
      cliente_numero_de_documento: data.cliente_numero_de_documento,
      cliente_denominacion: data.cliente_denominacion,
      cliente_direccion: data.cliente_direccion,
      
      // Items
      items: data.items,
      
      // Totales
      total_gravada: data.total_gravada,
      total_igv: data.total_igv,
      total: data.total
    }
  },

  /**
   * Construir estructura de Nota de Crédito
   */
  buildNotaCredito: (data) => {
    return {
      serie: data.serie || 'F001',
      numero: data.numero,
      fecha_de_emision: data.fecha_de_emision || new Date().toISOString().split('T')[0],
      moneda: data.moneda || 'PEN',
      
      // Datos del cliente
      cliente_tipo_de_documento: data.cliente_tipo_de_documento,
      cliente_numero_de_documento: data.cliente_numero_de_documento,
      cliente_denominacion: data.cliente_denominacion,
      cliente_direccion: data.cliente_direccion,
      
      // Datos de la nota de crédito
      nota_credito_codigo_tipo: data.nota_credito_codigo_tipo, // 01-13
      nota_credito_motivo: data.nota_credito_motivo,
      
      // Documento afectado
      documento_afectado: {
        documento: data.documento_afectado.documento, // 'factura' o 'boleta'
        serie: data.documento_afectado.serie,
        numero: data.documento_afectado.numero
      },
      
      // Items
      items: data.items,
      
      // Totales
      total_gravada: data.total_gravada,
      total_igv: data.total_igv,
      total: data.total
    }
  },

  /**
   * Construir estructura de Nota de Débito
   */
  buildNotaDebito: (data) => {
    return {
      serie: data.serie || 'F001',
      numero: data.numero,
      fecha_de_emision: data.fecha_de_emision || new Date().toISOString().split('T')[0],
      moneda: data.moneda || 'PEN',
      
      // Datos del cliente
      cliente_tipo_de_documento: data.cliente_tipo_de_documento,
      cliente_numero_de_documento: data.cliente_numero_de_documento,
      cliente_denominacion: data.cliente_denominacion,
      cliente_direccion: data.cliente_direccion,
      
      // Datos de la nota de débito
      nota_debito_codigo_tipo: data.nota_debito_codigo_tipo, // 01-03
      nota_debito_motivo: data.nota_debito_motivo,
      
      // Documento afectado
      documento_afectado: {
        documento: data.documento_afectado.documento,
        serie: data.documento_afectado.serie,
        numero: data.documento_afectado.numero
      },
      
      // Items
      items: data.items,
      
      // Totales
      total_gravada: data.total_gravada,
      total_igv: data.total_igv,
      total: data.total
    }
  },

  /**
   * Construir estructura de Anulación
   */
  buildAnulacion: (data) => {
    return {
      motivo: data.motivo || 'ANULACIÓN DE OPERACIÓN',
      documento_afectado: {
        documento: data.documento_afectado.documento, // 'factura', 'boleta'
        serie: data.documento_afectado.serie,
        numero: data.documento_afectado.numero
      }
    }
  },

  // ============================================
  // CÓDIGOS Y CATÁLOGOS SUNAT
  // ============================================

  /**
   * Tipos de documentos de identidad
   */
  TIPOS_DOCUMENTO: {
    DNI: '1',
    RUC: '6',
    CARNET_EXTRANJERIA: '4',
    PASAPORTE: '7',
    CEDULA_DIPLOMATICA: 'A'
  },

  /**
   * Tipos de comprobantes
   */
  TIPOS_COMPROBANTE: {
    FACTURA: '01',
    BOLETA: '03',
    NOTA_CREDITO: '07',
    NOTA_DEBITO: '08'
  },

  /**
   * Códigos de tipo de operación
   */
  TIPOS_OPERACION: {
    VENTA_INTERNA: '0101',
    EXPORTACION: '0200',
    NO_DOMICILIADOS: '0201'
  },

  /**
   * Tipos de afectación IGV
   */
  TIPOS_AFECTACION_IGV: {
    GRAVADO: '10',
    EXONERADO: '20',
    INAFECTO: '30',
    GRATUITO: '35'
  },

  /**
   * Códigos de motivo Nota de Crédito
   */
  MOTIVOS_NOTA_CREDITO: {
    ANULACION: '01',
    ANULACION_ERROR_RUC: '02',
    CORRECCION_ERROR_DESCRIPCION: '03',
    DESCUENTO_GLOBAL: '04',
    DESCUENTO_ITEM: '05',
    DEVOLUCION_TOTAL: '06',
    DEVOLUCION_PARCIAL: '07',
    BONIFICACION: '08',
    DISMINUCION_VALOR: '09'
  },

  /**
   * Códigos de motivo Nota de Débito
   */
  MOTIVOS_NOTA_DEBITO: {
    INTERES_MORA: '01',
    AUMENTO_VALOR: '02',
    PENALIDADES: '03'
  },

  /**
   * Unidades de medida comunes
   */
  UNIDADES_MEDIDA: {
    UNIDAD: 'NIU',
    KILOGRAMO: 'KGM',
    METRO: 'MTR',
    LITRO: 'LTR',
    HORA: 'HUR',
    DIA: 'DAY',
    SERVICIO: 'ZZ'
  },

  /**
   * Monedas
   */
  MONEDAS: {
    SOLES: 'PEN',
    DOLARES: 'USD',
    EUROS: 'EUR'
  }
}

export default sunatService
