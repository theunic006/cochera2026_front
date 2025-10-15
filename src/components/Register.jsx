import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Spin, Space, Divider, Upload, InputNumber, Select, Alert } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, InboxOutlined, SafetyCertificateOutlined, CheckCircleOutlined, SafetyOutlined } from '@ant-design/icons';
import { axiosPublicInstance } from '../utils/axios';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Hook de reCAPTCHA opcional (deshabilitado por ahora)
  const executeRecaptcha = null;

  // Validar archivo de imagen (mismas validaciones que el backend)
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('Solo se permiten imágenes JPG, JPEG, PNG o GIF');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB');
      return Upload.LIST_IGNORE;
    }
    
    // No hacer upload automático, solo validar
    return false;
  };

  // Manejar cambio de archivo
  const handleLogoChange = (info) => {
    if (info.file.status === 'removed') {
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }
    
    // Obtener el archivo directamente
    const file = info.file.originFileObj || info.file;
    if (file) {
      console.log('Archivo seleccionado:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setErrors({});
    
    try {
      let recaptchaToken = null;
      
      // Solo usar reCAPTCHA si está disponible y habilitado
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('register_company');
          if (!recaptchaToken) {
            message.warning('Verificación de seguridad no disponible, procediendo sin ella.');
          }
        } catch (error) {
          console.warn('reCAPTCHA error:', error);
          message.warning('Verificación de seguridad no disponible, procediendo sin ella.');
        }
      }

      // Preparar datos - usar JSON si no hay imagen, FormData si hay imagen
      let requestData;
      let headers = {};
      
      const baseData = {
        nombre: values.nombre.trim(),
        ubicacion: values.ubicacion?.trim() || '',
        descripcion: values.descripcion?.trim() || '',
        capacidad: values.capacidad,
        estado: 'pendiente'
      };
      
      // Agregar token de reCAPTCHA solo si está disponible
      if (recaptchaToken) {
        baseData.recaptcha_token = recaptchaToken;
      }
      
      if (logoFile) {
        // Si hay imagen, usar FormData
        const formData = new FormData();
        Object.keys(baseData).forEach(key => {
          formData.append(key, baseData[key]);
        });
        formData.append('logo', logoFile);
        requestData = formData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // Si no hay imagen, usar JSON (como funciona en Postman)
        requestData = baseData;
        headers['Content-Type'] = 'application/json';
      }

      // Generar credenciales automáticamente para mostrar al usuario
      const companyNameClean = values.nombre.trim().toLowerCase().replace(/\s+/g, '');
      const adminEmail = `admin@${companyNameClean}.com`;
      const adminPassword = '12345678';

      console.log('Registrando empresa:', {
        nombre: values.nombre.trim(),
        ubicacion: values.ubicacion?.trim() || '',
        descripcion: values.descripcion?.trim() || '',
        capacidad: values.capacidad,
        estado: 'pendiente',
        hasLogo: !!logoFile,
        hasRecaptcha: !!recaptchaToken,
        requestType: logoFile ? 'FormData' : 'JSON'
      });

      // Usar endpoint que funciona en Postman: /api/companies/register
      const response = await axiosPublicInstance.post('/companies/register', requestData, {
        headers: headers,
      });

      if (response.data.success) {
        // Usar credenciales del backend si están disponibles, sino las generadas localmente
        const credentials = response.data.data?.admin_credentials || {
          email: adminEmail,
          password: adminPassword,
          name: `Admin ${values.nombre}`,
          role: 'Administrador'
        };
        
        setGeneratedCredentials({
          email: credentials.email,
          password: credentials.password,
          companyName: values.nombre,
          adminName: credentials.name
        });
        setRegistrationSuccess(true);
        
        message.success(`¡Empresa "${values.nombre}" registrada exitosamente!`);
        form.resetFields();
        setLogoFile(null);
        setLogoPreview(null);
      } else {
        message.error(response.data.message || 'Error al registrar la empresa');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Manejo de errores de validación
        setErrors(error.response.data.errors);
        message.error('Por favor, corrija los errores en el formulario');
      } else if (error.response?.status === 500) {
        message.error('Error interno del servidor. Intenta sin imagen o verifica que el backend esté configurado para manejar archivos.');
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        message.error('No se puede conectar al servidor. Verifica tu conexión a internet.');
      } else {
        message.error('Error al registrar la empresa. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = {
    minHeight: '100vh',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #2d1b36 100%)'
      : 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const cardStyle = {
    borderRadius: '16px',
    boxShadow: isDarkMode 
      ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(82, 196, 26, 0.1)'
      : '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: isDarkMode ? '1px solid #303030' : 'none',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  };

  return (
    <div style={backgroundStyle}>
      <Card 
        style={cardStyle} 
        styles={{ body: { padding: '40px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}>
              <BankOutlined />
            </div>
            <Title level={2} style={{ margin: 0, color: isDarkMode ? '#fff' : '#52c41a' }}>
              Registro de Empresa
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Crea tu cuenta y empresa para acceder al sistema
            </Text>
          </Space>
        </div>

        <Divider style={{ margin: '24px 0', borderColor: isDarkMode ? '#303030' : '#f0f0f0' }} />

        {/* Mostrar errores de validación si existen (igual que CompanyForm) */}
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
                       field === 'capacidad' ? 'Capacidad' : 
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
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          disabled={loading}
        >
          <Row gutter={16}>
            <Col span={24}>
              {/* Campo Nombre (igual que CompanyForm) */}
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
                  prefix={<BankOutlined style={{ color: '#52c41a' }} />}
                  placeholder="Ej: Cochera Central, Parking Plaza"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              {/* Campo Logo - compatible con formato Postman */}
              <Form.Item
                label="Logo de la empresa (JPG, PNG o GIF)"
                name="logo"
                extra="Solo imágenes JPG, PNG o GIF, máximo 2MB"
              >
                <Upload.Dragger
                  name="logo"
                  accept=".jpg,.jpeg,.png,.gif"
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  onChange={handleLogoChange}
                  disabled={loading}
                >
                  {logoPreview ? (
                    <div style={{ padding: '8px' }}>
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        style={{ 
                          maxWidth: '120px', 
                          maxHeight: '120px', 
                          objectFit: 'contain',
                          display: 'block',
                          margin: '0 auto'
                        }} 
                      />
                      <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                        {logoFile?.name}
                      </Text>
                    </div>
                  ) : (
                    <>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: '#52c41a', fontSize: 32 }} />
                      </p>
                      <p>Haz clic o arrastra una imagen aquí</p>
                      <p style={{ fontSize: '12px', color: '#999' }}>
                        Formatos: JPG, PNG, GIF • Máximo: 2MB
                      </p>
                    </>
                  )}
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              {/* Campo Capacidad (igual que CompanyForm) */}
              <Form.Item
                label="Capacidad de vehículos en cochera"
                name="capacidad"
                rules={[
                  { required: true, message: 'La capacidad es obligatoria' },
                  { type: 'number', min: 1, message: 'Debe ser un número mayor a 0' },
                ]}
                validateStatus={errors.capacidad ? 'error' : ''}
                help={errors.capacidad ? (Array.isArray(errors.capacidad) ? errors.capacidad.join(', ') : errors.capacidad) : ''}
              >
                <InputNumber
                  min={1}
                  max={10000}
                  style={{ width: '100%' }}
                  placeholder="Ej: 50"
                  size="large"
                  disabled={loading}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              {/* Campo Ubicación (igual que CompanyForm) */}
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
                  prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
                  placeholder="Ej: Lima, Perú / Madrid, España"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              {/* Campo Descripción (igual que CompanyForm) */}
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

          {/* Botón de envío con indicador de seguridad */}
          <Form.Item style={{ marginBottom: '24px', marginTop: '32px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              icon={!loading && <BankOutlined />}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(82, 196, 26, 0.4)',
              }}
            >
              {loading ? (
                <Space>
                  <Spin size="small" />
                  <span>Registrando empresa...</span>
                </Space>
              ) : (
                'Registrar Empresa'
              )}
            </Button>
            
            {/* Indicador de protección reCAPTCHA - solo si está disponible */}
            {executeRecaptcha && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '12px',
                padding: '8px',
                backgroundColor: isDarkMode ? '#1f4529' : '#f6ffed',
                border: `1px solid ${isDarkMode ? '#389e0d' : '#b7eb8f'}`,
                borderRadius: '8px'
              }}>
                <Space size="small">
                  <SafetyOutlined style={{ color: '#52c41a' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Protegido por Google reCAPTCHA contra bots y spam
                  </Text>
                </Space>
              </div>
            )}
          </Form.Item>
        </Form>

        {/* Mostrar credenciales generadas después del registro exitoso */}
        {registrationSuccess && generatedCredentials && (
          <>
            <Divider style={{ margin: '24px 0', borderColor: isDarkMode ? '#303030' : '#f0f0f0' }} />
            
            <div style={{ 
              backgroundColor: isDarkMode ? '#1f4529' : '#f6ffed', 
              border: `1px solid ${isDarkMode ? '#389e0d' : '#b7eb8f'}`,
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <Title level={4} style={{ 
                color: isDarkMode ? '#95de64' : '#389e0d', 
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                ✅ ¡Empresa registrada exitosamente!
              </Title>
              
              <Text strong style={{ 
                color: isDarkMode ? '#fff' : '#000',
                display: 'block',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                📧 Credenciales de acceso generadas automáticamente:
              </Text>
              
              <div style={{
                backgroundColor: isDarkMode ? '#000' : '#fff',
                border: `1px solid ${isDarkMode ? '#434343' : '#d9d9d9'}`,
                borderRadius: '6px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ color: isDarkMode ? '#1890ff' : '#1890ff' }}>Empresa:</Text>{' '}
                  <Text copyable style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    {generatedCredentials.companyName}
                  </Text>
                </div>
                {generatedCredentials.adminName && (
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong style={{ color: isDarkMode ? '#722ed1' : '#722ed1' }}>Administrador:</Text>{' '}
                    <Text copyable style={{ color: isDarkMode ? '#fff' : '#000' }}>
                      {generatedCredentials.adminName}
                    </Text>
                  </div>
                )}
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ color: isDarkMode ? '#52c41a' : '#52c41a' }}>Email:</Text>{' '}
                  <Text copyable style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    {generatedCredentials.email}
                  </Text>
                </div>
                <div style={{ marginBottom: '0' }}>
                  <Text strong style={{ color: isDarkMode ? '#faad14' : '#fa8c16' }}>Contraseña:</Text>{' '}
                  <Text copyable style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    {generatedCredentials.password}
                  </Text>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '16px',
                padding: '12px',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  ⚠️ Guarda estas credenciales para acceder al sistema una vez que tu empresa sea aprobada
                </Text>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button
                  type="primary"
                  onClick={() => navigate('/login')}
                  size="large"
                  style={{
                    background: 'linear-gradient(135deg, #1890ff 0%, #52c41a 100%)',
                    border: 'none',
                  }}
                >
                  Ir al Login
                </Button>
              </div>
            </div>
          </>
        )}

        <Divider style={{ margin: '24px 0', borderColor: isDarkMode ? '#303030' : '#f0f0f0' }} />

        {!registrationSuccess && (
          <>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" style={{ color: '#1890ff', fontWeight: 600 }}>
                  Iniciar sesión
                </Link>
              </Text>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                📋 Se generarán credenciales automáticamente para el administrador
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '11px', opacity: 0.6 }}>
                Email: admin@[nombreempresa].com | Contraseña: 12345678
              </Text>
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '11px', opacity: 0.6 }}>
            © 2025 Cochera Management System
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;