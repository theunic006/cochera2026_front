import { toleranceService } from '../../services/toleranceService';
import { useAuth } from '../../context/AuthContext';
import { calcularTiempoEstadiaConTolerancia, getTiempoEstadia } from '../../utils/CalValores';
import React from "react";
import { Modal, Button, Descriptions } from "antd";
import { CarOutlined, ClockCircleOutlined, TagOutlined, CreditCardOutlined } from "@ant-design/icons";
import { ingresoService } from '../../services/ingresoService';


const TerminarModal = ({ visible, onCancel, ingreso, onPagoEfectivo, onPagoYape }) => {
  const { user } = useAuth();
  const [toleranciaMinutos, setToleranciaMinutos] = React.useState(null);
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
