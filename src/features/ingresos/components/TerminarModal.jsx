import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Button, Descriptions, message } from "antd";
import { CarOutlined, ClockCircleOutlined, TagOutlined, CreditCardOutlined } from "@ant-design/icons";

// ✅ ZUSTAND: Migrado desde Context API
import { useAuth } from '../../../stores/authStore';
import { toleranceService } from '../../configuracion/tolerancias/services/toleranceService';
import { ingresoService } from '../services/ingresoService';
import { calcularTiempoEstadiaConTolerancia, getTiempoEstadia } from '../../../utils/CalValores';
import { enviarFacturaSunat, determinarTipoComprobante } from './enviarFactura';
import { imprimirTicketSunat } from './imprimirTicketSunat';
import ConsultaSunat from './consultaSunat';


const TerminarModal = ({ visible, onCancel, ingreso, onPagoEfectivo, onPagoYape, onPagoTarjeta }) => {
  const { user } = useAuth();
  const [toleranciaMinutos, setToleranciaMinutos] = useState(null);
  const [rucCliente, setRucCliente] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [direccion, setDireccion] = useState('');
  const [mostrarCamposAdicionales, setMostrarCamposAdicionales] = useState(false);
  const [enviandoSunat, setEnviandoSunat] = useState(false);
  
  // Obtener tolerancia de la empresa
  useEffect(() => {
    const fetchTolerancia = async () => {
      if (user && user.id_company) {
        try {
          const tolerancia = await toleranceService.getToleranceByEmpresa(user.id_company);
          let minutosTolerancia = null;
          if (tolerancia && tolerancia.data && Array.isArray(tolerancia.data) && tolerancia.data[0]) {
            minutosTolerancia = tolerancia.data[0].minutos;
          }
          setToleranciaMinutos(minutosTolerancia);
        } catch (err) {
          setToleranciaMinutos(null);
        }
      }
    };
    fetchTolerancia();
  }, [user]);

  // Cargar datos del cliente cuando se abre el modal
  useEffect(() => {
    if (visible && ingreso) {
      const propietarios = ingreso.vehiculo?.propietarios;
      const persona = ingreso.vehiculo?.persona;
      
      let documento = '';
      let nombre = '';
      let dir = '';
      
      if (propietarios && Array.isArray(propietarios) && propietarios.length > 0) {
        const propietario = propietarios[0];
        documento = propietario.documento || propietario.ruc || '';
        nombre = propietario.razon_social || propietario.nombre_completo || propietario.nombres || '';
        dir = propietario.direccion || '';
      }
      else if (persona) {
        documento = persona.documento || persona.dni || persona.ruc || '';
        nombre = persona.razon_social || persona.nombre_completo || persona.nombre || '';
        dir = persona.direccion || '';
      }
      
      setRucCliente(documento);
      setRazonSocial(nombre);
      setDireccion(dir);
      setMostrarCamposAdicionales(false);
    } else if (!visible) {
      setRucCliente('');
      setRazonSocial('');
      setDireccion('');
      setMostrarCamposAdicionales(false);
    }
  }, [visible, ingreso]);

  // Calcular valores derivados con useMemo para evitar recálculos innecesarios
  const datosCalculados = useMemo(() => {
    if (!ingreso) return null;
    
    const vehiculo = ingreso.vehiculo || {};
    const tipoVehiculo = vehiculo.tipo_vehiculo || {};
    const tiempoObj = calcularTiempoEstadiaConTolerancia(ingreso.fecha_ingreso, ingreso.hora_ingreso, toleranciaMinutos);
    const tiempo = tiempoObj.texto;
    const precioHora = tipoVehiculo.valor || 0;
    const fracciones = tiempoObj.fracciones;
    const total = precioHora * (fracciones > 0 ? fracciones : 1);
    const horaSalida = new Date().toLocaleTimeString("es-PE", { hour12: false });
    
    return { vehiculo, tipoVehiculo, tiempo, precioHora, total, horaSalida };
  }, [ingreso, toleranciaMinutos]);

  // Handler para registrar pago
  const handlePago = useCallback(async (tipo_pago) => {
    if (!ingreso || !datosCalculados) return;
    
    // ⚠️ FIX: getTiempoEstadia necesita fecha y hora como parámetros separados
    const tiempoEstadia = getTiempoEstadia(ingreso.fecha_ingreso, ingreso.hora_ingreso);
    const precio = datosCalculados.total;

    try {
      const res = await ingresoService.deleteIngreso(ingreso.id, {
        tiempo: tiempoEstadia,
        precio,
        tipo_pago: tipo_pago.toUpperCase(),
      });
      
      if (res.success) {
        message.success(`Pago registrado exitosamente: ${tipo_pago}`);
        
        // Llamar callbacks según tipo de pago
        if (tipo_pago === 'Efectivo' && onPagoEfectivo) onPagoEfectivo();
        if (tipo_pago === 'Yape' && onPagoYape) onPagoYape();
        if (tipo_pago === 'Tarjeta' && onPagoTarjeta) onPagoTarjeta();
        
        // Cerrar modal después de éxito
        onCancel();
      } else {
        message.error(res.message || 'Error al registrar pago');
      }
    } catch (err) {
      message.error('Error al registrar pago');
      console.error('Error en handlePago:', err);
    }
  }, [ingreso, datosCalculados, onPagoEfectivo, onPagoYape, onPagoTarjeta, onCancel]);

  // Handler para enviar a SUNAT
  const handleEnviarSunat = useCallback(async () => {
    if (!datosCalculados) return;
    
    // Validar que existan los datos del cliente
    if (!rucCliente || !razonSocial) {
      message.warning('Debe completar los datos del cliente (RUC/DNI y Razón Social) antes de enviar a SUNAT');
      setMostrarCamposAdicionales(true);
      return;
    }

    setEnviandoSunat(true);
    message.loading('Enviando comprobante a SUNAT...', 0);

    try {
      // Determinar tipo de comprobante según el documento
      const tipoComprobante = determinarTipoComprobante(rucCliente);

      // Preparar datos para enviar
      const datosComprobante = {
        tipoComprobante,
        rucCliente,
        razonSocial,
        direccion: direccion || '-',
        placa: datosCalculados.vehiculo.placa || 'SIN PLACA',
        horaIngreso: ingreso.hora_ingreso || '',
        totalPagar: datosCalculados.total,
        idEmpresa: user?.id_company || user?.company?.id || 1
      };

      console.log('📋 Enviando comprobante a SUNAT:', datosComprobante);

      // Enviar a SUNAT
      const resultado = await enviarFacturaSunat(datosComprobante);

      message.destroy();

      if (resultado.success) {
        message.success(`${tipoComprobante === 'factura' ? 'Factura' : 'Boleta'} enviada exitosamente a SUNAT`);
        console.log('✅ Respuesta SUNAT completa:', resultado);
        
        // Imprimir ticket automáticamente
        setTimeout(() => {
          console.log('🖨️ Iniciando impresión de ticket SUNAT...');
          imprimirTicketSunat({
            respuestaSunat: resultado,
            datosEmpresa: user?.company || {},
            datosCliente: {
              documento: rucCliente,
              razonSocial,
              direccion
            }
          });
        }, 500);
      } else {
        message.error(resultado.message || 'Error al enviar comprobante a SUNAT');
        console.error('❌ Error SUNAT:', resultado.error);
      }
    } catch (error) {
      message.destroy();
      message.error('Error inesperado al enviar comprobante a SUNAT');
      console.error('❌ Error:', error);
    } finally {
      setEnviandoSunat(false);
    }
  }, [datosCalculados, rucCliente, razonSocial, direccion, ingreso, user]);

  // Early return si no hay datos calculados
  if (!datosCalculados) return null;

  const { vehiculo, tipoVehiculo, tiempo, precioHora, total, horaSalida } = datosCalculados;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <CarOutlined style={{ color: "#722ed1", marginRight: 8 }} />
          <span style={{ fontWeight: 500, fontSize: 18 }}>
            Terminar Ingreso
          </span>
          <Button
            type="primary"
            size="small"
            icon={<span style={{ fontSize: 16, fontWeight: 'bold' }}>+</span>}
            onClick={() => setMostrarCamposAdicionales(!mostrarCamposAdicionales)}
            style={{ 
              marginLeft: 12,
              background: mostrarCamposAdicionales ? '#52c41a' : '#1890ff',
              borderColor: mostrarCamposAdicionales ? '#52c41a' : '#1890ff'
            }}
          />
        </div>
      }
      width={500}
    >
      {/* Formulario de datos del cliente */}
      {mostrarCamposAdicionales && (
        <ConsultaSunat
          rucCliente={rucCliente}
          setRucCliente={setRucCliente}
          razonSocial={razonSocial}
          setRazonSocial={setRazonSocial}
          direccion={direccion}
          setDireccion={setDireccion}
          onEnviarSunat={handleEnviarSunat}
          enviandoSunat={enviandoSunat}
        />
      )}

      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Placa">
          <span style={{ color: "#ff543d", fontWeight: 700, fontSize: 20 }}>
            <CarOutlined /> {vehiculo.placa || "-"}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Hora de Ingreso">
          <ClockCircleOutlined /> {ingreso.hora_ingreso || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Hora de Salida">
          <ClockCircleOutlined /> {horaSalida}
        </Descriptions.Item>
        <Descriptions.Item label="Tiempo de Estadia">
          <ClockCircleOutlined /> {tiempo}
        </Descriptions.Item>
        <Descriptions.Item label="Precio por Hora">
          S/ {precioHora.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="Tipo de Vehículo">
          <TagOutlined /> {tipoVehiculo.nombre || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Total a Pagar">
          <span style={{ color: "#ffc53d", fontWeight: 700, fontSize: 20 }}>
            S/ {total.toFixed(2)}
          </span>
        </Descriptions.Item>
      </Descriptions>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        <Button
          type="primary"
          icon={<CreditCardOutlined />}
          onClick={() => handlePago('Tarjeta')}
          style={{ background: "#af882eff", borderColor: "#b4a200ff", minWidth: 120, minHeight: 50 }}
        >
          Tarjeta
        </Button>
        <Button
          type="primary"
          icon={<CreditCardOutlined />}
          onClick={() => handlePago('Yape')}
          style={{ background: "#68026bff", borderColor: "#55093eff", minWidth: 120, minHeight: 50  }}
        >
          Yape
        </Button>
        <Button
          type="primary"
          icon={<CreditCardOutlined />}
          onClick={() => handlePago('Efectivo')}
          style={{ background: "#369905ff", borderColor: "#378a0dff", minWidth: 120, minHeight: 50  }}
        >
          Efectivo
        </Button>
      </div>
    </Modal>
  );
};

export default TerminarModal;
