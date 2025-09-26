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
  CarOutlined, 
  DollarOutlined
} from '@ant-design/icons';
import { vehicleTypeService } from '../../services/vehicleTypeService';

const VehicleTypeForm = ({ visible, onCancel, onSuccess, editingVehicleType = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditing = !!editingVehicleType;

  useEffect(() => {
    if (visible) {
      if (isEditing && editingVehicleType) {
        form.setFieldsValue({
          nombre: editingVehicleType.nombre,
          valor: editingVehicleType.valor,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          valor: 1.0,
        });
      }
    }
  }, [visible, isEditing, editingVehicleType, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let response;
      
      if (isEditing) {
        // Actualizar tipo de vehículo existente
        response = await vehicleTypeService.updateVehicleType(editingVehicleType.id, values);
      } else {
        // Crear nuevo tipo de vehículo
        response = await vehicleTypeService.createVehicleType(values);
      }
      
      if (response.success) {
        message.success(
          isEditing 
            ? 'Tipo de vehículo actualizado correctamente' 
            : 'Tipo de vehículo creado correctamente'
        );
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error al procesar tipo de vehículo:', error);
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
          <CarOutlined style={{ color: '#722ed1' }} />
          <span>{isEditing ? 'Editar Tipo de Vehículo' : 'Nuevo Tipo de Vehículo'}</span>
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
          label="Nombre del Tipo"
          name="nombre"
          rules={[
            { required: true, message: 'Por favor ingresa el nombre del tipo' },
            { max: 100, message: 'Máximo 100 caracteres' },
            { 
              pattern: /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 
              message: 'Solo se permiten letras y espacios' 
            }
          ]}
        >
          <Input 
            prefix={<CarOutlined />}
            placeholder="Ej: Auto, Moto, Camioneta"
            maxLength={100}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Valor"
          name="valor"
          rules={[
            { required: true, message: 'Por favor ingresa el valor' },
            { type: 'number', min: 0.01, message: 'El valor debe ser mayor a 0' },
            { type: 'number', max: 99999.99, message: 'Valor máximo: 99,999.99' }
          ]}
        >
          <InputNumber
            prefix={<DollarOutlined />}
            placeholder="0.00"
            min={0.01}
            max={99999.99}
            step={0.01}
            precision={2}
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <Space>
            <Button 
              onClick={handleCancel}
              disabled={loading}
            >
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

export default VehicleTypeForm;