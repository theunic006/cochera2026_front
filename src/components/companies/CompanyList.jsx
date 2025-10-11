import { useState, useEffect } from 'react';
import { 
  Card, 
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
  Popconfirm,
  Select
} from 'antd';
import { 
  BankOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  TeamOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  StopOutlined,
  FilterOutlined,
  PauseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { companyService } from '../../services/companyService';
import CompanyForm from './CompanyForm';
import AppLayout from '../AppLayout';
import TableBase from '../common/TableBase';

const { Title, Text } = Typography;
const { Option } = Select;

const CompanyList = () => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });
  
  // Estados para filtros específicos (mantengo estos para funcionalidad avanzada)
  const [statusFilter, setStatusFilter] = useState('');
  const [availableStatuses, setAvailableStatuses] = useState([]);
  
  // Estados para modales
  const [companyFormVisible, setCompanyFormVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  
  // Estados para responsividad
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar empresas al montar el componente
  useEffect(() => {
    loadCompanies();
    // loadStatuses(); // Comentado temporalmente para evitar errores
    // Usar estados por defecto
    setAvailableStatuses([
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
      { value: 'suspendido', label: 'Suspendido' },
      { value: 'pendiente', label: 'Pendiente' }
    ]);
  }, []);

  // Cargar estados disponibles
  const loadStatuses = async () => {
    try {
      const response = await companyService.getStatuses();
      if (response.success && response.data && Array.isArray(response.data)) {
        setAvailableStatuses(response.data);
      } else {
        // Fallback con estados básicos si la API no funciona
        setAvailableStatuses([
          { value: 'activo', label: 'Activo' },
          { value: 'inactivo', label: 'Inactivo' },
          { value: 'suspendido', label: 'Suspendido' },
          { value: 'pendiente', label: 'Pendiente' }
        ]);
      }
    } catch (error) {

      setAvailableStatuses([
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' },
        { value: 'suspendido', label: 'Suspendido' },
        { value: 'pendiente', label: 'Pendiente' }
      ]);
    }
  };

  // Función para cargar empresas (simplificada)
  const loadCompanies = async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      let response;
      
      if (statusFilter) {
        // Si hay filtro de estado activo
        response = await companyService.getCompaniesByStatus(statusFilter, page, pageSize);
      } else {
        // Carga normal
        response = await companyService.getCompanies(page, pageSize);
      }

      if (response.success) {
        const companiesData = response.data || [];
        setCompanies(companiesData);
        setPagination({
          current: response.current_page || page,
          pageSize: response.per_page || pageSize,
          total: response.total || 0,
        });
      } else {
        message.error('Error al cargar empresas');
        setCompanies([]);
      }
    } catch (error) {
      message.error('Error al cargar empresas: ' + (error.message || 'Error desconocido'));
      setCompanies([]);
      setPagination({
        current: 1,
        pageSize: 15,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de página y tamaño de página
  const handleTableChange = (paginationInfo) => {
    loadCompanies(paginationInfo.current, paginationInfo.pageSize);
  };

  // Función de filtrado personalizado para múltiples campos
  const customSearchFilter = (item, searchText) => {
    const searchLower = searchText.toLowerCase();
    
    // Buscar en nombre
    const nombre = item.nombre || '';
    if (nombre.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en ubicación
    const ubicacion = item.ubicacion || '';
    if (ubicacion.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en estado
    const estado = item.estado || '';
    if (estado.toLowerCase().includes(searchLower)) return true;
    
    return false;
  };

  // Manejar filtro por estado (mantenido para funcionalidad específica)
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status) {
      loadCompanies(1, pagination.pageSize);
    } else {
      loadCompanies(1, pagination.pageSize);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setStatusFilter('');
    loadCompanies(1, pagination.pageSize);
  };

  // Función para crear nueva empresa
  const handleCreateCompany = () => {
    setEditingCompany(null);
    setCompanyFormVisible(true);
  };

  // Función para editar empresa
  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setCompanyFormVisible(true);
  };

  // Función para eliminar empresa
  const handleDeleteCompany = async (id, nombre) => {
    try {
      const response = await companyService.deleteCompany(id);
      if (response.success) {
        message.success(`Empresa "${nombre}" eliminada correctamente`);
        loadCompanies(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Error al eliminar la empresa');
      }
    } catch (error) {
      message.error('Error al eliminar la empresa');
    }
  };

  // Función para cambiar estado de empresa
  const handleChangeStatus = async (id, nombre, newStatus) => {
    try {
      let response;
      if (newStatus === 'activo') {
        response = await companyService.activateCompany(id);
      } else if (newStatus === 'suspendido') {
        response = await companyService.suspendCompany(id);
      } else {
        response = await companyService.changeCompanyStatus(id, newStatus);
      }
      
      if (response.success) {
        message.success(`Estado de "${nombre}" cambiado a ${newStatus}`);
        loadCompanies(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Error al cambiar estado');
      }
    } catch (error) {

      message.error('Error al cambiar estado de la empresa');
    }
  };

  // Función callback cuando se crea/edita exitosamente
  const handleFormSuccess = () => {
    setCompanyFormVisible(false);
    setEditingCompany(null);
    loadCompanies(pagination.current, pagination.pageSize);
  };

  // Estadísticas calculadas
  const statistics = {
    total: Array.isArray(companies) ? companies.length : 0,
    active: Array.isArray(companies) ? companies.filter(company => company.estado === 'activo').length : 0,
    inactive: Array.isArray(companies) ? companies.filter(company => company.estado === 'inactivo').length : 0,
    suspended: Array.isArray(companies) ? companies.filter(company => company.estado === 'suspendido').length : 0,
    pending: Array.isArray(companies) ? companies.filter(company => company.estado === 'pendiente').length : 0,
    totalUsers: Array.isArray(companies) ? companies.reduce((sum, company) => sum + (company.users_count || 0), 0) : 0
  };

  // Configuración de columnas de la tabla
  const columns = [
    {
      title: 'Empresa',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (nombre, record) => (
        <Space>
          <Avatar 
            icon={<BankOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{nombre}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.ubicacion || 'Sin ubicación'}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado_info',
      key: 'status',
      width: 120,
      render: (estadoInfo, record) => {
        if (estadoInfo) {
          return (
            <Tag color={estadoInfo.is_active ? 'green' : 'red'}>
              {estadoInfo.label}
            </Tag>
          );
        }
        // Fallback si no existe estado_info usando los 4 estados
        const getStatusColor = (estado) => {
          switch (estado) {
            case 'activo': return 'green';
            case 'inactivo': return 'orange'; 
            case 'suspendido': return 'red';
            case 'pendiente': return 'blue';
            default: return 'default';
          }
        };
        
        const getStatusLabel = (estado) => {
          switch (estado) {
            case 'activo': return 'Activo';
            case 'inactivo': return 'Inactivo';
            case 'suspendido': return 'Suspendido';
            case 'pendiente': return 'Pendiente';
            default: return estado;
          }
        };
        
        return (
          <Tag color={getStatusColor(record.estado)}>
            {getStatusLabel(record.estado)}
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
      width: 140,
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
      render: (_, record) => {
        const statusMenuItems = [
          {
            key: 'activo',
            label: (
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                Activar
              </Space>
            ),
            disabled: record.estado === 'activo',
            onClick: () => handleChangeStatus(record.id, record.nombre, 'activo'),
          },
          {
            key: 'inactivo',
            label: (
              <Space>
                <PauseCircleOutlined style={{ color: '#faad14' }} />
                Desactivar
              </Space>
            ),
            disabled: record.estado === 'inactivo',
            onClick: () => handleChangeStatus(record.id, record.nombre, 'inactivo'),
          },
          {
            key: 'suspendido',
            label: (
              <Space>
                <StopOutlined style={{ color: '#ff4d4f' }} />
                Suspender
              </Space>
            ),
            disabled: record.estado === 'suspendido',
            onClick: () => handleChangeStatus(record.id, record.nombre, 'suspendido'),
          },
          {
            key: 'pendiente',
            label: (
              <Space>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                Marcar Pendiente
              </Space>
            ),
            disabled: record.estado === 'pendiente',
            onClick: () => handleChangeStatus(record.id, record.nombre, 'pendiente'),
          },
        ];

        return (
          <Space size="small">
            <Tooltip title="Editar">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditCompany(record)}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>


            <Popconfirm
              title="¿Eliminar empresa?"
              description={`¿Estás seguro de eliminar la empresa ${record.nombre}?`}
              onConfirm={() => handleDeleteCompany(record.id, record.nombre)}
              okText="Sí, eliminar"
              cancelText="Cancelar"
              okType="danger"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <Tooltip title="Eliminar">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  style={{ color: '#ff4d4f' }}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div style={{ padding: '24px' }}>
        {/* Título y estadísticas */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                <BankOutlined style={{ marginRight: 8 }} />
                Lista de Empresas
              </Title>
            </div>
          </Col>
        </Row>

        {/* Estadísticas */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Total"
                value={statistics.total}
                prefix={<BankOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Activas"
                value={statistics.active}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Inactivas"
                value={statistics.inactive}
                prefix={<StopOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Suspendidas"
                value={statistics.suspended}
                prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Pendientes"
                value={statistics.pending}
                prefix={<StopOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Usuarios"
                value={statistics.totalUsers}
                prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filtros por estado (mantenidos para funcionalidad específica) */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Filtrar por estado"
                allowClear
                size="large"
                style={{ width: '100%' }}
                value={statusFilter}
                onChange={handleStatusFilter}
                suffixIcon={<FilterOutlined />}
              >
                {Array.isArray(availableStatuses) && availableStatuses.map(status => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={16}>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => loadCompanies(pagination.current, pagination.pageSize)}
                  loading={loading}
                >
                  Actualizar
                </Button>
                {statusFilter && (
                  <Button onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                )}
                {statusFilter && (
                  <Text type="secondary">
                    Filtrando por estado: {availableStatuses.find(s => s.value === statusFilter)?.label}
                  </Text>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Tabla con TableBase */}
        <TableBase
          dataSource={companies}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '15', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} empresas`,
            size: 'default',
          }}
          onTableChange={handleTableChange}
          customSearchFilter={customSearchFilter}
          searchPlaceholder="Buscar por nombre, ubicación o estado..."
          title="Lista de Empresas"
          onReload={loadCompanies}
          extraActions={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateCompany}
              style={{ backgroundColor: '#1890ff' }}
            >
              Nueva Empresa
            </Button>
          }
          scroll={{ x: 800 }}
          size={isMobile ? 'small' : 'middle'}
        />

        {/* Modal del formulario */}
        <CompanyForm
          visible={companyFormVisible}
          onCancel={() => {
            setCompanyFormVisible(false);
            setEditingCompany(null);
          }}
          onSuccess={handleFormSuccess}
          editingCompany={editingCompany}
        />
      </div>
    </AppLayout>
  );
};

export default CompanyList;