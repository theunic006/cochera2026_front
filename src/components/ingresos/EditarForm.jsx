import React, { useEffect } from "react";
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
  const [form] = Form.useForm();

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
            onClick={() => window.print()}
            icon={<CarOutlined />}
            type="default"
          >
            Imprimir Ticket
          </Button>
          {ingresoEdit?.user?.name && (
            <span style={{ color: "#fff", fontWeight: 500, fontSize: 16 }}>
              <span style={{ opacity: 0.7, marginRight: 4 }}>Usuario:</span>{" "}
              {ingresoEdit.user.name}
            </span>
          )}
        </div>
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
              <Select.Option value="Ninguno">Ninguno</Select.Option>
              <Select.Option value="Leve">Leve</Select.Option>
              <Select.Option value="Grave">Grave</Select.Option>
              <Select.Option value="Advertencia">Advertencia</Select.Option>
              <Select.Option value="Información">Información</Select.Option>
              <Select.Option value="Otro">Otro</Select.Option>
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
