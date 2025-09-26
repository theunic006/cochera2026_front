import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Select, 
  InputNumber,
  Button, 
  Space, 
  message
} from 'antd';
import { 
  ClockCircleOutlined, 
  CarOutlined
} from '@ant-design/icons';

const { Option } = Select;

const ToleranceForm = ({ visible, onCancel, onSuccess, editingTolerance = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditing = !!editingTolerance;

  // Datos de prueba para tipos de vehículos
  const vehicleTypes = [
    { id: 1, nombre: 'Auto', valor: 500 },
    { id: 2, nombre: 'Moto', valor: 200 },
    { id: 3, nombre: 'Camioneta', valor: 800 }
  ];

  useEffect(() => {
    if (visible) {
      if (isEditing && editingTolerance) {
        form.setFieldsValue({
          tipo_vehiculo_id: editingTolerance.tipo_vehiculo_id,
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
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success(
        isEditing 
          ? 'Tolerancia actualizada correctamente' 
          : 'Tolerancia creada correctamente'
      );
      
      form.resetFields();
      onSuccess();
    } catch (error) {
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
          label="Tipo de Vehículo"
          name="tipo_vehiculo_id"
          rules={[
            { required: true, message: 'Por favor selecciona un tipo de vehículo' }
          ]}
        >
          <Select placeholder="Selecciona un tipo de vehículo">
            {vehicleTypes.map(vehicleType => (
              <Option key={vehicleType.id} value={vehicleType.id}>
                <Space>
                  <CarOutlined />
                  {vehicleType.nombre} (${vehicleType.valor})
                </Space>
              </Option>
            ))}
          </Select>
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