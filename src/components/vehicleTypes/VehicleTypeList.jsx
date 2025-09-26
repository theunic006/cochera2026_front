import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Avatar, 
  Input, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  message,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  CarOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { vehicleTypeService } from '../../services/vehicleTypeService';
import VehicleTypeForm from './VehicleTypeForm';
import AppLayout from '../AppLayout';

const { Title, Text } = Typography;
const { Search } = Input;

const VehicleTypeList = () => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });
  
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados para el formulario
  const [showForm, setShowForm] = useState(false);
  const [editingVehicleType, setEditingVehicleType] = useState(null);
  
  // Estado para responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Efecto para detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar tipos de vehículos al montar el componente
  useEffect(() => {
    loadVehicleTypes();
  }, []);

  // Función para cargar los tipos de vehículos
  const loadVehicleTypes = async (page = 1, pageSize = 15, search = '') => {
    setLoading(true);
    try {
      const result = await vehicleTypeService.getVehicleTypes(page, pageSize, search);
      
      if (result.success) {
        setVehicleTypes(result.data);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: result.pagination?.total || result.data.length,
        }));
      } else {
        message.error(result.message);
        setVehicleTypes([]);
      }
    } catch (error) {
      console.error('Error al cargar tipos de vehículos:', error);
      message.error('Error al cargar los tipos de vehículos');
      setVehicleTypes([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Manejar cambios en la paginación
  const handleTableChange = (newPagination, filters, sorter) => {
    loadVehicleTypes(newPagination.current, newPagination.pageSize, searchTerm);
  };

  // Manejar búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
    setIsSearching(true);
    setPagination(prev => ({ ...prev, current: 1 }));
    loadVehicleTypes(1, pagination.pageSize, value);
  };

  // Manejar creación de nuevo tipo de vehículo
  const handleCreateVehicleType = () => {
    setEditingVehicleType(null);
    setShowForm(true);
  };

  // Manejar edición de tipo de vehículo
  const handleEditVehicleType = (vehicleType) => {
    setEditingVehicleType(vehicleType);
    setShowForm(true);
  };

  // Manejar eliminación de tipo de vehículo
  const handleDeleteVehicleType = async (vehicleTypeId, vehicleTypeName) => {
    try {
      const result = await vehicleTypeService.deleteVehicleType(vehicleTypeId);
      
      if (result.success) {
        message.success(`Tipo de vehículo "${vehicleTypeName}" eliminado exitosamente`);
        loadVehicleTypes(pagination.current, pagination.pageSize, searchTerm);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Error al eliminar tipo de vehículo:', error);
      message.error('Error al eliminar el tipo de vehículo');
    }
  };

  // Manejar éxito del formulario
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingVehicleType(null);
    loadVehicleTypes(pagination.current, pagination.pageSize, searchTerm);
  };

  // Estadísticas calculadas
  const statistics = {
    total: Array.isArray(vehicleTypes) ? vehicleTypes.length : 0,
    conValor: Array.isArray(vehicleTypes) ? vehicleTypes.filter(vt => vt.tiene_valor).length : 0,
    sinValor: Array.isArray(vehicleTypes) ? vehicleTypes.filter(vt => !vt.tiene_valor).length : 0,
    valorPromedio: Array.isArray(vehicleTypes) && vehicleTypes.length > 0 
      ? (vehicleTypes.reduce((sum, vt) => sum + (vt.valor || 0), 0) / vehicleTypes.filter(vt => vt.tiene_valor).length).toFixed(2)
      : 0,
  };

  // Configuración de columnas de la tabla
  const columns = [
    {
      title: 'Tipo de Vehículo',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (nombre, record) => (
        <Space>
          <Avatar 
            icon={<CarOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
              {record.nombre_formateado || nombre}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ID: {record.id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      width: 120,
      render: (valor, record) => (
        <div style={{ textAlign: 'center' }}>
          {record.tiene_valor ? (
            <Tag 
              icon={<DollarOutlined />}
              color="green"
              style={{ fontSize: '14px' }}
            >
              ${record.valor_formateado || valor}
            </Tag>
          ) : (
            <Tag 
              icon={<CloseCircleOutlined />}
              color="red"
            >
              Sin valor
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Estado Valor',
      dataIndex: 'tiene_valor',
      key: 'tiene_valor',
      width: 130,
      render: (tieneValor) => (
        <Tag 
          icon={tieneValor ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={tieneValor ? 'green' : 'red'}
        >
          {tieneValor ? 'Con valor' : 'Sin valor'}
        </Tag>
      ),
    },
    {
      title: 'Creado',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date) => {
        if (!date) return <Text type="secondary">No disponible</Text>;
        const formattedDate = new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        const formattedTime = new Date(date).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return (
          <div>
            <div>{formattedDate}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{formattedTime}</div>
          </div>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditVehicleType(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          
          <Popconfirm
            title="¿Eliminar tipo de vehículo?"
            description={`¿Estás seguro de eliminar "${record.nombre}"?`}
            onConfirm={() => handleDeleteVehicleType(record.id, record.nombre)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okType="danger"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Tooltip title="Eliminar">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        {/* Título */}
        <Title level={2} style={{ marginBottom: '24px', color: '#1890ff' }}>
          <CarOutlined style={{ marginRight: '8px' }} />
          Gestión de Tipos de Vehículos
        </Title>

        {/* Tarjetas de estadísticas */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Total Tipos"
                value={statistics.total}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Con Valor"
                value={statistics.conValor}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Sin Valor"
                value={statistics.sinValor}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Valor Promedio"
                value={statistics.valorPromedio}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#722ed1' }}
                suffix="$"
              />
            </Card>
          </Col>
        </Row>

        {/* Botón actualizar independiente */}
        <Row style={{ marginBottom: '16px' }}>
          <Col span={24}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadVehicleTypes()}
              loading={loading}
              type="default"
              style={{ marginRight: '8px' }}
            >
              Actualizar Lista
            </Button>
          </Col>
        </Row>

        {/* Tabla principal */}
        <Card
          title="Lista de Tipos de Vehículos"
          extra={
            <Space>
              <Search
                placeholder="Buscar tipos de vehículos..."
                allowClear
                onSearch={handleSearch}
                onChange={(e) => {
                  if (!e.target.value) {
                    handleSearch('');
                  }
                }}
                style={{ width: isMobile ? 150 : 200 }}
                loading={loading && isSearching}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateVehicleType}
                style={{ 
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                }}
              >
                {isMobile ? '' : 'Nuevo Tipo'}
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={vehicleTypes}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: !isMobile,
              showQuickJumper: !isMobile,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} tipos de vehículos`,
              size: isMobile ? 'small' : 'default',
            }}
            onChange={handleTableChange}
            scroll={{ x: isMobile ? 800 : undefined }}
            size={isMobile ? 'small' : 'middle'}
          />
        </Card>

        {/* Formulario modal */}
        {showForm && (
          <VehicleTypeForm
            visible={showForm}
            onCancel={() => {
              setShowForm(false);
              setEditingVehicleType(null);
            }}
            onSuccess={handleFormSuccess}
            editingVehicleType={editingVehicleType}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default VehicleTypeList;