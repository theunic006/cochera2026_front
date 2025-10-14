import { Typography, Card, Row, Col, Statistic, Progress, Spin } from 'antd';
import { CarOutlined, TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import { useAuth } from '../context/AuthContext';
import { useAuthInfo } from '../hooks/useAuthInfo';
import { STORAGE_BASE_URL } from '../utils/apiClient';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { userInfo, empresaLoading } = useAuthInfo();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  // Datos simulados para las estadísticas
  const stats = {
    totalVehiculos: 156,
    espaciosOcupados: 89,
    ingresosMensuales: 45800,
    tiempoPromedio: 3.2,
  };
  const ocupacionPorcentaje = Math.round((stats.espaciosOcupados / stats.totalVehiculos) * 100);

  // Redirigir al login si no hay usuario autenticado (solo una vez)
  useEffect(() => {
    if (!authLoading && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading || !user) {
    return (
      <AppLayout>
        <div style={{ 
          padding: 64, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh'
        }}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 16, color: '#666' }}>
            {authLoading ? 'Cargando...' : 'Verificando autenticación...'}
          </Title>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ padding: 24 }}>
        {/* Header del Dashboard */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            📊 Dashboard Principal
          </Title>
          <Text type="secondary">
            Resumen general del sistema de gestión de cochera
          </Text>
        </div>

        {/* Usuario y empresa logueada */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12} lg={8}>
            <Card>
              <Title level={5} style={{ marginBottom: 0 }}>Usuario logueado</Title>
              <Text strong>{userInfo?.name || userInfo?.nombre || 'Sin usuario'}</Text>
              <br />
              <Text type="secondary">Email: {userInfo?.email || '---'}</Text>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card>
              <Title level={5} style={{ marginBottom: 0 }}>Empresa</Title>
              {!userInfo?.id_company ? (
                <Text strong>Sin empresa</Text>
              ) : empresaLoading ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <Spin size="small" /> <Text type="secondary">Cargando empresa...</Text>
                </div>
              ) : userInfo?.empresa?.data ? (
                <>
                  {/* Logo de la empresa */}
                  {userInfo.empresa.data.logo && (
                    <div style={{ textAlign: 'center', marginBottom: 8 }}>
                      <img
                       src={`${STORAGE_BASE_URL}/companies/${userInfo.empresa.data.logo}`}
                        alt="Logo empresa"
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: 'contain',
                          borderRadius: 8,
                          background: '#fff',
                          border: '1px solid #eee',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}
                      />
                    </div>
                  )}
                  <Text strong>{userInfo.empresa.data.nombre || 'Sin nombre'}</Text>
                  <br />
                  <Text type="secondary">Ubicación: {userInfo.empresa.data.ubicacion || '---'}</Text>
                  <br />
                  <Text type="secondary">Descripción: {userInfo.empresa.data.descripcion || '---'}</Text>
                  <br />
                  <Text type="secondary">Estado: {userInfo.empresa.data.estado_info?.label || userInfo.empresa.data.estado || '---'}</Text>
                  <br />
                  <Text type="secondary">Usuarios: {userInfo.empresa.data.users_count ?? '---'}</Text>
                  <br />
                  <Text type="secondary">Creada: {userInfo.empresa.data.created_at ? new Date(userInfo.empresa.data.created_at).toLocaleString() : '---'}</Text>
                  <br />
                  <Text type="secondary">Actualizada: {userInfo.empresa.data.updated_at ? new Date(userInfo.empresa.data.updated_at).toLocaleString() : '---'}</Text>
                </>
              ) : (
                <Text strong>Sin empresa</Text>
              )}
            </Card>
          </Col>
        </Row>

        {/* Tarjetas de estadísticas */}
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Vehículos"
                value={stats.totalVehiculos}
                prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Espacios Ocupados"
                value={stats.espaciosOcupados}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress 
                percent={ocupacionPorcentaje} 
                size="small" 
                showInfo={false}
                strokeColor="#52c41a"
                style={{ marginTop: '8px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ingresos Mensuales"
                value={stats.ingresosMensuales}
                prefix="$"
                precision={2}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tiempo Promedio (hrs)"
                value={stats.tiempoPromedio}
                prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
                precision={1}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
        {/* Widgets adicionales responsivos */}
        <Row gutter={[16, 16]}>
          {/* Widget: Alertas de ocupación */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Title level={5} style={{ marginBottom: 8 }}>Alertas de ocupación</Title>
              {ocupacionPorcentaje > 70 ? (
                <Text type="danger">¡Atención! La ocupación supera el 70% ({ocupacionPorcentaje}%).</Text>
              ) : (
                <Text type="success">Ocupación en niveles óptimos ({ocupacionPorcentaje}%).</Text>
              )}
            </Card>
          </Col>

          {/* Widget: Última actividad */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Title level={5} style={{ marginBottom: 8 }}>Última actividad</Title>
              <Text>Vehículo placa <b>ABC-123</b> ingresó hace 12 min.</Text>
              <br />
              <Text type="secondary">Operador: Juan Pérez</Text>
            </Card>
          </Col>

          {/* Widget: Notificaciones */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Title level={5} style={{ marginBottom: 8 }}>Notificaciones</Title>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                <li>Nuevo usuario registrado</li>
                <li>Pago recibido por Yape</li>
                <li>Espacio 15 liberado</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>
    </AppLayout>
  );
};

export default Dashboard;