// ==============================
// TIPOS DE PAGO
// ==============================

export const PAYMENT_TYPES = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  YAPE: 'Yape',
  PLIN: 'Plin',
  TRANSFERENCIA: 'Transferencia'
};

export const PAYMENT_TYPE_VALUES = Object.values(PAYMENT_TYPES);

// ==============================
// ESTADOS DE INGRESO
// ==============================

export const INGRESO_STATUS = {
  ACTIVO: 'activo',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado'
};

// ==============================
// TIPOS DE COMPROBANTE SUNAT
// ==============================

export const COMPROBANTE_TYPES = {
  FACTURA: '01',
  BOLETA: '03',
  NOTA_CREDITO: '07',
  NOTA_DEBITO: '08'
};

export const COMPROBANTE_LABELS = {
  '01': 'Factura',
  '03': 'Boleta de Venta',
  '07': 'Nota de Crédito',
  '08': 'Nota de Débito'
};

// ==============================
// TIPOS DE DOCUMENTO DE IDENTIDAD
// ==============================

export const DOCUMENT_TYPES = {
  DNI: '1',
  RUC: '6',
  CARNET_EXTRANJERIA: '4',
  PASAPORTE: '7'
};

export const DOCUMENT_LABELS = {
  '1': 'DNI',
  '6': 'RUC',
  '4': 'Carnet de Extranjería',
  '7': 'Pasaporte'
};

// ==============================
// ROLES DE USUARIO
// ==============================

export const USER_ROLES = {
  ADMIN: 'Administrador',
  OPERADOR: 'Operador',
  SUPERVISOR: 'Supervisor',
  GERENTE: 'Gerente'
};

// ==============================
// ESTADOS DE VEHÍCULO
// ==============================

export const VEHICLE_STATUS = {
  DISPONIBLE: 'disponible',
  EN_COCHERA: 'en_cochera',
  MANTENIMIENTO: 'mantenimiento'
};

// ==============================
// FORMATOS DE FECHA Y HORA
// ==============================

export const DATE_FORMATS = {
  FULL_DATE: 'DD/MM/YYYY',
  FULL_DATETIME: 'DD/MM/YYYY HH:mm:ss',
  TIME: 'HH:mm:ss',
  SHORT_TIME: 'HH:mm',
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss'
};

// ==============================
// MENSAJES DE ERROR COMUNES
// ==============================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  AUTH_ERROR: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
  PERMISSION_ERROR: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  SERVER_ERROR: 'Error del servidor. Intenta nuevamente más tarde.',
  UNKNOWN_ERROR: 'Ocurrió un error desconocido.'
};

// ==============================
// MENSAJES DE ÉXITO COMUNES
// ==============================

export const SUCCESS_MESSAGES = {
  CREATE: 'Registro creado exitosamente',
  UPDATE: 'Registro actualizado exitosamente',
  DELETE: 'Registro eliminado exitosamente',
  SAVE: 'Cambios guardados correctamente',
  PAYMENT_SUCCESS: 'Pago registrado exitosamente',
  INVOICE_SENT: 'Comprobante enviado a SUNAT correctamente'
};

// ==============================
// CONFIGURACIÓN DE PAGINACIÓN
// ==============================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true
};

// ==============================
// CONFIGURACIÓN DE TABLA
// ==============================

export const TABLE_CONFIG = {
  SCROLL_Y: 600,
  SIZE: 'middle',
  BORDERED: true,
  SHOW_HEADER: true,
  ROW_KEY: 'id'
};

// ==============================
// TIEMPOS DE ESPERA (DELAYS)
// ==============================

export const DELAYS = {
  DEBOUNCE_SEARCH: 500,        // 500ms para búsquedas
  TOAST_DURATION: 3000,        // 3 segundos para notificaciones
  AUTO_REFRESH: 30000,         // 30 segundos para auto-refresh
  MODAL_ANIMATION: 300         // 300ms para animaciones de modal
};

// ==============================
// CONFIGURACIÓN DE VALIDACIÓN
// ==============================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  DNI_LENGTH: 8,
  RUC_LENGTH: 11,
  PLACA_PATTERN: /^[A-Z0-9]{6,7}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^9\d{8}$/
};

// ==============================
// COLORES DEL TEMA
// ==============================

export const THEME_COLORS = {
  PRIMARY: '#1890ff',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  INFO: '#1890ff',
  
  // Colores para tipos de pago
  PAYMENT_EFECTIVO: '#52c41a',
  PAYMENT_TARJETA: '#faad14',
  PAYMENT_YAPE: '#722ed1',
  PAYMENT_PLIN: '#13c2c2'
};

// ==============================
// TAMAÑOS DE ARCHIVO
// ==============================

export const FILE_SIZE = {
  MAX_IMAGE_SIZE: 2 * 1024 * 1024,     // 2MB
  MAX_DOCUMENT_SIZE: 5 * 1024 * 1024,  // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword']
};

// ==============================
// URLs DE API
// ==============================

export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  
  // Ingresos
  INGRESOS: '/ingresos',
  
  // Vehículos
  VEHICULOS: '/vehiculos',
  TIPOS_VEHICULO: '/tipos-vehiculo',
  
  // Propietarios
  PROPIETARIOS: '/propietarios',
  
  // Usuarios
  USUARIOS: '/usuarios',
  
  // SUNAT
  SUNAT_SEND: '/apifactura/documents',
  SUNAT_CONSULT: '/apifactura/clientes/buscar-documento'
};

// ==============================
// CONFIGURACIÓN LOCAL STORAGE
// ==============================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  REMEMBER_ME: 'remember_me'
};

// ==============================
// EXPORTACIÓN DEFAULT
// ==============================

export default {
  PAYMENT_TYPES,
  COMPROBANTE_TYPES,
  DOCUMENT_TYPES,
  USER_ROLES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DELAYS,
  VALIDATION,
  THEME_COLORS,
  API_ENDPOINTS,
  STORAGE_KEYS
};
