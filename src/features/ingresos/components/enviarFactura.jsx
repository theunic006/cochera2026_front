import sunatService from '../../../services/sunatService';
import { message } from "antd";
import facturaService from "../services/facturaService";

/**
 * Construir el body para enviar a SUNAT basado en los datos del modal TerminarModal
 * @param {Object} params - Parámetros del comprobante
 * @param {string} params.tipoComprobante - 'factura' o 'boleta'
 * @param {string} params.rucCliente - Número de documento del cliente
 * @param {string} params.razonSocial - Razón social o nombre del cliente
 * @param {string} params.direccion - Dirección del cliente
 * @param {string} params.placa - Placa del vehículo
 * @param {string} params.horaIngreso - Hora de ingreso
 * @param {number} params.totalPagar - Total a pagar
 * @param {string} params.serie - Serie del comprobante (opcional)
 * @param {number} params.numero - Número correlativo (opcional)
 * @returns {Object} Body formateado para SUNAT
 */
export const construirBodySunat = ({
  tipoComprobante = 'boleta',
  rucCliente,
  razonSocial,
  direccion,
  placa,
  horaIngreso,
  totalPagar,
  serie,
  numero
}) => {
  // Obtener fecha actual
  const fechaHoy = new Date().toISOString().split('T')[0]; // Formato: 2025-10-23
  
  // Calcular fecha de vencimiento (hoy + 1 día)
  const fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
  const fechaVencimientoStr = fechaVencimiento.toISOString().split('T')[0];

  // Determinar tipo de documento del cliente
  let clienteTipoDocumento = '1'; // Por defecto DNI
  if (rucCliente) {
    if (rucCliente.length === 11) {
      clienteTipoDocumento = '6'; // RUC
    } else if (rucCliente.length === 8) {
      clienteTipoDocumento = '1'; // DNI
    }
  }

  // Calcular valores para facturación con 6 decimales (formato SUNAT)
  const total = parseFloat(totalPagar) || 0;
  const totalGravada = (total / 1.18).toFixed(6); // Base imponible sin IGV
  const totalIgv = (total - totalGravada).toFixed(6); // IGV 18%
  const valorUnitario = totalGravada; // Valor unitario sin IGV

  // Construir descripción del item
  const descripcion = `Servicio de estacionamiento - Placa: ${placa} - Ingreso: ${horaIngreso}`;

  // Determinar serie según tipo de comprobante (si no se proporciona)
  const serieComprobante = serie || (tipoComprobante === 'factura' ? 'F001' : 'B001');
  const numeroComprobante = numero || 10;

  // Body según especificaciones de SUNAT
  const body = {
    documento: tipoComprobante, // 'factura' o 'boleta'
    serie: serieComprobante,
    numero: numeroComprobante,
    fecha_de_emision: fechaHoy,
    fecha_de_vencimiento: fechaVencimientoStr,
    moneda: 'PEN',
    tipo_operacion: '0101', // Venta interna
    cliente_tipo_de_documento: clienteTipoDocumento,
    cliente_numero_de_documento: rucCliente || '',
    cliente_denominacion: razonSocial || '',
    cliente_direccion: direccion || '-',
    items: [
      {
        unidad_de_medida: 'NIU', // Unidad
        descripcion: descripcion,
        cantidad: '1',
        valor_unitario: valorUnitario,
        porcentaje_igv: '18',
        codigo_tipo_afectacion_igv: '10' // Gravado - Operación Onerosa
      }
    ],
    total_igv: totalIgv,
    total_gravada: totalGravada,
    total: total.toFixed(6)
  };

  return body;
};

/**
 * Enviar factura/boleta a SUNAT y guardar en BD
 * @param {Object} datosModal - Datos del modal TerminarModal
 * @param {string} datosModal.tipoComprobante - 'factura' o 'boleta'
 * @param {string} datosModal.rucCliente - Documento del cliente
 * @param {string} datosModal.razonSocial - Razón social del cliente
 * @param {string} datosModal.direccion - Dirección del cliente
 * @param {string} datosModal.placa - Placa del vehículo
 * @param {string} datosModal.horaIngreso - Hora de ingreso
 * @param {number} datosModal.totalPagar - Total a pagar
 * @param {number} datosModal.idEmpresa - ID de la empresa (opcional, por defecto 1)
 * @returns {Promise<Object>} Respuesta completa con datos de SUNAT y BD
 */
