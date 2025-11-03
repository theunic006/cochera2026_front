import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  message,
  Row,
  Col,
  Statistic,
  Tooltip,
  Popconfirm,
  Tag
} from 'antd';
import { 
  CarOutlined, 
  PlusOutlined, 
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { vehicleService } from '../services/vehicleService';
import AppLayout from '../../../components/AppLayout';
import VehicleFormSimple from './VehicleFormSimple';
import VehicleOwnersModal from './VehicleOwnersModal';
import TableBase from '../../../components/common/TableBase';
import { useDebounce } from '../../../hooks'; // ✅ OPTIMIZACIÓN: Hook de debounce

const { Title } = Typography;

const VehicleListSimple = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [ownersModalVisible, setOwnersModalVisible] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedVehiclePlaca, setSelectedVehiclePlaca] = useState('');
  const [searchText, setSearchText] = useState(''); // ✅ OPTIMIZACIÓN: Estado para búsqueda
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });

  // ✅ OPTIMIZACIÓN: Aplicar debounce a la búsqueda (500ms)
  const debouncedSearchText = useDebounce(searchText, 500);

  // ✅ OPTIMIZACIÓN: useCallback para evitar recreación de función
  const loadVehicles = useCallback(async (page = 1, perPage = 15) => {
    setLoading(true);
    try {
      const response = await vehicleService.getVehicles(page, perPage);
      
      if (response.success && response.data) {
        setVehicles(response.data);
        setFilteredVehicles(response.data); // Inicializar datos filtrados
        setPagination(prev => ({
          ...prev,
          current: response.pagination.current_page,
          pageSize: response.pagination.per_page,
          total: response.pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '15', '20', '50', '100'],
        }));
      } else {
        message.error('Error al cargar vehículos');
      }
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      message.error('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Sin dependencias porque no usa variables externas

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // ✅ OPTIMIZACIÓN: useCallback para handlers
  const handleCreate = useCallback(() => {
    setEditingVehicle(null);
    setFormVisible(true);
  }, []);

  const handleEdit = useCallback((vehicle) => {
    setEditingVehicle(vehicle);
    setFormVisible(true);
  }, []);

  const handleDelete = useCallback(async (id, placa) => {
    try {
      const response = await vehicleService.deleteVehicle(id);
      
      if (response.success) {
        message.success(`Vehículo con placa "${placa}" eliminado correctamente`);
        loadVehicles(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Error al eliminar vehículo');
      }
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      message.error('Error al eliminar el vehículo');
    }
  }, [loadVehicles, pagination.current, pagination.pageSize]);

  const handleFormSuccess = useCallback(() => {
    setFormVisible(false);
    setEditingVehicle(null);
    loadVehicles(pagination.current, pagination.pageSize);
  }, [loadVehicles, pagination.current, pagination.pageSize]);

  const handleTableChange = useCallback((newPagination) => {
    loadVehicles(newPagination.current, newPagination.pageSize);
  }, [loadVehicles]);

  // ✅ OPTIMIZACIÓN: useCallback para funciones de filtrado y handlers
  const customSearchFilter = useCallback((item, searchText) => {
    const searchLower = searchText.toLowerCase();
    
    // Buscar en placa
    const placa = item.placa || '';
    if (placa.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en marca
    const marca = item.marca || '';
    if (marca.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en modelo
    const modelo = item.modelo || '';
    if (modelo.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en color
    const color = item.color || '';
    if (color.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en tipo
    const tipoVehiculo = item.tipo_vehiculo?.nombre || '';
    if (tipoVehiculo.toLowerCase().includes(searchLower)) return true;
    
    return false;
  }, []);

  // ✅ OPTIMIZACIÓN: useCallback para handler de modal
  const handleViewOwners = useCallback((vehicleId, vehiclePlaca) => {
    setSelectedVehicleId(vehicleId);
    setSelectedVehiclePlaca(vehiclePlaca);
    setOwnersModalVisible(true);
  }, []);

  // ✅ OPTIMIZACIÓN: useMemo para columnas (solo se recalcula si cambian las dependencias)
  const columns = useMemo(() => [
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
      title: 'Placa',
      dataIndex: 'placa',
      key: 'placa',
      render: (placa) => (
        <div style={{ fontWeight: 'bold', color: '#333' }}>
          {placa}
        </div>
      ),
    },
    {
      title: 'Marca',
      dataIndex: 'marca',
      key: 'marca',
      render: (marca) => (
        <div style={{ color: '#666' }}>
          {marca}
        </div>
      ),
    },
    {
      title: 'Modelo',
      dataIndex: 'modelo',
      key: 'modelo',
      render: (modelo) => (
        <div style={{ color: '#666' }}>
          {modelo}
        </div>
      ),
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <Tag color="blue" style={{ fontWeight: 'bold' }}>
          {color}
        </Tag>
      ),
    },
    {
      title: 'Año',
      dataIndex: 'anio',
      key: 'anio',
      width: 80,
      render: (anio) => (
        <div style={{ textAlign: 'center' }}>
          <CalendarOutlined style={{ marginRight: '4px', color: '#722ed1' }} />
          {anio}
        </div>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo_vehiculo',
      key: 'tipo_vehiculo',
      render: (tipo_vehiculo) => (
        <Tag 
          color="purple" 
          style={{ fontWeight: 'bold' }}
        >
          <CarOutlined style={{ marginRight: '4px' }} />
          {tipo_vehiculo?.nombre || 'Sin tipo'}
        </Tag>
      ),
    },
    {
      title: 'Veces Ingresado',
      dataIndex: 'frecuencia',
      key: 'frecuencia',
      align: 'center',
      width: 120,
      render: (frecuencia) => (
        <Statistic
          value={frecuencia || 0}
          valueStyle={{ color: '#1890ff', fontWeight: 700, fontSize: 18 }}
        />
      ),
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date) => {
        if (!date) return '-';
        try {
          const formattedDate = new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
          return (
            <span style={{ color: '#666', fontSize: '12px' }}>
              {formattedDate}
            </span>
          );
        } catch (error) {
          return '-';
        }
      },
    },
    {
      title: 'Propietarios',
      key: 'propietarios',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<TeamOutlined />}
          onClick={() => handleViewOwners(record.id, record.placa)}
          style={{ 
            backgroundColor: '#722ed1',
            borderColor: '#722ed1'
          }}
        >
          Ver
        </Button>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#722ed1' }}
            />
          </Tooltip>
          
          <Popconfirm
            title="¿Eliminar vehículo?"
            description={`¿Estás seguro de eliminar el vehículo con placa "${record.placa}"?`}
            onConfirm={() => handleDelete(record.id, record.placa)}
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
  ], [pagination.current, pagination.pageSize, handleEdit, handleDelete, handleViewOwners]); // ✅ OPTIMIZACIÓN: Dependencias del useMemo

  return (
    <AppLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2} style={{ marginBottom: '24px', color: '#722ed1' }}>
          <CarOutlined style={{ marginRight: '8px' }} />
          Gestión de Vehículos
        </Title>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Total Vehículos"
                value={pagination.total}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Página Actual"
                value={pagination.current}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#1890ff' }}
                suffix={`de ${Math.ceil(pagination.total / pagination.pageSize)}`}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Por Página"
                value={pagination.pageSize}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Marcas Únicas"
                value={[...new Set(vehicles.map(v => v.marca).filter(Boolean))].length}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        <TableBase
          dataSource={vehicles}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} vehículos`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onTableChange={handleTableChange}
          customSearchFilter={customSearchFilter}
          searchPlaceholder="Buscar por placa, marca, modelo, color o tipo..."
          title="Lista de Vehículos"
          onReload={loadVehicles}
          // extraActions eliminado para ocultar el botón 'Nuevo Vehículo'
          extraActions={null}
        />

        {/* Modal del formulario */}
        <VehicleFormSimple
          visible={formVisible}
          onCancel={() => setFormVisible(false)}
          onSuccess={handleFormSuccess}
          editingVehicle={editingVehicle}
        />

        {/* Modal de propietarios */}
        <VehicleOwnersModal
          visible={ownersModalVisible}
          onCancel={() => setOwnersModalVisible(false)}
          vehicleId={selectedVehicleId}
          vehiclePlaca={selectedVehiclePlaca}
        />
      </div>
    </AppLayout>
  );
};

export default VehicleListSimple;