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
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { userService } from '../../services/userService';

const UserForm = ({ visible, onCancel, onSuccess, editingUser = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Determinar si es edición o creación
  const isEditing = !!editingUser;

  // Efecto para llenar el formulario al editar
  useEffect(() => {
    if (visible) {
      if (isEditing && editingUser) {
        // Llenar formulario con datos del usuario a editar
        form.setFieldsValue({
          name: editingUser.name,
          email: editingUser.email,
        });
      } else {
        // Limpiar formulario para crear nuevo usuario
        form.resetFields();
      }
      // Limpiar errores previos
      setErrors({});
    }
  }, [visible, isEditing, editingUser, form]);

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    setErrors({});

    try {
      let response;

      if (isEditing) {
        // Actualizar usuario existente
        const updateData = {
          name: values.name,
          email: values.email,
        };

        // Solo incluir contraseña si se proporcionó
        if (values.password) {
          updateData.password = values.password;
          updateData.password_confirmation = values.password_confirmation;
        }

        response = await userService.updateUser(editingUser.id, updateData);
      } else {
        // Crear nuevo usuario
        response = await userService.createUser({
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });
      }

      if (response.success) {
        message.success(
          isEditing 
            ? 'Usuario actualizado exitosamente' 
            : 'Usuario creado exitosamente'
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
   * Validar confirmación de contraseña
   */
  const validatePasswordConfirmation = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Las contraseñas no coinciden'));
    },
  });

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
      title={isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
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
                    <strong>{field === 'email' ? 'Email' : field === 'name' ? 'Nombre' : field}:</strong>{' '}
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
              label="Nombre completo"
              name="name"
              rules={[
                { required: true, message: 'El nombre es requerido' },
                { max: 255, message: 'El nombre no puede exceder 255 caracteres' },
                { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Ingresa el nombre completo"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
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
        </Row>

        {/* Campos de contraseña */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              name="password"
              rules={[
                ...(isEditing ? [] : [{ required: true, message: 'La contraseña es requerida' }]),
                { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={isEditing ? 'Dejar vacío si no deseas cambiarla' : 'Mínimo 8 caracteres'}
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Confirmar contraseña"
              name="password_confirmation"
              dependencies={['password']}
              rules={[
                ...(isEditing ? [] : [{ required: true, message: 'Confirma la contraseña' }]),
                validatePasswordConfirmation,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const password = getFieldValue('password');
                    if (!password && !value) {
                      return Promise.resolve(); // Ambos vacíos en edición
                    }
                    if (password && !value) {
                      return Promise.reject(new Error('Confirma la contraseña'));
                    }
                    if (!password && value) {
                      return Promise.reject(new Error('Primero ingresa una contraseña'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirma la contraseña"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
              {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;