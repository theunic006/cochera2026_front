import { useState, useCallback, useMemo } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, CarOutlined, SafetyOutlined } from '@ant-design/icons';
import { axiosPublicInstance } from '../../../utils/axios';
// ✅ ZUSTAND: Migrado desde Context API
import { useAuth } from '../../../stores/authStore';
import { useTheme } from '../../../stores/themeStore';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const [loginError, setLoginError] = useState("");
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Hook de reCAPTCHA opcional
  let executeRecaptcha = null;
  try {
    // Solo usar reCAPTCHA si está disponible
    executeRecaptcha = null; // Por ahora deshabilitado para evitar errores
  } catch (error) {
    console.warn('reCAPTCHA not available');
  }

  /**
   * ✅ OPTIMIZACIÓN: useCallback - Manejo de envío del formulario de login
   */
  const onFinish = useCallback(async (values) => {
    setLoading(true);
    setLoginError("");
    
    try {
      let recaptchaToken = null;
      
      // Solo usar reCAPTCHA si está disponible y habilitado
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('login');
          if (!recaptchaToken) {
            message.warning('Verificación de seguridad no disponible, procediendo sin ella.');
          }
        } catch (error) {
          console.warn('reCAPTCHA error:', error);
          message.warning('Verificación de seguridad no disponible, procediendo sin ella.');
        }
      }

      const requestData = {
        email: values.email,
        password: values.password,
      };
      
      // Solo agregar token si está disponible
      if (recaptchaToken) {
        requestData.recaptcha_token = recaptchaToken;
      }

      const response = await axiosPublicInstance.post('/auth/login', requestData);

      if (response.data.success) {
        // Guardar token y datos del usuario
        const { user, access_token } = response.data.data;
        login(user, access_token);
      message.success(response.data.message || 'Inicio de sesión exitoso');
      setLoginError("");
      navigate('/dashboard');
      } else {
  setLoginError('Usuario inválido');
  message.error('Usuario inválido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      // Manejo específico de errores de conexión
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        setLoginError('No se puede conectar al servidor. Verifica tu conexión a internet.');
        message.error('Error de conexión: No se puede conectar al servidor.');
      } else if (error.response?.status === 401) {
        setLoginError('Credenciales incorrectas');
        message.error('Email o contraseña incorrectos');
      } else if (error.response?.status === 422) {
        setLoginError('Datos de login inválidos');
        message.error('Por favor verifica que tus datos sean correctos');
      } else if (error.response?.status >= 500) {
        setLoginError('Error del servidor. Intenta más tarde.');
        message.error('Error interno del servidor. Intenta nuevamente en unos minutos.');
      } else {
        setLoginError('Error inesperado al iniciar sesión');
        message.error(
          error.response?.data?.message || 
          'Error al iniciar sesión. Verifica tus credenciales.'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [login, navigate, executeRecaptcha]);

  /**
   * ✅ OPTIMIZACIÓN: useMemo - Estilos del fondo (evita recreación)
   */
  const backgroundStyle = useMemo(() => ({
    minHeight: '100vh',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #2d1b36 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  }), [isDarkMode]);

  /**
   * ✅ OPTIMIZACIÓN: useMemo - Estilos de la tarjeta (evita recreación)
   */
  const cardStyle = useMemo(() => ({
    borderRadius: '16px',
    boxShadow: isDarkMode 
      ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(24, 144, 255, 0.1)'
      : '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: isDarkMode ? '1px solid #303030' : 'none',
    maxWidth: '400px',
    width: '100%',
  }), [isDarkMode]);

  /**
   * ✅ OPTIMIZACIÓN: useMemo - Estilos del header (evita recreación)
   */
  const headerStyle = useMemo(() => ({
    textAlign: 'center',
    marginBottom: '32px',
  }), []);

  return (
    <div style={backgroundStyle}>
      <Card 
        style={cardStyle} 
        styles={{ body: { padding: '40px' } }}
      >
        <div style={headerStyle}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }}>
              <CarOutlined />
            </div>
            <Title level={2} style={{ margin: 0, color: isDarkMode ? '#fff' : '#1890ff' }}>
              Cochera 2025
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Sistema de Gestión Inteligente
            </Text>
          </Space>
        </div>

        <Divider style={{ margin: '24px 0', borderColor: isDarkMode ? '#303030' : '#f0f0f0' }} />

        {loginError && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#ff4d4f', fontWeight: 600, textAlign: 'center' }}>{loginError}</div>
          </div>
        )}
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          initialValues={{
           // email: 'admin@gmail.com',
           // password: '12345678'
          }}
        >
          <Form.Item
            label={<Text strong>Correo electrónico</Text>}
            name="email"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu correo electrónico',
              },
              {
                type: 'email',
                message: 'Ingresa un correo electrónico válido',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              placeholder="correo@ejemplo.com"
              size="large"
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>Contraseña</Text>}
            name="password"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu contraseña',
              },
              {
                min: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Tu contraseña"
              size="large"
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px', marginTop: '32px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              icon={!loading && <LoginOutlined />}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(24, 144, 255, 0.4)',
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            
            {/* Indicador de protección reCAPTCHA - solo si está disponible */}
            {executeRecaptcha && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '12px',
                padding: '8px',
                backgroundColor: isDarkMode ? '#1a1d29' : '#f0f5ff',
                border: `1px solid ${isDarkMode ? '#1890ff' : '#d6e4ff'}`,
                borderRadius: '8px'
              }}>
                <Space size="small">
                  <SafetyOutlined style={{ color: '#1890ff' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Protegido por Google reCAPTCHA contra accesos no autorizados
                  </Text>
                </Space>
              </div>
            )}
          </Form.Item>
        </Form>

        <Divider style={{ margin: '24px 0', borderColor: isDarkMode ? '#303030' : '#f0f0f0' }} />

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Text type="secondary">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" style={{ color: '#1890ff', fontWeight: 600 }}>
              Registrar empresa
            </Link>
          </Text>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            🔐 Acceso seguro protegido con autenticación JWT
          </Text>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '11px', opacity: 0.6 }}>
            © 2025 Cochera Management System - Todos los derechos reservados
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
