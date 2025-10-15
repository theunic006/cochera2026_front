import React, { useEffect, useRef } from "react";
import { useAuthInfo } from '../../hooks/useAuthInfo';
import { Modal, Form, Input, Button, Space, Select, message } from "antd";
import "./EditarForm.css";
import { CarOutlined } from "@ant-design/icons";
import { ingresoService } from "../../services/ingresoService";

const EditarForm = ({
  visible,
  onCancel,
  onFinish,
  loading,
  ingresoEdit,
  tiposVehiculo,
}) => {
  const { userInfo } = useAuthInfo();
  const [form] = Form.useForm();
  const ticketRef = useRef(null);

  useEffect(() => {
    if (visible && ingresoEdit) {
      form.setFieldsValue({
        placa: ingresoEdit.vehiculo?.placa || "",
        fecha_ingreso: ingresoEdit.fecha_ingreso || "",
        hora_ingreso: ingresoEdit.hora_ingreso || "",
        usuario: ingresoEdit.user?.name || "",
        tipo_vehiculo: ingresoEdit.vehiculo?.tipo_vehiculo_id || undefined,
        frecuencia: ingresoEdit.vehiculo?.frecuencia || "",
      });
    } else if (!visible) {
      form.resetFields();
    }
  }, [visible, ingresoEdit, form]);


  // Al hacer click en una observación, poner su descripción en el textarea
  const handleObsClick = (descripcion) => {
    form.setFieldsValue({ observaciones: descripcion });
  };

  // Verificar estado de QZ Tray
  const handleCheckQZTray = async () => {
    try {
      message.loading("Verificando QZ Tray...", 0);
      const status = await printService.checkQZTrayStatus();
      message.destroy();
      
      if (status.available) {
        message.success({
          content: `✅ QZ Tray está funcionando correctamente. ${status.message}`,
          duration: 4
        });
      } else {
        message.warning({
          content: `⚠️ ${status.message}`,
          duration: 6
        });
      }
    } catch (error) {
      message.destroy();
      message.error({
        content: `Error verificando QZ Tray: ${error.message}`,
        duration: 5
      });
    }
  };

  // Imprimir ticket usando QZ Tray
  const handlePrintTicket = async () => {
    if (!ingresoEdit?.id) {
      message.error("No se encontró el ingreso para imprimir");
      return;
    }
    
    try {
      message.loading("Conectando con la impresora...", 0);
      
      // Conectar a QZ Tray
      await printService.connect();
      
      // Obtener el tipo de vehículo seleccionado del formulario
      const tipoVehiculoId = form.getFieldValue('tipo_vehiculo');
      const tipoVehiculoSeleccionado = tiposVehiculo?.find(tv => tv.id === tipoVehiculoId);
      
      // Preparar datos para la plantilla del ticket
      const ticketData = {
        id: ingresoEdit.id,
        placa: ingresoEdit.vehiculo?.placa || form.getFieldValue('placa') || 'No especificado',
        fechaIngreso: ingresoEdit.fecha_ingreso || 'No especificado',
        horaIngreso: ingresoEdit.hora_ingreso || 'No especificado',
        tipoVehiculo: tipoVehiculoSeleccionado?.nombre || 'No especificado',
        valorHoraFraccion: tipoVehiculoSeleccionado?.valor || 'No especificado'
      };
      
      // Generar el contenido del ticket usando la plantilla
      const ticketContent = TicketTemplate.generarTicketIngreso(ticketData);
      
      message.destroy();
      
      // Imprimir usando QZ Tray con printRaw
      await printService.printRaw(ticketContent.join(''));
      
      message.success("Ticket enviado a la impresora correctamente");
      
    } catch (error) {
      message.destroy();
      console.error('Error al imprimir:', error);
      
      // Manejo de errores más específico
      if (error.message.includes('QZ Tray no responde')) {
        message.error({
          content: "QZ Tray no responde. Reinicia QZ Tray desde la bandeja del sistema e inténtalo de nuevo.",
          duration: 6
        });
      } else if (error.message.includes('QZ Tray no está corriendo')) {
        message.error({
          content: "QZ Tray no está corriendo. Inicia QZ Tray desde el menú de inicio o la bandeja del sistema.",
          duration: 6
        });
      } else if (error.message.includes('QZ Tray perdió la conexión')) {
        message.error({
          content: "Se perdió la conexión con QZ Tray. Verifica que esté corriendo y vuelve a intentar.",
          duration: 6
        });
      } else if (error.message.includes('impresoras disponibles')) {
        message.error({
          content: "No hay impresoras disponibles. Verifica que tu impresora esté conectada y encendida.",
          duration: 6
        });
      } else if (error.message.includes('QZ Tray no está instalado')) {
        message.error({
          content: "QZ Tray no está instalado. Descárgalo desde https://qz.io/download/ e instálalo.",
          duration: 8
        });
      } else {
        message.error({
          content: `Error al imprimir: ${error.message}`,
          duration: 5
        });
      }
    }
  };

  const handleFinish = async (values) => {
    if (!ingresoEdit?.id) {
      message.error("No se encontró el ingreso a editar");
      return;
    }
    const payload = {
      fecha_ingreso: values.fecha_ingreso,
      hora_ingreso: values.hora_ingreso,
      vehiculo: {
        placa: (values.placa || '').toUpperCase(),
        tipo_vehiculo_id: values.tipo_vehiculo,
      },
      observacion: {
        id_vehiculo: ingresoEdit.vehiculo?.id,
        tipo: values.tipo_observacion,
        descripcion: values.observaciones,
      },
    };
    try {
      const response = await ingresoService.updateIngreso(
        ingresoEdit.id,
        payload
      );
      if (response.success) {
        message.success("Ingreso actualizado correctamente");
        if (onFinish) onFinish(payload);
      } else {
        message.error(response.message || "Error al actualizar el ingreso");
      }
    } catch (error) {
      message.error("Error al actualizar el ingreso");
    }
  };

  return (
    <Modal
      title="Modificar Ingreso"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
            gap: 16,
          }}
        >
          <Button
            color="danger"
            variant="solid"
            onClick={handlePrintTicket}
            icon={<CarOutlined />}
            type="default"
          >
            Imprimir Ticket
          </Button>
          
          <Button
            size="small"
            onClick={handleCheckQZTray}
            type="dashed"
            title="Verificar estado de QZ Tray"
          >
            🔍 QZ Tray
          </Button>
          {/* Mostrar nombre de impresora de la empresa */}
          {userInfo?.empresa?.data?.imp_input && (
            <span style={{ color: "#722ed1", fontWeight: 500, fontSize: 16 }}>
              Impresora: {userInfo.empresa.data.imp_input}
            </span>
          )}
          {ingresoEdit?.user?.name && (
            <span style={{ color: "#fff", fontWeight: 500, fontSize: 16 }}>
              <span style={{ opacity: 0.7, marginRight: 4 }}>Usuario:</span>{" "}
              {ingresoEdit.user.name}
            </span>
          )}
        </div>

        {/* Ticket oculto eliminado, ahora se imprime directo con QZ Tray */}
        <div className="form-row-group">
          <label className="form-label">Placa:</label>
          <Form.Item
            name="placa"
            rules={[{ required: true, message: "Ingrese la placa" }]}
            className="form-item-inline"
          >
            <Input maxLength={15} style={{ textTransform: "uppercase" }} />
          </Form.Item>
        </div>
        <div className="form-row-group">
          <label className="form-label">Fecha:</label>
          <Form.Item
            name="fecha_ingreso"
            rules={[{ required: true, message: "Ingrese la fecha" }]}
            className="form-item-inline"
          >
            <Input type="date" />
          </Form.Item>
        </div>
        <div className="form-row-group">
          <label className="form-label">Hora Ingreso:</label>
          <Form.Item
            name="hora_ingreso"
            rules={[{ required: true, message: "Ingrese la hora" }]}
            className="form-item-inline"
          >
            <Input type="time" />
          </Form.Item>
        </div>
        <div className="form-row-group">
          <label className="form-label">Tipo Vehículo:</label>
          <Form.Item
            name="tipo_vehiculo"
            rules={[{ required: true, message: "Seleccione tipo de vehículo" }]}
            className="form-item-inline"
          >
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Seleccione tipo de vehículo"
              disabled={loading}
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {Array.isArray(tiposVehiculo) &&
                tiposVehiculo.map((tv) => (
                  <Select.Option key={tv.id} value={tv.id}>
                    {tv.nombre} - S/ {tv.valor}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        <div className="form-row-group">
          <label className="form-label">Frecuencia:</label>
          <Form.Item name="frecuencia" className="form-item-inline">
            <Input
              maxLength={15}
              style={{ textTransform: "uppercase" }}
              disabled
            />
          </Form.Item>
        </div>

        <div className="form-row-group">
          <label className="form-label">Tipo Observación:</label>
          <Form.Item name="tipo_observacion" className="form-item-inline" initialValue="Ninguno">
            <Select>
              <Select.Option value="Ninguno">
                <span className="obs-opcion-ninguno">Ninguno</span>
              </Select.Option>
              <Select.Option value="Leve">
                <span className="obs-opcion-leve">Leve</span>
              </Select.Option>
              <Select.Option value="Grave">
                <span className="obs-opcion-grave">Grave</span>
              </Select.Option>
              <Select.Option value="Advertencia">
                <span className="obs-opcion-advertencia">Advertencia</span>
              </Select.Option>
              <Select.Option value="Información">
                <span className="obs-opcion-info">Información</span>
              </Select.Option>
              <Select.Option value="Otro">
                <span className="obs-opcion-otro">Otro</span>
              </Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="form-row-group">
          <label className="form-label">Observaciones:</label>
          <Form.Item name="observaciones" className="form-item-inline">
            <Input.TextArea
              rows={3}
              maxLength={255}
              placeholder="Ingrese observaciones (opcional)"
            />
          </Form.Item>
        </div>

        {/* Mostrar las dos últimas observaciones del vehículo si existen */}
          {Array.isArray(ingresoEdit?.vehiculo?.observaciones) && ingresoEdit.vehiculo.observaciones.length > 0 && (
            <div className="observaciones-panel">
              <div className="observaciones-titulo">Últimas observaciones del vehículo:</div>
              {ingresoEdit.vehiculo.observaciones.slice(-2).map((obs, idx) => (
                <div
                  key={obs.id || idx}
                  className="observacion-item"
                  title="Click para copiar la descripción al campo de observaciones"
                  onClick={() => handleObsClick(obs.descripcion)}
                >
                  <div className="observacion-tipo-desc">
                    <span className="observacion-tipo">{obs.tipo}:</span>
                    {obs.descripcion}
                  </div>
                  <div className="observacion-meta">
                    {obs.created_at ? new Date(obs.created_at).toLocaleString('es-PE') : 'Sin fecha'}
                    {obs.usuario?.name ? ` | Por: ${obs.usuario.name}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}

        <Form.Item style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={onCancel} disabled={loading}>
              Atrás
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Actualizar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditarForm;
