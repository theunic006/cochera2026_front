import { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Space, 
  message, 
  Alert,
  Row,
  Col,
  Switch,
  Select
} from 'antd';
import { 
  BankOutlined, 
  EnvironmentOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { companyService } from '../../services/companyService';

const { TextArea } = Input;
const { Option } = Select;

const CompanyForm = ({ visible, onCancel, onSuccess, editingCompany = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingCompany);

  // Efecto para manejar la visibilidad del modal y cargar datos
  useEffect(() => {
    if (visible) {
      if (isEditing && editingCompany) {
        // Llenar formulario con datos de la empresa a editar
        form.setFieldsValue({
          nombre: editingCompany.nombre,
          ubicacion: editingCompany.ubicacion || '',
          descripcion: editingCompany.descripcion || '',
          estado: editingCompany.estado || 'activo',
        });
      } else {
        // Limpiar formulario para crear nueva empresa
        form.resetFields();
        // Valores por defecto para nueva empresa
        form.setFieldsValue({
          estado: 'activo', // Por defecto activo
        });
      }
      // Limpiar errores previos
      setErrors({});
    }
  }, [visible, isEditing, editingCompany, form]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    setErrors({});

    try {
      let response;

      const companyData = {
        nombre: values.nombre.trim(),
        ubicacion: values.ubicacion?.trim() || '',
        descripcion: values.descripcion?.trim() || '',
        estado: values.estado // Usar directamente el valor del select
      };

      if (isEditing) {
        // Actualizar empresa existente
        response = await companyService.updateCompany(editingCompany.id, companyData);
      } else {
        // Crear nueva empresa
        response = await companyService.createCompany(companyData);
      }

      if (response.success) {
        message.success(
          isEditing 
            ? `Empresa "${companyData.nombre}" actualizada correctamente`
            : `Empresa "${companyData.nombre}" creada correctamente`
        );
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || 'Error al procesar la empresa');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      
      if (error.type === 'validation' && error.errors) {
        // Errores de validación del servidor
        setErrors(error.errors);
        message.error('Por favor, corrija los errores en el formulario');
      } else {
        // Otros tipos de errores
        message.error(error.message || 'Error al procesar la empresa');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la cancelación
  const handleCancel = () => {
    form.resetFields();
    setErrors({});
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
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
                     field === 'ubicacion' ? 'Ubicación' : 
                     field === 'descripcion' ? 'Descripción' : 
                     field === 'estado' ? 'Estado' : field}:
                  </strong>{' '}
                  {Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors}
                </li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          closable
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Nombre */}
            <Form.Item
              label="Nombre de la empresa"
              name="nombre"
              rules={[
                { required: true, message: 'El nombre de la empresa es obligatorio' },
                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                { max: 255, message: 'El nombre no puede exceder 255 caracteres' },
              ]}
              validateStatus={errors.nombre ? 'error' : ''}
              help={errors.nombre ? (Array.isArray(errors.nombre) ? errors.nombre.join(', ') : errors.nombre) : ''}
            >
              <Input
                prefix={<BankOutlined style={{ color: '#1890ff' }} />}
                placeholder="Ej: Mercado de Flores, Tech Solutions SA"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Ubicación */}
            <Form.Item
              label="Ubicación"
              name="ubicacion"
              rules={[
                { required: true, message: 'La ubicación es obligatoria' },
                { min: 3, message: 'La ubicación debe tener al menos 3 caracteres' },
                { max: 255, message: 'La ubicación no puede exceder 255 caracteres' },
              ]}
              validateStatus={errors.ubicacion ? 'error' : ''}
              help={errors.ubicacion ? (Array.isArray(errors.ubicacion) ? errors.ubicacion.join(', ') : errors.ubicacion) : ''}
            >
              <Input
                prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                placeholder="Ej: Lima, Perú / Madrid, España"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Descripción */}
            <Form.Item
              label="Descripción"
              name="descripcion"
              rules={[
                { max: 1000, message: 'La descripción no puede exceder 1000 caracteres' },
              ]}
              validateStatus={errors.descripcion ? 'error' : ''}
              help={errors.descripcion ? (Array.isArray(errors.descripcion) ? errors.descripcion.join(', ') : errors.descripcion) : ''}
            >
              <TextArea
                placeholder="Descripción opcional de la empresa, sus actividades y características..."
                rows={4}
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Estado */}
            <Form.Item
              label="Estado de la empresa"
              name="estado"
              rules={[
                { required: true, message: 'El estado es obligatorio' },
              ]}
              extra="Las empresas inactivas o suspendidas no podrán acceder al sistema"
            >
              <Select
                placeholder="Seleccionar estado"
                size="large"
                style={{ width: '100%' }}
              >
                <Option value="activo">
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                    Activo
                  </Space>
                </Option>
                <Option value="inactivo">
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#faad14' }} />
                    Inactivo
                  </Space>
                </Option>
                <Option value="suspendido">
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#ff4d4f' }} />
                    Suspendido
                  </Space>
                </Option>
                <Option value="pendiente">
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
                    Pendiente
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Botones de acción */}
        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleCancel}
              disabled={loading}
              size="large"
            >
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              icon={isEditing ? <BankOutlined /> : <BankOutlined />}
              size="large"
              style={{ backgroundColor: '#1890ff' }}
            >
              {loading 
                ? (isEditing ? 'Actualizando...' : 'Creando...') 
                : (isEditing ? 'Actualizar Empresa' : 'Crear Empresa')
              }
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompanyForm;