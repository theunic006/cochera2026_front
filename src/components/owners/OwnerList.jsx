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
  Modal,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  UserOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  TeamOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  IdcardOutlined,
  CarOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { ownerService } from '../../services/ownerService';
import OwnerForm from './OwnerForm';
import OwnerVehiclesModal from './OwnerVehiclesModal';
import AppLayout from '../AppLayout';

const { Title, Text } = Typography;
const { Search } = Input;

const OwnerList = () => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);
  const [vehiclesCount, setVehiclesCount] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });
  
  // Estados para búsqueda y filtros
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados para modales
  const [ownerFormVisible, setOwnerFormVisible] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [vehiclesModalVisible, setVehiclesModalVisible] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  
  // Estados para responsividad
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar propietarios al inicializar
  useEffect(() => {
    loadOwners();
  }, []);

  /**
   * Cargar propietarios desde la API
   */
  const loadOwners = async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const response = await ownerService.getOwners(page, pageSize);
      
      if (response.success) {
        // Actualizar paginación y propietarios de forma sincronizada
        const newPagination = {
          current: response.pagination.current_page,
          pageSize: response.pagination.per_page,
          total: response.pagination.total,
        };
        
        // Actualizar ambos estados juntos
        setPagination(newPagination);
        setOwners(response.data);
        
        // Cargar cantidad de vehículos para cada propietario
        loadVehiclesCount(response.data);
      } else {
        message.error('Error al cargar propietarios');
      }
    } catch (error) {
      message.error(error.message || 'Error al cargar propietarios');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buscar propietarios
   */
  const handleSearch = async (value, page = 1, pageSize = pagination.pageSize) => {
    setSearchText(value);
    
    if (!value.trim()) {
      // Si no hay texto, cargar todos los propietarios
      loadOwners(page, pageSize);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    
    try {
      const response = await ownerService.searchOwners(value.trim(), page, pageSize);
      
      if (response.success) {
        setOwners(response.data);
        setPagination({
          current: response.pagination.current_page,
          pageSize: response.pagination.per_page,
          total: response.pagination.total,
        });
        
        // Cargar cantidad de vehículos para cada propietario
        loadVehiclesCount(response.data);
      } else {
        message.error('Error en la búsqueda');
      }
    } catch (error) {
      message.error(error.message || 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar cambio de página y tamaño de página
   */
  const handleTableChange = (newPagination) => {
    // No actualizar el estado aquí - dejamos que loadOwners lo haga
    if (isSearching && searchText) {
      // Si estamos buscando, usar el endpoint de búsqueda
      handleSearch(searchText, newPagination.current, newPagination.pageSize);
    } else {
      // Cargar propietarios normalmente
      loadOwners(newPagination.current, newPagination.pageSize);
    }
  };

  /**
   * Abrir modal para crear propietario
   */
  const handleCreateOwner = () => {
    setEditingOwner(null);
    setOwnerFormVisible(true);
  };

  /**
   * Abrir modal para editar propietario
   */
  const handleEditOwner = (owner) => {
    setEditingOwner(owner);
    setOwnerFormVisible(true);
  };

  /**
   * Eliminar propietario
   */
  const handleDeleteOwner = async (ownerId, ownerName) => {
    try {
      const response = await ownerService.deleteOwner(ownerId);
      
      if (response.success) {
        message.success(`Propietario ${ownerName} eliminado exitosamente`);
        // Recargar la lista
        if (isSearching && searchText) {
          handleSearch(searchText);
        } else {
          loadOwners(pagination.current, pagination.pageSize);
        }
      } else {
        message.error('Error al eliminar propietario');
      }
    } catch (error) {
      message.error(error.message || 'Error al eliminar propietario');
    }
  };

  /**
   * Manejar éxito en formulario (crear/editar)
   */
  const handleFormSuccess = () => {
    setOwnerFormVisible(false);
    setEditingOwner(null);
    
    // Recargar la lista
    if (isSearching && searchText) {
      handleSearch(searchText);
    } else {
      loadOwners(pagination.current, pagination.pageSize);
    }
  };

  /**
   * Cargar cantidad de vehículos para todos los propietarios
   */
  const loadVehiclesCount = async (ownersList) => {
    const counts = {};
    const promises = ownersList.map(async (owner) => {
      try {
        const response = await ownerService.getOwnerVehicles(owner.id);
        if (response.success && response.data) {
          counts[owner.id] = response.data.vehiculos?.length || 0;
        } else {
          counts[owner.id] = 0;
        }
      } catch (error) {
        console.error(`Error loading vehicles for owner ${owner.id}:`, error);
        counts[owner.id] = 0;
      }
    });
    
    await Promise.all(promises);
    setVehiclesCount(counts);
  };

  /**
   * Abrir modal de vehículos
   */
  const handleViewVehicles = (owner) => {
    setSelectedOwner(owner);
    setVehiclesModalVisible(true);
  };

  // Configuración de columnas de la tabla
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#722ed1' }}>
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </div>
      ),
    },
    {
      title: 'Propietario',
      dataIndex: 'nombre_completo',
      key: 'nombre_completo',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <Space size="small">
                <IdcardOutlined style={{ fontSize: '10px' }} />
                {record.documento}
              </Space>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contacto',
      key: 'contacto',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', marginBottom: '4px' }}>
            <Space size="small">
              <PhoneOutlined style={{ fontSize: '10px' }} />
              {record.telefono}
            </Space>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <Space size="small">
              <MailOutlined style={{ fontSize: '10px' }} />
              {record.email}
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      key: 'direccion',
      width: 200,
      render: (text) => (
        <div style={{ fontSize: '12px' }}>
          <Space size="small">
            <HomeOutlined style={{ fontSize: '10px' }} />
            {text}
          </Space>
        </div>
      ),
    },
    {
      title: 'Vehículos',
      key: 'vehicles',
      width: 120,
      render: (_, record) => {
        const count = vehiclesCount[record.id] || 0;
        return (
          <Button
            type={count > 0 ? 'primary' : 'default'}
            size="small"
            icon={<CarOutlined />}
            onClick={() => handleViewVehicles(record)}
            style={{ 
              minWidth: '60px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {count} vehículo{count !== 1 ? 's' : ''}
          </Button>
        );
      },
    },
    {
      title: 'Registrado',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date) => {
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
              onClick={() => handleEditOwner(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="¿Eliminar propietario?"
            description={`¿Estás seguro de eliminar a ${record.nombre_completo}?`}
            onConfirm={() => handleDeleteOwner(record.id, record.nombre_completo)}
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

  // Estadísticas calculadas
  const totalOwners = pagination.total;

  return (
    <AppLayout>
      <div>
        {/* Estadísticas */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Total Propietarios"
                value={totalOwners}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => loadOwners()}
                loading={loading}
                block
              >
                Actualizar
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Tabla principal */}
        <Card
          title="Lista de Propietarios"
          extra={
            <Space>
              <Search
                placeholder="Buscar propietarios..."
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
                onClick={handleCreateOwner}
                style={{ 
                  minWidth: isMobile ? 'auto' : 'auto',
                  padding: isMobile ? '4px 8px' : undefined
                }}
              >
                {!isMobile && 'Nuevo Propietario'}
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={owners}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: !isMobile,
              pageSizeOptions: ['10', '15', '20', '50', '100'],
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} propietarios`,
              size: 'default',
            }}
            onChange={handleTableChange}
            rowKey="id"
            scroll={{ x: isMobile ? 800 : undefined }}
          />
        </Card>

        {/* Modal de formulario */}
        <OwnerForm
          visible={ownerFormVisible}
          onCancel={() => {
            setOwnerFormVisible(false);
            setEditingOwner(null);
          }}
          onSuccess={handleFormSuccess}
          editingOwner={editingOwner}
        />

        {/* Modal de vehículos */}
        <OwnerVehiclesModal
          visible={vehiclesModalVisible}
          onCancel={() => {
            setVehiclesModalVisible(false);
            setSelectedOwner(null);
          }}
          ownerId={selectedOwner?.id}
          ownerName={selectedOwner?.nombre_completo}
        />
      </div>
    </AppLayout>
  );
};

export default OwnerList;
