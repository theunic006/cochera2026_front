import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Spin, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, CarOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email: values.email,
        password: values.password,
      });

      if (response.data.success) {
        // Guardar token y datos del usuario
        const { user, access_token } = response.data.data;
        login(user, access_token);
        
        message.success(response.data.message || 'Inicio de sesión exitoso');
        navigate('/dashboard');
      } else {
        message.error('Error en las credenciales');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      message.error(
        error.response?.data?.message || 
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = {
    minHeight: '100vh',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #2d1b36 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const cardStyle = {
    borderRadius: '16px',
    boxShadow: isDarkMode 
      ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(24, 144, 255, 0.1)'
      : '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: isDarkMode ? '1px solid #303030' : 'none',
    maxWidth: '400px',
    width: '100%',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px',
  };

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

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          initialValues={{
            email: 'admin@gmail.com',
            password: '12345678'
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
              {loading ? (
                <Space>
                  <Spin size="small" />
                  <span>Iniciando sesión...</span>
                </Space>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '24px 0', borderColor: isDarkMode ? '#303030' : '#f0f0f0' }} />

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