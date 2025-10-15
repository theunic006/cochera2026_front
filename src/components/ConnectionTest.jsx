import { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Alert, Tag, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, ApiOutlined } from '@ant-design/icons';
import { axiosPublicInstance } from '../utils/axios';

const { Title, Text, Paragraph } = Typography;

const ConnectionTest = () => {
  const [status, setStatus] = useState('testing');
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('testing');
    
    try {
      const startTime = Date.now();
      
      // Test básico de conectividad
      const response = await axiosPublicInstance.get('/auth/verify-token');
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      setDetails({
        url: axiosPublicInstance.defaults.baseURL,
        status: response.status,
        responseTime: `${responseTime}ms`,
        headers: response.headers,
        timestamp: new Date().toLocaleString()
      });
      
      setStatus('success');
    } catch (error) {
      setDetails({
        url: axiosPublicInstance.defaults.baseURL,
        error: error.message,
        code: error.code,
        status: error.response?.status,
        timestamp: new Date().toLocaleString(),
        responseData: error.response?.data
      });
      
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'processing';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return <CheckCircleOutlined />;
      case 'error': return <CloseCircleOutlined />;
      default: return <Spin size="small" />;
    }
  };

  return (
    <Card 
      title={
        <Space>
          <ApiOutlined />
          <span>Test de Conectividad Backend</span>
        </Space>
      }
      style={{ maxWidth: 600, margin: '20px auto' }}
      extra={
        <Button 
          icon={<ReloadOutlined />} 
          onClick={testConnection}
          loading={loading}
          size="small"
        >
          Probar
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>Estado de Conexión: </Text>
          <Tag color={getStatusColor()} icon={getStatusIcon()}>
            {status === 'testing' ? 'Probando...' : 
             status === 'success' ? 'Conectado' : 'Error de Conexión'}
          </Tag>
        </div>

        <div>
          <Text strong>URL del Backend: </Text>
          <Text code>{details.url}</Text>
        </div>

        {details.timestamp && (
          <div>
            <Text strong>Última prueba: </Text>
            <Text type="secondary">{details.timestamp}</Text>
          </div>
        )}

        {status === 'success' && (
          <Alert
            type="success"
            message="Conexión Exitosa"
            description={
              <div>
                <div>Status HTTP: {details.status}</div>
                <div>Tiempo de respuesta: {details.responseTime}</div>
              </div>
            }
            showIcon
          />
        )}

        {status === 'error' && (
          <Alert
            type="error"
            message="Error de Conexión"
            description={
              <div>
                <div><strong>Error:</strong> {details.error}</div>
                {details.code && <div><strong>Código:</strong> {details.code}</div>}
                {details.status && <div><strong>Status HTTP:</strong> {details.status}</div>}
                {details.responseData && (
                  <div><strong>Respuesta:</strong> {JSON.stringify(details.responseData, null, 2)}</div>
                )}
              </div>
            }
            showIcon
          />
        )}

        <Paragraph type="secondary" style={{ marginTop: 16, fontSize: '12px' }}>
          Este test verifica la conectividad con el backend. Si hay errores, 
          revisa que el servidor esté corriendo y que la URL esté configurada correctamente.
        </Paragraph>
      </Space>
    </Card>
  );
};

export default ConnectionTest;