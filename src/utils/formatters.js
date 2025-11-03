/**
 * Utilidades para formatear valores en la aplicación
 */

// ==============================
// FORMATEO DE MONEDA
// ==============================

/**
 * Formatea un número como moneda peruana (S/.)
 * @param {number} amount - Monto a formatear
 * @param {number} decimals - Cantidad de decimales (default: 2)
 * @returns {string} - Monto formateado
 * 
 * @example
 * formatCurrency(1500.5) // "S/. 1,500.50"
 */
export const formatCurrency = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'S/. 0.00';
  }

  const number = parseFloat(amount);
  
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Formatea un número como moneda sin el símbolo
 * @param {number} amount - Monto a formatear
 * @param {number} decimals - Cantidad de decimales (default: 2)
 * @returns {string} - Monto formateado sin símbolo
 * 
 * @example
 * formatNumber(1500.5) // "1,500.50"
 */
export const formatNumber = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }

  const number = parseFloat(amount);
  
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

// ==============================
// FORMATEO DE FECHAS Y HORAS
// ==============================

/**
 * Formatea una fecha a formato DD/MM/YYYY
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 * 
 * @example
 * formatDate(new Date()) // "03/11/2025"
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha y hora a formato DD/MM/YYYY HH:mm:ss
 * @param {Date|string} datetime - Fecha y hora a formatear
 * @returns {string} - Fecha y hora formateada
 * 
 * @example
 * formatDateTime(new Date()) // "03/11/2025 18:30:45"
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return '';
  
  const d = new Date(datetime);
  
  if (isNaN(d.getTime())) return '';
  
  const date = formatDate(d);
  const time = formatTime(d);
  
  return `${date} ${time}`;
};

/**
 * Formatea una hora a formato HH:mm:ss
 * @param {Date|string} time - Hora a formatear
 * @returns {string} - Hora formateada
 * 
 * @example
 * formatTime(new Date()) // "18:30:45"
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  const d = time instanceof Date ? time : new Date(time);
  
  if (isNaN(d.getTime())) return '';
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Formatea una hora a formato HH:mm (sin segundos)
 * @param {Date|string} time - Hora a formatear
 * @returns {string} - Hora formateada
 * 
 * @example
 * formatTimeShort(new Date()) // "18:30"
 */
export const formatTimeShort = (time) => {
  if (!time) return '';
  
  const d = time instanceof Date ? time : new Date(time);
  
  if (isNaN(d.getTime())) return '';
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

// ==============================
// FORMATEO DE TEXTO
// ==============================

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 * 
 * @example
 * capitalizeWords("hola mundo") // "Hola Mundo"
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Capitaliza solo la primera letra del texto
 * @param {string} text - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 * 
 * @example
 * capitalize("hola mundo") // "Hola mundo"
 */
export const capitalize = (text) => {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo a agregar (default: "...")
 * @returns {string} - Texto truncado
 * 
 * @example
 * truncate("Este es un texto muy largo", 10) // "Este es un..."
 */
export const truncate = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + suffix;
};

// ==============================
// FORMATEO DE DOCUMENTOS
// ==============================

/**
 * Formatea un DNI (8 dígitos)
 * @param {string} dni - DNI a formatear
 * @returns {string} - DNI formateado
 * 
 * @example
 * formatDNI("12345678") // "12345678"
 */
export const formatDNI = (dni) => {
  if (!dni) return '';
  
  const cleaned = dni.replace(/\D/g, '');
  
  return cleaned.substring(0, 8);
};

/**
 * Formatea un RUC (11 dígitos)
 * @param {string} ruc - RUC a formatear
 * @returns {string} - RUC formateado
 * 
 * @example
 * formatRUC("20123456789") // "20123456789"
 */
export const formatRUC = (ruc) => {
  if (!ruc) return '';
  
  const cleaned = ruc.replace(/\D/g, '');
  
  return cleaned.substring(0, 11);
};

/**
 * Formatea un número de teléfono peruano (9 dígitos)
 * @param {string} phone - Teléfono a formatear
 * @returns {string} - Teléfono formateado
 * 
 * @example
 * formatPhone("987654321") // "987 654 321"
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length !== 9) return cleaned;
  
  return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)}`;
};

// ==============================
// FORMATEO DE PLACA
// ==============================

/**
 * Formatea una placa de vehículo (formato peruano)
 * @param {string} placa - Placa a formatear
 * @returns {string} - Placa formateada en mayúsculas
 * 
 * @example
 * formatPlaca("abc123") // "ABC-123"
 */
export const formatPlaca = (placa) => {
  if (!placa) return '';
  
  const cleaned = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  if (cleaned.length <= 3) return cleaned;
  
  return `${cleaned.substring(0, 3)}-${cleaned.substring(3)}`;
};

// ==============================
// FORMATEO DE TIEMPO DE ESTADÍA
// ==============================

/**
 * Formatea un tiempo de estadía a formato legible
 * @param {number} hours - Horas
 * @param {number} minutes - Minutos
 * @returns {string} - Tiempo formateado
 * 
 * @example
 * formatStayTime(2, 30) // "2h 30m"
 */
export const formatStayTime = (hours, minutes) => {
  if (hours === 0 && minutes === 0) {
    return '0m';
  }
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  
  return parts.join(' ');
};

// ==============================
// EXPORTACIONES
// ==============================

export default {
  // Moneda
  formatCurrency,
  formatNumber,
  
  // Fechas y horas
  formatDate,
  formatDateTime,
  formatTime,
  formatTimeShort,
  
  // Texto
  capitalizeWords,
  capitalize,
  truncate,
  
  // Documentos
  formatDNI,
  formatRUC,
  formatPhone,
  
  // Otros
  formatPlaca,
  formatStayTime
};
