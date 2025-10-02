import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Row, Col } from 'antd';
import { CarOutlined, DollarOutlined, TagOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ingresoService } from '../../services/ingresoService';

const IngresoForm = ({ visible, onCancel, onSuccess, editingIngreso = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditing = !!editingIngreso;

  useEffect(() => {
    if (visible) {
      if (isEditing && editingIngreso) {
        form.setFieldsValue({
          placa: editingIngreso.vehiculo?.placa,
          valor: editingIngreso.vehiculo?.tipo_vehiculo?.valor,
          tipo_vehiculo: editingIngreso.vehiculo?.tipo_vehiculo?.nombre,
          hora_ingreso: editingIngreso.hora_ingreso,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, isEditing, editingIngreso, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let response;
      const data = {
        // Aquí deberías mapear los campos reales para crear/editar un ingreso
        // Ejemplo:
        // placa: values.placa,
        // valor: values.valor,
        // tipo_vehiculo: values.tipo_vehiculo,
        // hora_ingreso: values.hora_ingreso,
      };
      if (isEditing) {
        response = await ingresoService.updateIngreso(editingIngreso.id, data);
      } else {
        response = await ingresoService.createIngreso(data);
      }
      if (response.success) {
        message.success(isEditing ? 'Ingreso actualizado' : 'Ingreso creado');
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || 'Error al guardar ingreso');
      }
    } catch (error) {
      message.error(error.message || 'Error al guardar ingreso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={isEditing ? 'Editar Ingreso' : 'Nuevo Ingreso'}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEditing ? 'Actualizar' : 'Crear'}
      cancelText="Cancelar"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Placa" name="placa">
              <Input prefix={<CarOutlined />} placeholder="Placa del vehículo" disabled={isEditing} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Valor" name="valor">
              <Input prefix={<DollarOutlined />} placeholder="Valor" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tipo de Vehículo" name="tipo_vehiculo">
              <Input prefix={<TagOutlined />} placeholder="Tipo de vehículo" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Hora de Ingreso" name="hora_ingreso">
              <Input prefix={<ClockCircleOutlined />} placeholder="Hora de ingreso" disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default IngresoForm;
