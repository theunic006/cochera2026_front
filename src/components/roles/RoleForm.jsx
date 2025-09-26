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
  Switch
} from 'antd';
import { 
  SecurityScanOutlined, 
  FileTextOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { roleService } from '../../services/roleService';

const RoleForm = ({ visible, onCancel, onSuccess, editingRole = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Determinar si es edición o creación
  const isEditing = !!editingRole;

  // Efecto para llenar el formulario al editar
  useEffect(() => {
    if (visible) {
      if (isEditing && editingRole) {
        // Llenar formulario con datos del rol a editar
        form.setFieldsValue({
          name: editingRole.descripcion, // El API usa 'descripcion' como nombre del rol
          is_active: editingRole.estado_info ? editingRole.estado_info.is_active : true, // Usar estado_info si existe
        });
      } else {
        // Limpiar formulario para crear nuevo rol
        form.resetFields();
        // Valores por defecto para nuevo rol
        form.setFieldsValue({
          is_active: true, // Por defecto activo
        });
      }
      // Limpiar errores previos
      setErrors({});
    }
  }, [visible, isEditing, editingRole, form]);

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    setErrors({});

    try {
      let response;

      const roleData = {
        descripcion: values.name.trim(), // En el API, 'descripcion' es el nombre del rol
        estado: values.is_active ? 'activo' : 'suspendido' // Convertir boolean a string
      };

      if (isEditing) {
        // Actualizar rol existente
        response = await roleService.updateRole(editingRole.id, roleData);
      } else {
        // Crear nuevo rol
        response = await roleService.createRole(roleData);
      }

      if (response.success) {
        message.success(
          isEditing 
            ? 'Rol actualizado exitosamente' 
            : 'Rol creado exitosamente'
        );
        form.resetFields();
        onSuccess();
      } else {
        message.error('Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error en formulario de rol:', error);
      
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
      title={
        <Space>
          <SecurityScanOutlined style={{ color: '#722ed1' }} />
          {isEditing ? 'Editar Rol' : 'Crear Nuevo Rol'}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
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
                      {field === 'name' ? 'Nombre' : 
                       field === 'is_active' ? 'Estado' : field}:
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
          <Col span={24}>
            {/* Campo Nombre */}
            <Form.Item
              label="Nombre del rol"
              name="name"
              rules={[
                { required: true, message: 'El nombre del rol es requerido' },
                { max: 255, message: 'El nombre no puede exceder 255 caracteres' },
                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                { 
                  pattern: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s-_]+$/, 
                  message: 'Solo se permiten letras, espacios, guiones y guiones bajos' 
                },
              ]}
            >
              <Input
                prefix={<SecurityScanOutlined style={{ color: '#722ed1' }} />}
                placeholder="Ej: Administrador, Usuario, Moderador"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {/* Campo Estado */}
            <Form.Item
              label="Estado del rol"
              name="is_active"
              extra="Los roles suspendidos no aparecerán en las opciones de asignación"
            >
              <Switch
                checkedChildren={
                  <Space>
                    <SafetyCertificateOutlined />
                    Activo
                  </Space>
                }
                unCheckedChildren="Suspendido"
                style={{ backgroundColor: '#722ed1' }}
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
              style={{ 
                backgroundColor: '#722ed1',
                borderColor: '#722ed1'
              }}
            >
              {isEditing ? 'Actualizar Rol' : 'Crear Rol'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleForm;