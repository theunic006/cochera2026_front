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
  Col
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { ownerService } from '../../services/ownerService';

const OwnerForm = ({ visible, onCancel, onSuccess, editingOwner = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Determinar si es edición o creación
  const isEditing = !!editingOwner;

  // Efecto para llenar el formulario al editar
  useEffect(() => {
    if (visible) {
      if (isEditing && editingOwner) {
        // Llenar formulario con datos del propietario a editar
        form.setFieldsValue({
          nombres: editingOwner.nombres,
          apellidos: editingOwner.apellidos,
          documento: editingOwner.documento,
          telefono: editingOwner.telefono,
          email: editingOwner.email,
          direccion: editingOwner.direccion,
        });
      } else {
        // Limpiar formulario para crear nuevo propietario
        form.resetFields();
      }
      // Limpiar errores previos
      setErrors({});
    }
  }, [visible, isEditing, editingOwner, form]);

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    setErrors({});

    try {
      let response;

      if (isEditing) {
        // Actualizar propietario existente
        response = await ownerService.updateOwner(editingOwner.id, {
          nombres: values.nombres,
          apellidos: values.apellidos,
          documento: values.documento,
          telefono: values.telefono,
          email: values.email,
          direccion: values.direccion,
        });
      } else {
        // Crear nuevo propietario
        response = await ownerService.createOwner({
          nombres: values.nombres,
          apellidos: values.apellidos,
          documento: values.documento,
          telefono: values.telefono,
          email: values.email,
          direccion: values.direccion,
        });
      }

      if (response.success) {
        message.success(
          isEditing 
            ? 'Propietario actualizado exitosamente' 
            : 'Propietario creado exitosamente'
        );
        form.resetFields();
        onSuccess();
      } else {
        message.error('Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error en formulario:', error);
      
      if (error.type === 'validation' && error.errors) {
        // Errores de validación del backend
        setErrors(error.errors);
        
        // Mostrar errores en los campos del formulario
        const formErrors = Object.keys(error.errors).map(field => ({
          name: field,
          errors: error.errors[field],
        }));
        form.setFields(formErrors);
      } else {
        message.error(error.message || 'Error al procesar la solicitud');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar cancelación
   */
  const handleCancel = () => {
    form.resetFields();
    setErrors({});
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? 'Editar Propietario' : 'Crear Nuevo Propietario'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/* Alerta de errores generales */}
        {Object.keys(errors).length > 0 && (
          <Alert
            message="Errores de validación"
            description={
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {Object.entries(errors).map(([field, fieldErrors]) => (
                  <li key={field}>
                    <strong>
                      {field === 'nombres' ? 'Nombres' :
                       field === 'apellidos' ? 'Apellidos' :
                       field === 'documento' ? 'Documento' :
                       field === 'telefono' ? 'Teléfono' :
                       field === 'email' ? 'Email' :
                       field === 'direccion' ? 'Dirección' : field}:
                    </strong>{' '}
                    {Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors}
                  </li>
                ))}
              </ul>
            }
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {/* Campo Nombres */}
            <Form.Item
              label="Nombres"
              name="nombres"
              rules={[
                { required: true, message: 'Los nombres son requeridos' },
                { max: 255, message: 'Los nombres no pueden exceder 255 caracteres' },
                { min: 2, message: 'Los nombres deben tener al menos 2 caracteres' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Ingresa los nombres"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            {/* Campo Apellidos */}
            <Form.Item
              label="Apellidos"
              name="apellidos"
              rules={[
                { required: true, message: 'Los apellidos son requeridos' },
                { max: 255, message: 'Los apellidos no pueden exceder 255 caracteres' },
                { min: 2, message: 'Los apellidos deben tener al menos 2 caracteres' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Ingresa los apellidos"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {/* Campo Documento */}
            <Form.Item
              label="Documento"
              name="documento"
              rules={[
                { required: true, message: 'El documento es requerido' },
                { max: 20, message: 'El documento no puede exceder 20 caracteres' },
                { min: 5, message: 'El documento debe tener al menos 5 caracteres' },
                { pattern: /^[0-9]+$/, message: 'El documento debe contener solo números' },
              ]}
            >
              <Input
                prefix={<IdcardOutlined />}
                placeholder="Número de documento"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            {/* Campo Teléfono */}
            <Form.Item
              label="Teléfono"
              name="telefono"
              rules={[
                { required: true, message: 'El teléfono es requerido' },
                { max: 20, message: 'El teléfono no puede exceder 20 caracteres' },
                { min: 7, message: 'El teléfono debe tener al menos 7 caracteres' },
                { pattern: /^[0-9-+\s()]+$/, message: 'Formato de teléfono inválido' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Número de teléfono"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {/* Campo Email */}
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { required: true, message: 'El email es requerido' },
                { type: 'email', message: 'Ingresa un email válido' },
                { max: 255, message: 'El email no puede exceder 255 caracteres' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="usuario@ejemplo.com"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            {/* Campo Dirección */}
            <Form.Item
              label="Dirección"
              name="direccion"
              rules={[
                { required: true, message: 'La dirección es requerida' },
                { max: 500, message: 'La dirección no puede exceder 500 caracteres' },
                { min: 10, message: 'La dirección debe tener al menos 10 caracteres' },
              ]}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Dirección completa"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Botones de acción */}
        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
            >
              {isEditing ? 'Actualizar Propietario' : 'Crear Propietario'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OwnerForm;