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
  IdcardOutlined,
  MailOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { ownerService } from '../../services/ownerService';
import OwnerForm from './OwnerForm';
import AppLayout from '../AppLayout';

const { Title, Text } = Typography;
const { Search } = Input;

const OwnerList = () => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);
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

  // Debug - monitorear cambios en ownerFormVisible
  useEffect(() => {
    console.log('🚀 ownerFormVisible cambió a:', ownerFormVisible);
  }, [ownerFormVisible]);

  /**
   * Cargar propietarios desde la API
   */
  const loadOwners = async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const response = await ownerService.getOwners(page, pageSize);
      
      if (response.success) {
        setOwners(response.data);
        setPagination({
          current: response.pagination?.current_page || page,
          pageSize: response.pagination?.per_page || pageSize,
          total: response.pagination?.total || response.data.length,
        });
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
      const response = await ownerService.searchOwners(value.trim(), 'nombres');
      
      if (response.success) {
        setOwners(response.data);
        setPagination({
          current: response.pagination?.current_page || 1,
          pageSize: response.pagination?.per_page || pageSize,
          total: response.pagination?.total || response.data.length,
        });
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
    if (isSearching && searchText) {
      handleSearch(searchText, newPagination.current, newPagination.pageSize);
    } else {
      loadOwners(newPagination.current, newPagination.pageSize);
    }
  };

  /**
   * Crear nuevo propietario
   */
  const handleCreateOwner = () => {
    console.log('🔥 Botón crear clickeado');
    console.log('🔥 Estado actual ownerFormVisible:', ownerFormVisible);
    setEditingOwner(null);
    setOwnerFormVisible(true);
    console.log('🔥 Estado ownerFormVisible actualizado a true');
  };

  /**
   * Editar propietario
   */
  const handleEditOwner = (owner) => {
    setEditingOwner(owner);
    setOwnerFormVisible(true);
  };

  /**
   * Eliminar propietario
   */
  const handleDeleteOwner = async (owner) => {
    try {
      const response = await ownerService.deleteOwner(owner.id);
      
      if (response.success) {
        message.success('Propietario eliminado exitosamente');
        
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

  // Configuración de columnas de la tabla
  const columns = [
    {
      title: 'Propietario',
      dataIndex: 'nombres',
      key: 'nombres',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
              {`${text} ${record.apellidos}`}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Documento',
      dataIndex: 'documento',
      key: 'documento',
      width: 120,
      render: (documento) => (
        <Tag color="orange">{documento}</Tag>
      ),
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      width: 130,
      render: (telefono) => (
        <Tag color="green">{telefono}</Tag>
      ),
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      key: 'direccion',
      ellipsis: true,
      render: (direccion) => (
        <Tooltip title={direccion}>
          <span>{direccion}</span>
        </Tooltip>
      ),
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
        return <span style={{ fontSize: '12px', color: '#666' }}>{formattedDate}</span>;
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
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditOwner(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          
          <Tooltip title="Eliminar">
            <Popconfirm
              title="¿Eliminar propietario?"
              description={`¿Está seguro de eliminar a ${record.nombres} ${record.apellidos}?`}
              onConfirm={() => handleDeleteOwner(record)}
              okText="Sí"
              cancelText="No"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                style={{ color: '#ff4d4f' }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Estadísticas calculadas
  const totalOwners = pagination.total;
  const ownersWithPhone = owners.filter(owner => owner.telefono).length;
  const ownersWithEmail = owners.filter(owner => owner.email).length;

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
              <Statistic
                title="Con Teléfono"
                value={ownersWithPhone}
                prefix={<PhoneOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Con Email"
                value={ownersWithEmail}
                prefix={<MailOutlined />}
                valueStyle={{ color: '#faad14' }}
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
      </div>
    </AppLayout>
  );
};

export default OwnerList;