import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input,
  InputNumber,
  Button, 
  Space, 
  message
} from 'antd';
import { 
  ClockCircleOutlined, 
  FileTextOutlined
} from '@ant-design/icons';
import { toleranceService } from '../../services/toleranceService';

const ToleranceForm = ({ visible, onCancel, onSuccess, editingTolerance = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditing = !!editingTolerance;

  useEffect(() => {
    if (visible) {
      if (isEditing && editingTolerance) {
        form.setFieldsValue({
          descripcion: editingTolerance.descripcion,
          minutos: editingTolerance.minutos,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          minutos: 15,
        });
      }
    }
  }, [visible, isEditing, editingTolerance, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let response;
      
      if (isEditing) {
        // Actualizar tolerancia existente
        response = await toleranceService.updateTolerance(editingTolerance.id, values);
      } else {
        // Crear nueva tolerancia
        response = await toleranceService.createTolerance(values);
      }
      
      if (response.success) {
        message.success(
          isEditing 
            ? 'Tolerancia actualizada correctamente' 
            : 'Tolerancia creada correctamente'
        );
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error al procesar tolerancia:', error);
      message.error('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <ClockCircleOutlined style={{ color: '#722ed1' }} />
          <span>{isEditing ? 'Editar Tolerancia' : 'Nueva Tolerancia'}</span>
        </Space>
      }
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
          label="Descripción"
          name="descripcion"
          rules={[
            { required: true, message: 'Por favor ingresa una descripción' },
            { max: 255, message: 'Máximo 255 caracteres' }
          ]}
        >
          <Input 
            prefix={<FileTextOutlined />}
            placeholder="Ej: Tolerancia para entrada matutina"
            maxLength={255}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Minutos de Tolerancia"
          name="minutos"
          rules={[
            { required: true, message: 'Por favor ingresa los minutos' },
            { type: 'number', min: 1, message: 'Mínimo 1 minuto' },
            { type: 'number', max: 1440, message: 'Máximo 1440 minutos (24 horas)' }
          ]}
        >
          <InputNumber
            placeholder="Ej: 15"
            min={1}
            max={1440}
            style={{ width: '100%' }}
            addonAfter="minutos"
          />
        </Form.Item>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                backgroundColor: '#722ed1',
                borderColor: '#722ed1'
              }}
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default ToleranceForm;