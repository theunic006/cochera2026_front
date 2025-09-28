import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, Space, message } from 'antd';
import { CarOutlined, UserOutlined, BankOutlined, CalendarOutlined } from '@ant-design/icons';
import { registroService } from '../../services/registroService';

const RegistroForm = ({ visible, onCancel, onSuccess, editingRegistro = null }) => {
  const [form] = Form.useForm();
  const isEditing = !!editingRegistro;
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  useEffect(() => {
    if (visible) {
      if (isEditing && editingRegistro) {
        form.setFieldsValue({
          id_vehiculo: editingRegistro.id_vehiculo,
          id_user: editingRegistro.id_user,
          id_empresa: editingRegistro.id_empresa,
          fecha: editingRegistro.fecha ? editingRegistro.fecha : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ fecha: null });
      }
      setErrors({});
    }
  }, [visible, isEditing, editingRegistro, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    setErrors({});
    try {
      let response;
      const payload = {
        ...values,
        fecha: values.fecha ? values.fecha.format('YYYY-MM-DD HH:mm:ss') : null,
      };
      if (isEditing) {
        response = await registroService.updateRegistro(editingRegistro.id, payload);
      } else {
        response = await registroService.createRegistro(payload);
      }
      if (response.success) {
        message.success(isEditing ? 'Registro actualizado' : 'Registro creado');
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || 'Error al guardar registro');
      }
    } catch (error) {
      setErrors(error.errors || {});
      message.error(error.message || 'Error al guardar registro');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setErrors({});
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? 'Editar Registro' : 'Nuevo Registro'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Form.Item
          label="ID Vehículo"
          name="id_vehiculo"
          rules={[{ required: true, message: 'El ID del vehículo es obligatorio' }]}
          validateStatus={errors.id_vehiculo ? 'error' : ''}
          help={errors.id_vehiculo ? errors.id_vehiculo[0] : ''}
        >
          <InputNumber prefix={<CarOutlined />} style={{ width: '100%' }} min={1} />
        </Form.Item>
        <Form.Item
          label="ID Usuario"
          name="id_user"
          rules={[{ required: true, message: 'El ID del usuario es obligatorio' }]}
          validateStatus={errors.id_user ? 'error' : ''}
          help={errors.id_user ? errors.id_user[0] : ''}
        >
          <InputNumber prefix={<UserOutlined />} style={{ width: '100%' }} min={1} />
        </Form.Item>
        <Form.Item
          label="ID Empresa"
          name="id_empresa"
          rules={[{ required: true, message: 'El ID de la empresa es obligatorio' }]}
          validateStatus={errors.id_empresa ? 'error' : ''}
          help={errors.id_empresa ? errors.id_empresa[0] : ''}
        >
          <InputNumber prefix={<BankOutlined />} style={{ width: '100%' }} min={1} />
        </Form.Item>
        <Form.Item
          label="Fecha"
          name="fecha"
          rules={[{ required: true, message: 'La fecha es obligatoria' }]}
          validateStatus={errors.fecha ? 'error' : ''}
          help={errors.fecha ? errors.fecha[0] : ''}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
            placeholder="Selecciona la fecha y hora"
          />
        </Form.Item>
        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default RegistroForm;
