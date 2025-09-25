import { Card, Row, Col, Typography, Space, Tag, Button, Table, Statistic } from 'antd';
import { CarOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import AppLayout from './AppLayout';

const { Title, Text } = Typography;

const Vehiculos = () => {
  // Datos simulados
  const vehiculos = [
    {
      key: '1',
      id: 1,
      placa: 'ABC-123',
      tipo: 'Sedán',
      marca: 'Toyota',
      modelo: 'Corolla',
      color: 'Blanco',
      propietario: 'Juan Pérez',
      estado: 'Estacionado',
      espacio: 'A-15',
      entrada: '10:30 AM',
    },
    {
      key: '2',
      id: 2,
      placa: 'XYZ-789',
      tipo: 'SUV',
      marca: 'Honda',
      modelo: 'CR-V',
      color: 'Negro',
      propietario: 'María González',
      estado: 'Fuera',
      espacio: '-',
      entrada: '-',
    },
    {
      key: '3',
      id: 3,
      placa: 'DEF-456',
      tipo: 'Hatchback',
      marca: 'Volkswagen',
      modelo: 'Golf',
      color: 'Azul',
      propietario: 'Carlos Rodríguez',
      estado: 'Estacionado',
      espacio: 'B-08',
      entrada: '09:15 AM',
    },
  ];

  const columns = [
    {
      title: 'Vehículo',
      dataIndex: 'placa',
      key: 'placa',
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: '16px' }}>{text}</Text>
          <Text type="secondary">{record.marca} {record.modelo}</Text>
        </Space>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (tipo) => <Tag color="blue">{tipo}</Tag>,
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Propietario',
      dataIndex: 'propietario',
      key: 'propietario',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
        <Tag color={estado === 'Estacionado' ? 'green' : 'orange'}>
          {estado}
        </Tag>
      ),
    },
    {
      title: 'Espacio',
      dataIndex: 'espacio',
      key: 'espacio',
      render: (espacio) => (
        <Text strong style={{ color: espacio !== '-' ? '#1890ff' : '#999' }}>
          {espacio}
        </Text>
      ),
    },
    {
      title: 'Entrada',
      dataIndex: 'entrada',
      key: 'entrada',
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

  return (
    <AppLayout>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            🚗 Gestión de Vehículos
          </Title>
          <Text type="secondary">
            Administra los vehículos registrados en el sistema
          </Text>
        </div>

        {/* Estadísticas */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total Vehículos"
                value={vehiculos.length}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Estacionados"
                value={vehiculos.filter(v => v.estado === 'Estacionado').length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Fuera"
                value={vehiculos.filter(v => v.estado === 'Fuera').length}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Espacios Libres"
                value={156 - vehiculos.filter(v => v.estado === 'Estacionado').length}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabla de vehículos */}
        <Card
          title="Lista de Vehículos"
          extra={
            <Space>
              <Button icon={<SearchOutlined />}>
                Buscar
              </Button>
              <Button type="primary" icon={<PlusOutlined />}>
                Registrar Vehículo
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={vehiculos}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} vehículos`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>

        {/* Mapa de espacios (simulado) */}
        <Card
          title="🗺️ Mapa de Espacios"
          style={{ marginTop: '24px' }}
        >
          <div style={{
            height: '300px',
            background: 'linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
          }}>
            🗺️ Vista del Mapa de Estacionamiento
            <br />
            (Aquí iría una representación visual de los espacios)
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Vehiculos;