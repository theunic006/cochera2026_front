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
  Select,
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';

import { roleService } from '../../services/roleService';
import { userService } from '../../services/userService';
import { useAuthInfo } from '../../hooks/useAuthInfo';

const UserForm = ({ visible, onCancel, onSuccess, editingUser = null, isProfileEdit = false, currentUser = null, isDark = false, passwordOnly = false }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [showPasswordFields, setShowPasswordFields] = useState(passwordOnly || false);
  const { userInfo } = useAuthInfo();

  // Determinar si es edición o creación
  const isEditing = !!editingUser;
  
  // Si es edición de perfil personal, usar currentUser como editingUser
  const userToEdit = isProfileEdit ? currentUser : editingUser;

  // Efecto para llenar el formulario al editar
  useEffect(() => {
    // Cargar roles solo si no es edición de perfil personal
    if (visible && !isProfileEdit) {
      roleService.getRoles && roleService.getRoles().then((data) => {
        // data.data es el array de roles
        setRoles(Array.isArray(data?.data) ? data.data : []);
        console.log('Roles cargados:', data);
      });
    }
    
    if (visible && userToEdit) {
      // Llenar formulario con datos del usuario a editar
      const formData = {
        name: userToEdit.name,
        email: userToEdit.email,
      };
      
      // Solo agregar campos de admin si no es perfil personal ni solo contraseña
      if (!isProfileEdit && !passwordOnly) {
        formData.idrol = userToEdit.idrol;
        formData.estado = userToEdit.estado;
      }
      
      form.setFieldsValue(formData);
    } else if (visible && !isEditing) {
      // Limpiar formulario para crear nuevo usuario
      form.resetFields();
    }
    // Limpiar errores previos
    setErrors({});
    setShowPasswordFields(passwordOnly || false);
  }, [visible, isEditing, userToEdit, form, isProfileEdit, passwordOnly]);

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    setErrors({});

    try {
      let response;

      if (isEditing || isProfileEdit) {
        // Actualizar usuario existente o perfil personal
        const updateData = {};

        // Solo incluir nombre y email si NO es passwordOnly
        if (!passwordOnly) {
          updateData.name = values.name;
          updateData.email = values.email;
        }

        // Solo incluir rol y estado si NO es edición de perfil personal y NO es passwordOnly
        if (!isProfileEdit && !passwordOnly) {
          updateData.idrol = values.idrol;
          updateData.estado = values.estado;
          updateData.id_company = userInfo?.id_company || null;
        }

        // Incluir contraseña si se proporcionó (requerida en passwordOnly)
        if (passwordOnly || (showPasswordFields && values.password) || (!isProfileEdit && values.password)) {
          updateData.password = values.password;
          updateData.password_confirmation = values.password_confirmation;
        }

        const userId = isProfileEdit ? userToEdit.id : editingUser.id;
        response = await userService.updateUser(userId, updateData);
      } else {
        // Crear nuevo usuario
        response = await userService.createUser({
          name: values.name,
          email: values.email,
          idrol: values.idrol,
          estado: values.estado,
          id_company: userInfo?.id_company || null,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });
      }

      if (response.success) {
        const successMessage = passwordOnly
          ? 'Contraseña actualizada exitosamente'
          : isProfileEdit 
            ? 'Perfil actualizado exitosamente'
            : isEditing 
              ? 'Usuario actualizado exitosamente' 
              : 'Usuario creado exitosamente';
            
        message.success(successMessage);
        form.resetFields();
        setShowPasswordFields(false);
        onSuccess(response.data);
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
    setShowPasswordFields(false);
    onCancel();
  };

  /**
   * Alternar campos de contraseña (solo para edición de perfil)
   */
  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    if (showPasswordFields) {
      // Si se están ocultando, limpiar los campos de contraseña
      form.setFieldsValue({
        password: undefined,
        password_confirmation: undefined,
      });
    }
  };

  return (
    <Modal
      title={
        passwordOnly
          ? 'Cambiar contraseña'
          : isProfileEdit 
            ? 'Editar mi perfil' 
            : isEditing 
              ? 'Editar Usuario' 
              : 'Crear Nuevo Usuario'
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
      style={isDark ? { 
        background: '#1f1f1f',
      } : {}}
      styles={isDark ? {
        content: { background: '#1f1f1f' },
        header: { background: '#1f1f1f', borderBottom: '1px solid #303030' }
      } : {}}
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

        {/* Campos básicos - Solo mostrar si NO es passwordOnly */}
        {!passwordOnly && (
          <>
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
            
            {/* Campos de Rol y Estado - Solo mostrar si NO es edición de perfil */}
            {!isProfileEdit && (
              <Row gutter={16}>
                <Col span={12}>
                  {/* Select de Roles */}
                  <Form.Item
                    label="Rol"
                    name="idrol"
                    rules={[{ required: true, message: 'Selecciona un rol' }]}
                  >
                    <Select placeholder="Selecciona un rol">
                      {roles.map((rol) => (
                        <Select.Option key={rol.id} value={rol.id}>
                          {rol.descripcion}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* Select de Estado */}
                  <Form.Item
                    label="Estado"
                    name="estado"
                    rules={[{ required: true, message: 'Selecciona un estado' }]}
                    initialValue="ACTIVO"
                  >
                    <Select placeholder="Selecciona un estado">
                      <Select.Option value="ACTIVO">ACTIVO</Select.Option>
                      <Select.Option value="INACTIVO">INACTIVO</Select.Option>
                      <Select.Option value="SUSPENDIDO">SUSPENDIDO</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}

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
          </>
        )}

        {/* Campos de contraseña */}
        {(isProfileEdit && !passwordOnly) ? (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <strong style={{ color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)' }}>
                  Cambiar contraseña
                </strong>
                <br />
                <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)', fontSize: 12 }}>
                  Opcional - Solo completa si deseas cambiar tu contraseña
                </span>
              </div>
              <Button 
                type={showPasswordFields ? "primary" : "dashed"}
                size="small"
                onClick={togglePasswordFields}
              >
                {showPasswordFields ? 'Ocultar' : 'Cambiar contraseña'}
              </Button>
            </div>

            {showPasswordFields && (
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Nueva contraseña"
                    name="password"
                    rules={[
                      { required: showPasswordFields, message: 'La contraseña es requerida' },
                      { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Mínimo 8 caracteres"
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
                      { required: showPasswordFields, message: 'Confirma la contraseña' },
                      validatePasswordConfirmation,
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
            )}
          </div>
        ) : passwordOnly ? (
          /* Modal exclusivo para cambio de contraseña */
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <strong style={{ color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)' }}>
                Cambiar contraseña de {userToEdit?.name}
              </strong>
              <br />
              <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)', fontSize: 12 }}>
                Ingresa una nueva contraseña segura de al menos 8 caracteres
              </span>
            </div>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Nueva contraseña"
                  name="password"
                  rules={[
                    { required: true, message: 'La contraseña es requerida' },
                    { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mínimo 8 caracteres"
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
                    { required: true, message: 'Confirma la contraseña' },
                    validatePasswordConfirmation,
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
          </div>
        ) : (
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
        )}

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
              {passwordOnly 
                ? 'Cambiar contraseña'
                : isProfileEdit 
                  ? 'Actualizar perfil' 
                  : isEditing 
                    ? 'Actualizar Usuario' 
                    : 'Crear Usuario'
              }
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;