import { toleranceService } from '../../../services/toleranceService';
import { useAuth } from '../../../context/AuthContext';
import { calcularTiempoEstadiaConTolerancia, getTiempoEstadia } from '../../../utils/CalValores';
import React from "react";
import { Modal, Button, Descriptions, Input, message } from "antd";
import { CarOutlined, ClockCircleOutlined, TagOutlined, CreditCardOutlined } from "@ant-design/icons";
import { ingresoService } from '../services/ingresoService';
import ConsultaSunat from './consultaSunat';
import { imprimirTicketSunat } from './imprimirTicketSunat';
import { enviarFacturaSunat, determinarTipoComprobante } from './enviarFactura';


const TerminarModal = ({ visible, onCancel, ingreso, onPagoEfectivo, onPagoYape, onPagoTarjeta }) => {
  const { user } = useAuth();
  const [toleranciaMinutos, setToleranciaMinutos] = React.useState(null);
  const [rucCliente, setRucCliente] = React.useState('');
  const [razonSocial, setRazonSocial] = React.useState('');
  const [direccion, setDireccion] = React.useState('');
  const [mostrarCamposAdicionales, setMostrarCamposAdicionales] = React.useState(false);
  const [enviandoSunat, setEnviandoSunat] = React.useState(false);
  
  React.useEffect(() => {
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

  React.useEffect(() => {
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


  if (!ingreso) return null;
  const vehiculo = ingreso.vehiculo || {};
  const tipoVehiculo = vehiculo.tipo_vehiculo || {};
  const tiempoObj = calcularTiempoEstadiaConTolerancia(ingreso.fecha_ingreso, ingreso.hora_ingreso, toleranciaMinutos);
  const tiempo = tiempoObj.texto;
  const precioHora = tipoVehiculo.valor || 0;
  const fracciones = tiempoObj.fracciones;
  const total = precioHora * (fracciones > 0 ? fracciones : 1);
  const horaSalida = new Date().toLocaleTimeString("es-PE", { hour12: false });


  const handlePago = async (tipo_pago) => {
    const tiempoEstadia = getTiempoEstadia(ingreso);
    const precio = total;
    try {
      const res = await ingresoService.deleteIngreso(ingreso.id, {
        tiempo: tiempoEstadia,
        precio,
        tipo_pago: tipo_pago.toUpperCase(),
      });
      if (res.success) {
        if (tipo_pago === 'Efectivo' && onPagoEfectivo) onPagoEfectivo();
        if (tipo_pago === 'Yape' && onPagoYape) onPagoYape();
        if (tipo_pago === 'Tarjeta' && onPagoTarjeta) onPagoTarjeta();
      } else {
        window?.message?.error?.(res.message || 'Error al registrar pago');
      }
    } catch (err) {
      window?.message?.error?.('Error al registrar pago');
    }
  };

  const handleEnviarSunat = async () => {
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

      // Preparar datos para enviar (INCLUYE idEmpresa para consultar series en BD)
      const datosComprobante = {
        tipoComprobante: tipoComprobante,
        rucCliente: rucCliente,
        razonSocial: razonSocial,
        direccion: direccion || '-',
        placa: vehiculo.placa || 'SIN PLACA',
        horaIngreso: ingreso.hora_ingreso || '',
        totalPagar: total,
        idEmpresa: user?.id_company || user?.company?.id || 1 // ID de empresa para consultar series
      };

      console.log('📋 Enviando comprobante a SUNAT:', datosComprobante);

      // Enviar a SUNAT (primero consultará BD para obtener serie/número)
      const resultado = await enviarFacturaSunat(datosComprobante);

      message.destroy();

      if (resultado.success) {
        message.success(`${tipoComprobante === 'factura' ? 'Factura' : 'Boleta'} enviada exitosamente a SUNAT`);
        console.log('✅ Respuesta SUNAT completa:', resultado);
        
        // IMPRIMIR TICKET AUTOMÁTICAMENTE después de envío exitoso
        setTimeout(() => {
          console.log('🖨️ Iniciando impresión de ticket SUNAT...');
          imprimirTicketSunat({
            respuestaSunat: resultado,
            datosEmpresa: user?.company || {},
            datosCliente: {
              documento: rucCliente,
              razonSocial: razonSocial,
              direccion: direccion
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
  };

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
          {/* Botón + al lado derecho de "Ingreso" */}
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
      {/* Campos adicionales - siempre visibles si se hace clic en + */}
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
          S/ {precioHora}.00
        </Descriptions.Item>
        <Descriptions.Item label="Tipo de Vehículo">
          <TagOutlined /> {tipoVehiculo.nombre || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Total a Pagar">
          <span style={{ color: "#ffc53d", fontWeight: 700, fontSize: 20 }}>
            S/ {total}.00
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