export const enviarFacturaSunat = async (datosModal) => {
  try {
    console.log('====================================');
    console.log('� INICIANDO EMISIÓN DE COMPROBANTE');
    console.log('====================================');
    console.log('�📋 Datos recibidos del modal:', datosModal);

    // =============================================
    // 1. VALIDACIONES BÁSICAS
    // =============================================
    if (!datosModal.rucCliente) {
      return {
        success: false,
        message: 'El número de documento del cliente es obligatorio'
      };
    }

    if (!datosModal.razonSocial) {
      return {
        success: false,
        message: 'El nombre o razón social del cliente es obligatorio'
      };
    }

    if (!datosModal.totalPagar || datosModal.totalPagar <= 0) {
      return {
        success: false,
        message: 'El total a pagar debe ser mayor a 0'
      };
    }

    // Validación de tipo de comprobante según documento
    if (datosModal.tipoComprobante === 'factura' && datosModal.rucCliente.length !== 11) {
      return {
        success: false,
        message: 'Para emitir factura se requiere RUC (11 dígitos)'
      };
    }

    // =============================================
    // 2. OBTENER SERIE Y CORRELATIVO DE LA BD
    // =============================================
    console.log('📊 Obteniendo series de la BD...');
    const resultadoSeries = await facturaService.getSeries();
    
    if (!resultadoSeries.success || !resultadoSeries.data) {
      console.error('❌ Error al obtener series:', resultadoSeries.message);
      return {
        success: false,
        message: 'No se pudieron obtener las series de facturación. Verifique la configuración.'
      };
    }

    // Mapear tipo de comprobante a código SUNAT
    const tipoComprobanteMap = {
      'factura': '01',
      'boleta': '03'
    };
    
    const tipoBuscado = tipoComprobanteMap[datosModal.tipoComprobante];
    
    // Buscar la serie correspondiente
    const series = resultadoSeries.data;
    const serieEncontrada = series.find(s => s.tipo_comprobante === tipoBuscado);
    
    if (!serieEncontrada) {
      console.error('❌ No se encontró serie para tipo:', datosModal.tipoComprobante);
      return {
        success: false,
        message: `No se encontró una serie configurada para ${datosModal.tipoComprobante}. Configure las series en el sistema.`
      };
    }

    const serie = serieEncontrada.serie;
    const numeroCorrelativo = serieEncontrada.correlativo_actual + 1;
    
    console.log('� Serie y correlativo obtenidos:', {
      serie: serie,
      numero: numeroCorrelativo,
      correlativoActual: serieEncontrada.correlativo_actual
    });

    // =============================================
    // 3. CONSTRUIR BODY PARA SUNAT
    // =============================================
    const bodySunat = construirBodySunat({
      ...datosModal,
      serie: serie,
      numero: numeroCorrelativo
    });

    console.log('====================================');
    console.log('🚀 PAYLOAD COMPLETO PARA SUNAT:');
    console.log('====================================');
    console.log(JSON.stringify(bodySunat, null, 2));
    console.log('====================================');

    // =============================================
    // 4. ENVIAR A SUNAT
    // =============================================
    console.log('🌐 Enviando comprobante a SUNAT...');
    const resultadoSunat = await sunatService.emitirComprobante(bodySunat);

    if (!resultadoSunat.success) {
      console.error('❌ ERROR DE SUNAT:', resultadoSunat);
      return {
        success: false,
        message: resultadoSunat.message || 'Error al emitir comprobante en SUNAT',
        error: resultadoSunat.error
      };
    }

    console.log('✅ Comprobante aceptado por SUNAT');
    console.log('📄 Datos del comprobante:', resultadoSunat.data);

    // =============================================
    // 5. PREPARAR Y GUARDAR EN BD LOCAL
    // =============================================
    const fechaHoy = new Date().toISOString().split('T')[0];
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
    const fechaVencimientoStr = fechaVencimiento.toISOString().split('T')[0];

    // Determinar tipo de documento del cliente
    let clienteTipoDocumento = '1'; // Por defecto DNI
    if (datosModal.rucCliente.length === 11) {
      clienteTipoDocumento = '6'; // RUC
    } else if (datosModal.rucCliente.length === 8) {
      clienteTipoDocumento = '1'; // DNI
    }

    // Calcular valores
    const total = parseFloat(datosModal.totalPagar) || 0;
    const totalGravada = (total / 1.18).toFixed(6);
    const totalIgv = (total - totalGravada).toFixed(6);
    const valorUnitario = totalGravada;

    const datosLocal = {
      id_empresa: datosModal.idEmpresa || 1,
      documento: datosModal.tipoComprobante,
      serie: serie,
      numero: numeroCorrelativo,
      fecha_de_emision: fechaHoy,
      fecha_de_vencimiento: fechaVencimientoStr,
      moneda: 'PEN',
      orden_compra_servicio: null,
      tipo_operacion: '0101',
      cliente_tipo_de_documento: clienteTipoDocumento,
      cliente_numero_de_documento: datosModal.rucCliente,
      cliente_denominacion: datosModal.razonSocial,
      cliente_direccion: datosModal.direccion || '-',
      items: [{
        unidad_de_medida: 'NIU',
        descripcion: `Estacionamiento del vehículo Placa: ${datosModal.placa} ingresado a las ${datosModal.horaIngreso}`,
        cantidad: '1',
        valor_unitario: valorUnitario,
        porcentaje_igv: '18',
        codigo_tipo_afectacion_igv: '10'
      }],
      total_igv: totalIgv,
      total_gravada: totalGravada,
      total: total.toFixed(6),
      payload: resultadoSunat.data // Estado, hash, xml, cdr, pdf
    };

    console.log('💾 Guardando comprobante en BD local...');
    const resultadoLocal = await facturaService.guardarComprobante(datosLocal);

    if (!resultadoLocal.success) {
      console.warn('⚠️ No se pudo guardar en BD local:', resultadoLocal.message);
      // No bloqueamos el proceso, el comprobante ya fue emitido en SUNAT
    } else {
      console.log('✅ Comprobante guardado en BD:', resultadoLocal.data);
    }

    // =============================================
    // 6. ACTUALIZAR CORRELATIVO EN LA BD
    // =============================================
    console.log('🔄 Actualizando correlativo en BD...');
    const resultadoActualizacion = await facturaService.actualizarCorrelativo(
      serieEncontrada.id,
      numeroCorrelativo
    );

    if (!resultadoActualizacion.success) {
      console.warn('⚠️ No se pudo actualizar correlativo:', resultadoActualizacion.message);
      // No bloqueamos el proceso
    } else {
      console.log('✅ Correlativo actualizado correctamente');
    }

    // =============================================
    // 7. RETORNAR RESULTADO COMPLETO
    // =============================================
    console.log('====================================');
    console.log('✅ PROCESO COMPLETADO EXITOSAMENTE');
    console.log('====================================');

    return {
      success: true,
      message: `${datosModal.tipoComprobante === 'factura' ? 'Factura' : 'Boleta'} ${serie}-${numeroCorrelativo} emitida y guardada correctamente`,
      data: {
        sunat: resultadoSunat.data,
        local: resultadoLocal.data,
        serie: serie,
        numero: numeroCorrelativo
      }
    };

  } catch (error) {
    console.error('❌ Error inesperado al enviar factura:', error);
    return {
      success: false,
      message: 'Error inesperado al procesar el comprobante: ' + error.message,
      error: error
    };
  }
};

/**
 * Función auxiliar para validar si se puede emitir factura
 * @param {string} documento - Número de documento
 * @returns {boolean} True si puede emitir factura
 */
export const puedeEmitirFactura = (documento) => {
  return documento && documento.length === 11;
};

/**
 * Función auxiliar para determinar tipo de comprobante según documento
 * @param {string} documento - Número de documento
 * @returns {string} 'factura' si es RUC, 'boleta' si es DNI u otro
 */
export const determinarTipoComprobante = (documento) => {
  if (documento && documento.length === 11) {
    return 'factura';
  }
  return 'boleta';
};

export default enviarFacturaSunat;
