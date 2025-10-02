
import React from "react";
import { Modal, Button, Descriptions } from "antd";
import { CarOutlined, ClockCircleOutlined, TagOutlined, CreditCardOutlined } from "@ant-design/icons";
import { ingresoService } from '../../services/ingresoService';

const TerminarModal = ({ visible, onCancel, ingreso, onPagoEfectivo, onPagoYape }) => {
  if (!ingreso) return null;
  const vehiculo = ingreso.vehiculo || {};
  const tipoVehiculo = vehiculo.tipo_vehiculo || {};
  const getTiempoEstadia = () => {
    if (!ingreso.fecha_ingreso || !ingreso.hora_ingreso) return "00:00:00";
    const ingresoDate = new Date(`${ingreso.fecha_ingreso}T${ingreso.hora_ingreso}`);
    const ahora = new Date();
    const diffMs = ahora - ingresoDate;
    if (isNaN(diffMs)) return "00:00:00";
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs / (1000 * 60)) % 60);
    const segundos = Math.floor((diffMs / 1000) % 60);
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };
  const tiempo = (() => {
    if (!ingreso.fecha_ingreso || !ingreso.hora_ingreso) return "-";
    const ingresoDate = new Date(`${ingreso.fecha_ingreso}T${ingreso.hora_ingreso}`);
    const ahora = new Date();
    const diffMs = ahora - ingresoDate;
    if (isNaN(diffMs)) return "-";
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${horas}h ${minutos}m`;
  })();
  const precioHora = tipoVehiculo.valor || 0;
  const fracciones = (() => {
    if (!ingreso.fecha_ingreso || !ingreso.hora_ingreso) return 1;
    const ingresoDate = new Date(`${ingreso.fecha_ingreso}T${ingreso.hora_ingreso}`);
    const ahora = new Date();
    const diffMs = ahora - ingresoDate;
    return Math.ceil(diffMs / (1000 * 60 * 60)) || 1;
  })();
  const total = precioHora * fracciones;
  const horaSalida = new Date().toLocaleTimeString("es-PE", { hour12: false });

  const handlePago = async (tipo_pago) => {
    const tiempoEstadia = getTiempoEstadia();
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
      } else {
        window?.message?.error?.(res.message || 'Error al registrar pago');
      }
    } catch (err) {
      window?.message?.error?.('Error al registrar pago');
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title={
        <span>
          <CarOutlined style={{ color: "#722ed1", marginRight: 8 }} />
          Terminar Ingreso
        </span>
      }
      width={500}
    >
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
          onClick={() => handlePago('Yape')}
          style={{ background: "#1890ff", borderColor: "#1890ff", minWidth: 140 }}
        >
          Pago por: Yape
        </Button>
        <Button
          type="primary"
          icon={<CreditCardOutlined />}
          onClick={() => handlePago('Efectivo')}
          style={{ background: "#52c41a", borderColor: "#52c41a", minWidth: 140 }}
        >
          Pago por: Efectivo
        </Button>
      </div>
    </Modal>
  );
};

export default TerminarModal;
