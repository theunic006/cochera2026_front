import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input,
  InputNumber,
  Select,
  Button, 
  Space, 
  message
} from 'antd';
import { 
  CarOutlined, 
  TagOutlined,
  CalendarOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import { vehicleService } from '../../services/vehicleService';
import { vehicleTypeService } from '../../services/vehicleTypeService';

const { Option } = Select;

const VehicleForm = ({ visible, onCancel, onSuccess, editingVehicle = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(false);

  const isEditing = !!editingVehicle;

  // Cargar tipos de vehículos al abrir el modal
  const loadVehicleTypes = async () => {
    setLoadingVehicleTypes(true);
    try {
      const response = await vehicleTypeService.getAllVehicleTypes();
      if (response.success && response.data) {
        setVehicleTypes(response.data);
      } else {
        message.error('Error al cargar tipos de vehículos');
      }
    } catch (error) {
      console.error('Error al cargar tipos de vehículos:', error);
      message.error('Error al cargar tipos de vehículos');
    } finally {
      setLoadingVehicleTypes(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadVehicleTypes();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      if (isEditing && editingVehicle) {
        form.setFieldsValue({
          placa: editingVehicle.placa,
          marca: editingVehicle.marca,
          modelo: editingVehicle.modelo,
          color: editingVehicle.color,
          anio: editingVehicle.anio,
          tipo_vehiculo_id: editingVehicle.tipo_vehiculo_id,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          anio: new Date().getFullYear(),
        });
      }
    }
  }, [visible, isEditing, editingVehicle, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let response;
      
      if (isEditing) {
        // Actualizar vehículo existente
        response = await vehicleService.updateVehicle(editingVehicle.id, values);
      } else {
        // Crear nuevo vehículo
        response = await vehicleService.createVehicle(values);
      }
      
      if (response.success) {
        message.success(
          isEditing 
            ? 'Vehículo actualizado correctamente' 
            : 'Vehículo creado correctamente'
        );
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error al procesar vehículo:', error);
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
          <span>{isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Form.Item
          label="Placa"
          name="placa"
          rules={[
            { required: true, message: 'Por favor ingresa la placa' },
            { max: 10, message: 'Máximo 10 caracteres' },
            { 
              pattern: /^[A-Z0-9-]+$/, 
              message: 'Solo letras mayúsculas, números y guiones' 
            }
          ]}
        >
          <Input 
            prefix={<TagOutlined />}
            placeholder="Ej: ABC123"
            maxLength={10}
            style={{ textTransform: 'uppercase' }}
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
          />
        </Form.Item>

        <Form.Item
          label="Marca"
          name="marca"
          rules={[
            { required: false },
            { max: 50, message: 'Máximo 50 caracteres' }
          ]}
        >
          <Input 
            prefix={<CarOutlined />}
            placeholder="Ej: Toyota, Honda, Ford"
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          label="Modelo"
          name="modelo"
          rules={[
            { required: false },
            { max: 50, message: 'Máximo 50 caracteres' }
          ]}
        >
          <Input 
            prefix={<CarOutlined />}
            placeholder="Ej: Corolla, Civic, Focus"
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          label="Color"
          name="color"
          rules={[
            { required: false },
            { max: 30, message: 'Máximo 30 caracteres' }
          ]}
        >
          <Input 
            prefix={<BgColorsOutlined />}
            placeholder="Ej: Blanco, Negro, Rojo"
            maxLength={30}
          />
        </Form.Item>

        <Form.Item
          label="Año"
          name="anio"
          rules={[
            { required: false },
            { type: 'number', min: 1900, message: 'Año mínimo: 1900' },
            { type: 'number', max: new Date().getFullYear() + 1, message: `Año máximo: ${new Date().getFullYear() + 1}` }
          ]}
        >
          <InputNumber
            prefix={<CalendarOutlined />}
            placeholder="2024"
            min={1900}
            max={new Date().getFullYear() + 1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Tipo de Vehículo"
          name="tipo_vehiculo_id"
          rules={[
            { required: true, message: 'Por favor selecciona un tipo de vehículo' }
          ]}
        >
          <Select 
            placeholder="Selecciona un tipo de vehículo"
            loading={loadingVehicleTypes}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
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

export default VehicleForm;