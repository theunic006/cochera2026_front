import { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Space, 
  Alert, 
  Row, 
  Col,
  InputNumber,
  Switch,
  message,
  Typography
} from 'antd';
import { 
  CarOutlined, 
  SaveOutlined, 
  CloseOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { vehicleTypeService } from '../../services/vehicleTypeService';

const { Text } = Typography;

const VehicleTypeForm = ({ visible, onCancel, onSuccess, editingVehicleType }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tieneValor, setTieneValor] = useState(false);

  const isEditing = !!editingVehicleType;

  // Cargar datos cuando se abre el modal para editar
  useEffect(() => {
    if (visible && editingVehicleType) {
      const hasValue = editingVehicleType.tiene_valor || editingVehicleType.valor > 0;
      setTieneValor(hasValue);
      
      form.setFieldsValue({
        nombre: editingVehicleType.nombre || '',
        valor: editingVehicleType.valor || 0,
        tieneValor: hasValue,
      });
    } else if (visible && !editingVehicleType) {
      // Limpiar el formulario para nuevo tipo de vehículo
      form.resetFields();
      setTieneValor(false);
      form.setFieldsValue({
        tieneValor: false,
        valor: 0,
      });
    }
    
    // Limpiar errores al abrir
    setErrors({});
  }, [visible, editingVehicleType, form]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    setErrors({});

    try {
      // Preparar datos para enviar
      const vehicleTypeData = {
        nombre: values.nombre,
        valor: values.tieneValor ? values.valor : 0,
      };

      let result;
      if (isEditing) {
        result = await vehicleTypeService.updateVehicleType(editingVehicleType.id, vehicleTypeData);
      } else {
        result = await vehicleTypeService.createVehicleType(vehicleTypeData);
      }

      if (result.success) {
        message.success(result.message);
        form.resetFields();
        setTieneValor(false);
        onSuccess();
      } else {
        throw result;
      }
    } catch (error) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} tipo de vehículo:`, error);
      
      if (error.type === 'validation' && error.errors) {
        // Errores de validación del servidor
        setErrors(error.errors);
        message.error('Por favor, corrija los errores en el formulario');
      } else {
        // Otros tipos de errores
        message.error(error.message || 'Error al procesar el tipo de vehículo');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la cancelación
  const handleCancel = () => {
    form.resetFields();
    setErrors({});
    setTieneValor(false);
    onCancel();
  };

  // Función para manejar el cambio en el switch "Tiene Valor"
  const handleTieneValorChange = (checked) => {
    setTieneValor(checked);
    if (!checked) {
      form.setFieldValue('valor', 0);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <CarOutlined style={{ color: '#1890ff' }} />
          {isEditing ? 'Editar Tipo de Vehículo' : 'Nuevo Tipo de Vehículo'}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
      maskClosable={!loading}
      centered
    >
      {/* Mostrar errores de validación si existen */}
      {Object.keys(errors).length > 0 && (
        <Alert
          style={{ marginBottom: 16 }}
          message="Errores de validación"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <li key={field}>
                  <strong>
                    {field === 'nombre' ? 'Nombre' : 
                     field === 'valor' ? 'Valor' : field}:
                  </strong> {Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors}
                </li>
              ))}
            </ul>
          }
          type="error"
          showIcon
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Nombre */}
            <Form.Item
              label="Nombre del tipo de vehículo"
              name="nombre"
              rules={[
                { required: true, message: 'El nombre es obligatorio' },
                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                { max: 100, message: 'El nombre no puede exceder 100 caracteres' },
              ]}
              validateStatus={errors.nombre ? 'error' : ''}
              help={errors.nombre ? (Array.isArray(errors.nombre) ? errors.nombre.join(', ') : errors.nombre) : ''}
            >
              <Input
                prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                placeholder="Ej: Auto, Moto, Camión"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            {/* Switch Tiene Valor */}
            <Form.Item
              label="¿Tiene valor definido?"
              name="tieneValor"
              valuePropName="checked"
            >
              <div style={{ paddingTop: '6px' }}>
                <Switch
                  checkedChildren="Sí"
                  unCheckedChildren="No"
                  size="default"
                  onChange={handleTieneValorChange}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Define si este tipo de vehículo tiene un valor monetario
                </div>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* Campo Valor */}
            <Form.Item
              label="Valor"
              name="valor"
              rules={[
                ...(tieneValor ? [
                  { required: true, message: 'El valor es obligatorio cuando está habilitado' },
                  { type: 'number', min: 0.01, message: 'El valor debe ser mayor que 0' },
                ] : []),
                { type: 'number', max: 999999.99, message: 'El valor no puede exceder 999,999.99' },
              ]}
              validateStatus={errors.valor ? 'error' : ''}
              help={errors.valor ? (Array.isArray(errors.valor) ? errors.valor.join(', ') : errors.valor) : 'Valor monetario del tipo de vehículo'}
            >
              <InputNumber
                prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
                placeholder="0.00"
                size="large"
                style={{ width: '100%' }}
                min={0}
                max={999999.99}
                step={0.01}
                formatter={(value) => `$ ${value}`}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                disabled={!tieneValor}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Información adicional */}
        <Alert
          message="Información"
          description={
            <div>
              <p><strong>Nombre:</strong> Identificación del tipo de vehículo (ej: Auto, Moto, Camión)</p>
              <p><strong>Valor:</strong> Costo o tarifa asociada al tipo de vehículo</p>
              <p>Los tipos de vehículo se utilizan para clasificar vehículos y definir tolerancias específicas.</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* Botones de acción */}
        <Row justify="end" gutter={8}>
          <Col>
            <Button 
              icon={<CloseOutlined />} 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </Col>
          <Col>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={loading}
              style={{ 
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
              }}
            >
              {isEditing ? 'Actualizar' : 'Crear'} Tipo
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default VehicleTypeForm;