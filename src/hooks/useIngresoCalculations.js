import { useMemo } from 'react';
import { calcularTiempoEstadiaConTolerancia, getTiempoEstadia } from '../utils/CalValores';

/**
 * Hook personalizado para calcular todos los datos relacionados con un ingreso
 * Optimizado con useMemo para evitar recálculos innecesarios
 * 
 * @param {Object} ingreso - Objeto de ingreso con todos los datos
 * @param {Object} tolerancia - Objeto de tolerancia (opcional)
 * @returns {Object|null} - Objeto con todos los cálculos o null si no hay ingreso
 * 
 * @example
 * const { 
 *   vehiculo, 
 *   tipoVehiculo, 
 *   tiempo, 
 *   fracciones, 
 *   total 
 * } = useIngresoCalculations(ingreso, tolerancia);
 */
export const useIngresoCalculations = (ingreso, tolerancia = null) => {
  return useMemo(() => {
    // Validación: Si no hay ingreso, retornar null
    if (!ingreso) {
      console.warn('⚠️ useIngresoCalculations: No se proporcionó un ingreso');
      return null;
    }

    try {
      // Extraer datos del ingreso con valores por defecto
      const vehiculo = ingreso.vehiculo || {};
      const tipoVehiculo = vehiculo.tipo_vehiculo || {};
      const propietario = vehiculo.propietario || {};

      // Calcular tiempo de estadía con tolerancia
      const tiempoObj = calcularTiempoEstadiaConTolerancia(
        ingreso.fecha_ingreso,
        ingreso.hora_ingreso,
        tolerancia?.minutos || 0
      );

      // Calcular tiempo de estadía en formato HH:mm:ss (para guardar en BD)
      const tiempoEstadia = getTiempoEstadia(
        ingreso.fecha_ingreso,
        ingreso.hora_ingreso
      );

      // Obtener precio por hora del tipo de vehículo
      const precioHora = parseFloat(tipoVehiculo.valor || 0);

      // Calcular fracciones
      const fracciones = tiempoObj.fracciones || 0;

      // Calcular total: precio_hora × fracciones (mínimo 1 fracción)
      const fraccionesACalcular = fracciones > 0 ? fracciones : 1;
      const total = precioHora * fraccionesACalcular;

      // Obtener hora actual de salida
      const horaSalida = new Date().toLocaleTimeString('es-PE', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // Obtener fecha actual de salida
      const fechaSalida = new Date().toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      // Log de cálculos (solo en desarrollo)
      if (import.meta.env.DEV) {
        console.group('🧮 Cálculos de Ingreso');
        console.log('ID Ingreso:', ingreso.id);
        console.log('Fecha Ingreso:', ingreso.fecha_ingreso);
        console.log('Hora Ingreso:', ingreso.hora_ingreso);
        console.log('Tiempo Estadía:', tiempoEstadia);
        console.log('Horas:', tiempoObj.horas, 'Minutos:', tiempoObj.minutos);
        console.log('Fracciones:', fracciones);
        console.log('Precio/Hora:', precioHora);
        console.log('Total:', total);
        console.groupEnd();
      }

      // Retornar objeto con todos los cálculos
      return {
        // Datos del vehículo
        vehiculo,
        tipoVehiculo,
        propietario,
        placa: vehiculo.placa || 'N/A',
        marca: vehiculo.marca || 'N/A',
        modelo: vehiculo.modelo || 'N/A',
        color: vehiculo.color || 'N/A',

        // Datos del tipo de vehículo
        tipoVehiculoNombre: tipoVehiculo.nombre || 'N/A',
        precioHora,

        // Datos del propietario
        propietarioNombre: propietario.nombre || 'N/A',
        propietarioDni: propietario.dni || 'N/A',
        propietarioTelefono: propietario.telefono || 'N/A',

        // Datos de tiempo
        tiempo: tiempoObj.texto || '0h 0m',
        tiempoEstadia, // Formato HH:mm:ss para BD
        tiempoHoras: tiempoObj.horas || 0,
        tiempoMinutos: tiempoObj.minutos || 0,
        fracciones,

        // Datos de fechas
        fechaIngreso: ingreso.fecha_ingreso,
        horaIngreso: ingreso.hora_ingreso,
        fechaSalida,
        horaSalida,

        // Cálculos financieros
        total: parseFloat(total.toFixed(2)),
        totalFormateado: total.toFixed(2),

        // Datos de tolerancia
        toleranciaAplicada: tolerancia?.minutos || 0,
        toleranciaNombre: tolerancia?.nombre || 'Sin tolerancia',

        // Metadata
        calculado: true,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error en useIngresoCalculations:', error);
      return null;
    }

  }, [ingreso, tolerancia]); // Solo recalcular si ingreso o tolerancia cambian
};

export default useIngresoCalculations;
