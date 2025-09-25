import { useEffect, useState } from "react";
import { Typography, Form, Input, List, Card, message, Row, Col, Statistic, Button, Space, Avatar, Progress } from 'antd';
import { UserOutlined, PlusOutlined, ReloadOutlined, CarOutlined, TeamOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import AppLayout from './AppLayout';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [suscribers, setSuscribers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchsuscribers();
  }, []);

  const fetchsuscribers = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get("http://localhost:8000/api/suscribers");
      setSuscribers(response.data);
    } catch (error) {
      message.error('Error al cargar los suscriptores');
      console.error('Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handledSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/suscribers", {
        name: values.name,
        email: values.email,
      });
      message.success('Suscriptor agregado exitosamente');
      setName("");
      setEmail("");
      fetchsuscribers();
    } catch (error) {
      message.error('Error al agregar el suscriptor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Datos simulados para las estadísticas
  const stats = {
    totalVehiculos: 156,
    espaciosOcupados: 89,
    ingresosMensuales: 45800,
    tiempoPromedio: 3.2,
  };

  const ocupacionPorcentaje = Math.round((stats.espaciosOcupados / stats.totalVehiculos) * 100);

  return (
    <AppLayout>
      <div>
        {/* Header del Dashboard */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            📊 Dashboard Principal
          </Title>
          <Text type="secondary">
            Resumen general del sistema de gestión de cochera
          </Text>
        </div>

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

        {/* Sección principal */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card 
              title={
                <Space>
                  <PlusOutlined />
                  Agregar Nuevo Suscriptor
                </Space>
              }
              style={{ height: 'fit-content' }}
            >
              <Form
                layout="vertical"
                onFinish={handledSubmit}
                initialValues={{ name, email }}
              >
                <Form.Item
                  label="Nombre"
                  name="name"
                  rules={[
                    { required: true, message: 'Por favor ingresa el nombre' }
                  ]}
                >
                  <Input 
                    placeholder="Nombre del suscriptor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Correo electrónico"
                  name="email"
                  rules={[
                    { required: true, message: 'Por favor ingresa el correo' },
                    { type: 'email', message: 'Ingresa un correo válido' }
                  ]}
                >
                  <Input 
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    style={{
                      borderRadius: '8px',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    Agregar Suscriptor
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card 
              title={`📋 Lista de Suscriptores (${suscribers.length})`}
              extra={
                <Button 
                  type="text" 
                  icon={<ReloadOutlined />}
                  onClick={fetchsuscribers}
                  loading={refreshing}
                >
                  Actualizar
                </Button>
              }
            >
              <List
                dataSource={suscribers}
                renderItem={(suscriber, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          style={{ 
                            backgroundColor: '#1890ff',
                            fontSize: '16px'
                          }}
                        >
                          {suscriber.name?.charAt(0)?.toUpperCase() || <UserOutlined />}
                        </Avatar>
                      }
                      title={
                        <Text strong style={{ fontSize: '16px' }}>
                          {suscriber.name}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary">{suscriber.email}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            ID: #{suscriber.id} • Registrado recientemente
                          </Text>
                        </Space>
                      }
                    />
                    <div style={{ textAlign: 'right' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        #{index + 1}
                      </Text>
                    </div>
                  </List.Item>
                )}
                locale={{ emptyText: 'No hay suscriptores registrados' }}
                style={{ maxHeight: '500px', overflowY: 'auto' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </AppLayout>
  );
};

export default Dashboard;