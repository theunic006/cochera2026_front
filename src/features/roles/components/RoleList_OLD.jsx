import { useState, useEffect, useCallback, useMemo } from 'react'; // ✅ OPTIMIZACIÓN
import { 
  Card, 
  Button, 
  Space, 
  Tag, 
  Avatar, 
  Row, 
  Col, 
  Statistic, 
  message,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  ExclamationCircleOutlined,
  SecurityScanOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { roleService } from '../services/roleService';
import RoleForm from './RoleForm';
import AppLayout from '../../../components/AppLayout';
import TableBase from '../../../components/common/TableBase';
import { useDebounce } from '../../../hooks'; // ✅ OPTIMIZACIÓN

const RoleList = () => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });
  
  // Estados para modales
  const [roleFormVisible, setRoleFormVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  
  // Estados para responsividad
  const [isMobile, setIsMobile] = useState(false);
  
  // Estados para búsqueda
  const [searchText, setSearchText] = useState('');
  
  // ✅ OPTIMIZACIÓN: Aplicar debounce a la búsqueda (500ms)
  const debouncedSearchText = useDebounce(searchText, 500);

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * ✅ OPTIMIZACIÓN: useCallback - Cargar roles desde la API
   */
  const loadRoles = useCallback(async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const response = await roleService.getRoles(page, pageSize);
      
      if (response.success) {
        setRoles(response.data);
        setPagination({
          current: response.pagination?.current_page || page,
          pageSize: response.pagination?.per_page || pageSize,
          total: response.pagination?.total || response.data.length,
        });
      } else {
        message.error('Error al cargar roles');
      }
    } catch (error) {
      message.error(error.message || 'Error al cargar roles');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar roles al inicializar
  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  /**
   * ✅ OPTIMIZACIÓN: useCallback - Manejar cambio de página
   */
  const handleTableChange = useCallback((newPagination) => {
    loadRoles(newPagination.current, newPagination.pageSize);
  }, [loadRoles]);

  /**
   * ✅ OPTIMIZACIÓN: useCallback - Función de filtrado personalizado
   */
  const customSearchFilter = useCallback((item, searchText) => {
    const searchLower = searchText.toLowerCase();
    
    // Buscar en descripción
    const descripcion = item.descripcion || '';
    if (descripcion.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en estado
    const estado = item.estado || '';
    if (estado.toLowerCase().includes(searchLower)) return true;
    
    return false;
  }, []);

  /**
   * ✅ OPTIMIZACIÓN: useCallback - Abrir modal para crear rol
   */
  const handleCreateRole = useCallback(() => {
    setEditingRole(null);
    setRoleFormVisible(true);
  }, []);

  /**
   * ✅ OPTIMIZACIÓN: useCallback - Abrir modal para editar rol
   */
  const handleEditRole = useCallback((role) => {
    setEditingRole(role);
    setRoleFormVisible(true);
  }, []);

  /**
   * ✅ OPTIMIZACIÓN: useCallback - Eliminar rol
   */
  const handleDeleteRole = useCallback(async (roleId, roleName) => {
    try {
      const response = await roleService.deleteRole(roleId);
      
      if (response.success) {
        message.success(`Rol ${roleName} eliminado exitosamente`);
        // Recargar la lista
        loadRoles(pagination.current, pagination.pageSize);
      } else {
        message.error('Error al eliminar rol');
      }
    } catch (error) {
      message.error(error.message || 'Error al eliminar rol');
    }
  }, [loadRoles, pagination.current, pagination.pageSize]);

  /**
   * ✅ OPTIMIZACIÓN: useCallback - Manejar éxito en formulario
   */
  const handleFormSuccess = useCallback(() => {
    setRoleFormVisible(false);
    setEditingRole(null);
    
    // Recargar la lista
    loadRoles(pagination.current, pagination.pageSize);
  }, [loadRoles, pagination.current, pagination.pageSize]);

  // ✅ OPTIMIZACIÓN: useMemo - Configuración de columnas de la tabla
  const columns = useMemo(() => [
    {
      title: 'Rol',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (descripcion, record) => (
        <Space>
          <Avatar 
            icon={<SecurityScanOutlined />} 
            style={{ backgroundColor: '#722ed1' }}
          />
          <div>
            <div style={{ fontWeight: 'bold', color: '#722ed1' }}>{descripcion}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ID: {record.id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado_info',
      key: 'status',
      width: 100,
      render: (estadoInfo, record) => {
        if (estadoInfo) {
          return (
            <Tag color={estadoInfo.is_active ? 'green' : 'red'}>
              {estadoInfo.label}
            </Tag>
          );
        }
        // Fallback si no existe estado_info
        return (
          <Tag color={record.estado === 'activo' ? 'green' : 'red'}>
            {record.estado === 'activo' ? 'Activo' : 'Suspendido'}
          </Tag>
        );
      },
    },
    {
      title: 'Usuarios',
      dataIndex: 'users_count',
      key: 'users_count',
      width: 100,
      render: (count = 0) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{count}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>usuarios</div>
        </div>
      ),
    },
    {
      title: 'Creado',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date) => {
        if (!date) return '-';
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
              onClick={() => handleEditRole(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="¿Eliminar rol?"
            description={`¿Estás seguro de eliminar el rol ${record.descripcion}?`}
            onConfirm={() => handleDeleteRole(record.id, record.descripcion)}
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
  ], [handleEditRole, handleDeleteRole]); // ✅ OPTIMIZACIÓN: Dependencias del useMemo

  // Estadísticas calculadas
  const activeRoles = roles.filter(role => role.is_active !== false).length;
  const inactiveRoles = roles.filter(role => role.is_active === false).length;
  const totalUsers = roles.reduce((sum, role) => sum + (role.users_count || 0), 0);

  return (
    <AppLayout>
      <div>
        {/* Estadísticas */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Total Roles"
                value={pagination.total}
                prefix={<SecurityScanOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Roles Activos"
                value={activeRoles}
                prefix={<SafetyCertificateOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Inactivos"
                value={inactiveRoles}
                prefix={<SecurityScanOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => loadRoles()}
                loading={loading}
                block
              >
                Actualizar
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Tabla principal con TableBase */}
        <TableBase
          dataSource={roles}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: !isMobile,
            pageSizeOptions: ['10', '15', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} roles`,
            size: 'default',
          }}
          onTableChange={handleTableChange}
          customSearchFilter={customSearchFilter}
          searchPlaceholder="Buscar roles..."
          title="Lista de Roles"
          onReload={loadRoles}
          extraActions={
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateRole}
              style={{ 
                minWidth: isMobile ? 'auto' : 'auto',
                padding: isMobile ? '4px 8px' : undefined,
                backgroundColor: '#722ed1',
                borderColor: '#722ed1'
              }}
            >
              {!isMobile && 'Nuevo Rol'}
            </Button>
          }
          scroll={{ x: isMobile ? 800 : undefined }}
        />

        {/* Modal de formulario */}
        <RoleForm
          visible={roleFormVisible}
          onCancel={() => {
            setRoleFormVisible(false);
            setEditingRole(null);
          }}
          onSuccess={handleFormSuccess}
          editingRole={editingRole}
        />
      </div>
    </AppLayout>
  );
};

export default RoleList;