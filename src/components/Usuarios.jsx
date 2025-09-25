import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Avatar, Input, Row, Col, Statistic, Typography } from 'antd';
import { UserOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import AppLayout from './AppLayout';

const { Title, Text } = Typography;
const { Search } = Input;

const Usuarios = () => {
  const [searchText, setSearchText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Datos simulados
  const usuarios = [
    {
      key: '1',
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@ejemplo.com',
      rol: 'Administrador',
      estado: 'Activo',
      ultimoAcceso: '2025-09-25 10:30',
      vehiculos: 2,
    },
    {
      key: '2',
      id: 2,
      nombre: 'María González',
      email: 'maria.gonzalez@ejemplo.com',
      rol: 'Usuario',
      estado: 'Activo',
      ultimoAcceso: '2025-09-24 15:45',
      vehiculos: 1,
    },
    {
      key: '3',
      id: 3,
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@ejemplo.com',
      rol: 'Usuario',
      estado: 'Inactivo',
      ultimoAcceso: '2025-09-20 09:15',
      vehiculos: 3,
    },
  ];

  const columns = [
    {
      title: 'Usuario',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {text.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol) => (
        <Tag color={rol === 'Administrador' ? 'red' : 'blue'}>
          {rol}
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
        <Tag color={estado === 'Activo' ? 'green' : 'red'}>
          {estado}
        </Tag>
      ),
    },
    {
      title: 'Vehículos',
      dataIndex: 'vehiculos',
      key: 'vehiculos',
      render: (count) => <Text strong>{count}</Text>,
    },
    {
      title: 'Último Acceso',
      dataIndex: 'ultimoAcceso',
      key: 'ultimoAcceso',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small">
            Editar
          </Button>
          <Button type="text" icon={<DeleteOutlined />} size="small" danger>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  const filteredData = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <AppLayout>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            👥 Gestión de Usuarios
          </Title>
          <Text type="secondary">
            Administra los usuarios del sistema
          </Text>
        </div>

        {/* Estadísticas */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Usuarios"
                value={usuarios.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Usuarios Activos"
                value={usuarios.filter(u => u.estado === 'Activo').length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Administradores"
                value={usuarios.filter(u => u.rol === 'Administrador').length}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabla de usuarios */}
        <Card
          title="Lista de Usuarios"
          extra={
            <Space>
              <Search
                placeholder="Buscar usuarios..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: isMobile ? 150 : 200 }}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                style={{ 
                  minWidth: isMobile ? 'auto' : 'auto',
                  padding: isMobile ? '4px 8px' : undefined
                }}
              >
                {!isMobile && 'Nuevo Usuario'}
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} usuarios`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default Usuarios;