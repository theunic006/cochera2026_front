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
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { userService } from '../../services/userService';
import UserForm from './UserForm';
import AppLayout from '../AppLayout';

const { Title, Text } = Typography;
const { Search } = Input;

const UserList = () => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '30', '50', '100'],
  });
  
  // Estados para búsqueda y filtros
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados para modales
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
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

  // Cargar usuarios al inicializar
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Cargar usuarios desde la API
   */
  const loadUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await userService.getUsers(page, pageSize);
      
      if (response.success) {
        // Actualizar paginación y usuarios de forma sincronizada
        const newPagination = {
          current: response.pagination.current_page,
          pageSize: response.pagination.per_page,
          total: response.pagination.total,
        };
        

        
        // Actualizar ambos estados juntos
        setPagination(newPagination);
        setUsers(response.data);
      } else {
        message.error('Error al cargar usuarios');
      }
    } catch (error) {
      message.error(error.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buscar usuarios
   */
  const handleSearch = async (value, page = 1, pageSize = pagination.pageSize) => {
    setSearchText(value);
    
    if (!value.trim()) {
      // Si no hay texto, cargar todos los usuarios
      loadUsers(page, pageSize);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    
    try {
      const response = await userService.searchUsers(value.trim(), page, pageSize);
      
      if (response.success) {
        setUsers(response.data);
        setPagination({
          current: response.pagination.current_page,
          pageSize: response.pagination.per_page,
          total: response.pagination.total,
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

    
    // No actualizar el estado aquí - dejamos que loadUsers lo haga
    if (isSearching && searchText) {
      // Si estamos buscando, usar el endpoint de búsqueda
      handleSearch(searchText, newPagination.current, newPagination.pageSize);
    } else {
      // Cargar usuarios normalmente
      loadUsers(newPagination.current, newPagination.pageSize);
    }
  };

  /**
   * Abrir modal para crear usuario
   */
  const handleCreateUser = () => {
    setEditingUser(null);
    setUserFormVisible(true);
  };

  /**
   * Abrir modal para editar usuario
   */
  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormVisible(true);
  };

  /**
   * Eliminar usuario
   */
  const handleDeleteUser = async (userId, userName) => {
    try {
      const response = await userService.deleteUser(userId);
      
      if (response.success) {
        message.success(`Usuario ${userName} eliminado exitosamente`);
        // Recargar la lista
        if (isSearching && searchText) {
          handleSearch(searchText);
        } else {
          loadUsers(pagination.current, pagination.pageSize);
        }
      } else {
        message.error('Error al eliminar usuario');
      }
    } catch (error) {
      message.error(error.message || 'Error al eliminar usuario');
    }
  };

  /**
   * Manejar éxito en formulario (crear/editar)
   */
  const handleFormSuccess = () => {
    setUserFormVisible(false);
    setEditingUser(null);
    
    // Recargar la lista
    if (isSearching && searchText) {
      handleSearch(searchText);
    } else {
      loadUsers(pagination.current, pagination.pageSize);
    }
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
      title: 'Usuario',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'email_verified_at',
      key: 'status',
      width: 100,
      render: (emailVerified) => (
        <Tag color={emailVerified ? 'green' : 'orange'}>
          {emailVerified ? 'Verificado' : 'Pendiente'}
        </Tag>
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
              onClick={() => handleEditUser(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="¿Eliminar usuario?"
            description={`¿Estás seguro de eliminar a ${record.name}?`}
            onConfirm={() => handleDeleteUser(record.id, record.name)}
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
  const activeUsers = users.filter(user => user.email_verified_at).length;
  const pendingUsers = users.filter(user => !user.email_verified_at).length;

  return (
    <AppLayout>
      <div>
        {/* Estadísticas */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Total Usuarios"
                value={pagination.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Usuarios Activos"
                value={activeUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Pendientes"
                value={pendingUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => loadUsers()}
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
          title="Lista de Usuarios"
          extra={
            <Space>
              <Search
                placeholder="Buscar usuarios..."
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
                onClick={handleCreateUser}
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
            dataSource={users}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: !isMobile,
              pageSizeOptions: ['10', '15', '20', '30', '50', '100'],
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} usuarios`,
              size: 'default',
            }}
            onChange={handleTableChange}
            rowKey="id"
            scroll={{ x: isMobile ? 800 : undefined }}
          />
        </Card>

        {/* Modal de formulario */}
        <UserForm
          visible={userFormVisible}
          onCancel={() => {
            setUserFormVisible(false);
            setEditingUser(null);
          }}
          onSuccess={handleFormSuccess}
          editingUser={editingUser}
        />
      </div>
    </AppLayout>
  );
};

export default UserList;