// src/utils/CalValores.js

/**
 * Calcula el tiempo de estadía y las fracciones a cobrar según la tolerancia.
 * @param {string} fecha - Fecha de ingreso (YYYY-MM-DD)
 * @param {string} hora - Hora de ingreso (HH:mm:ss)
 * @param {number|null} toleranciaMinutos - Minutos de tolerancia
 * @returns {Object} { horas, minutos, fracciones, texto }
 */
export function calcularTiempoEstadiaConTolerancia(fecha, hora, toleranciaMinutos) {
  if (!fecha || !hora) return { horas: 0, minutos: 0, texto: '-', fracciones: 1 };
  const ingreso = new Date(`${fecha}T${hora}`);
  const ahora = new Date();
  const diffMs = ahora - ingreso;
  if (isNaN(diffMs)) return { horas: 0, minutos: 0, texto: '-', fracciones: 1 };
  const totalMinutos = Math.ceil(diffMs / (1000 * 60));
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  let fracciones = horas;
  if (minutos > 0) {
    if (toleranciaMinutos != null) {
      if (minutos > toleranciaMinutos) {
        fracciones += 1;
      }
      // Si minutos <= tolerancia, NO sumar fracción extra
    } else {
      fracciones += 1;
    }
  }
  if (fracciones < 1) fracciones = 1;
  return { horas, minutos, fracciones, texto: `${horas}h ${minutos}m` };
}

/**
 * Devuelve el tiempo de estadía en formato HH:mm:ss
 * @param {string} fecha - Fecha de ingreso
 * @param {string} hora - Hora de ingreso
 * @returns {string} Tiempo en formato HH:mm:ss
 */
export function getTiempoEstadia(fecha, hora) {
  if (!fecha || !hora) return "00:00:00";
  const ingresoDate = new Date(`${fecha}T${hora}`);
  const ahora = new Date();
  const diffMs = ahora - ingresoDate;
  if (isNaN(diffMs)) return "00:00:00";
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs / (1000 * 60)) % 60);
  const segundos = Math.floor((diffMs / 1000) % 60);
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}
