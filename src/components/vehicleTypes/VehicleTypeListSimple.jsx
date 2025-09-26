import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
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
  DollarOutlined
} from '@ant-design/icons';
import { vehicleTypeService } from '../../services/vehicleTypeService';
import AppLayout from '../AppLayout';
import VehicleTypeFormSimple from './VehicleTypeFormSimple';

const { Title } = Typography;

const VehicleTypeListSimple = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingVehicleType, setEditingVehicleType] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });

  useEffect(() => {
    loadVehicleTypes();
  }, []);

  const loadVehicleTypes = async (page = 1, perPage = 15) => {
    setLoading(true);
    try {
      const response = await vehicleTypeService.getVehicleTypes(page, perPage);
      
      if (response.success && response.data) {
        setVehicleTypes(response.data);
        setPagination({
          ...pagination,
          current: response.pagination.current_page,
          pageSize: response.pagination.per_page,
          total: response.pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '15', '20', '50', '100'],
        });
      } else {
        message.error('Error al cargar tipos de vehículo');
      }
    } catch (error) {
      console.error('Error al cargar tipos de vehículo:', error);
      message.error('Error al cargar tipos de vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVehicleType(null);
    setFormVisible(true);
  };

  const handleEdit = (vehicleType) => {
    setEditingVehicleType(vehicleType);
    setFormVisible(true);
  };

  const handleDelete = async (id, name) => {
    try {
      const response = await vehicleTypeService.deleteVehicleType(id);
      
      if (response.success) {
        message.success(`Tipo de vehículo "${name}" eliminado correctamente`);
        loadVehicleTypes(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Error al eliminar tipo de vehículo');
      }
    } catch (error) {
      console.error('Error al eliminar tipo de vehículo:', error);
      message.error('Error al eliminar el tipo de vehículo');
    }
  };

  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingVehicleType(null);
    loadVehicleTypes(pagination.current, pagination.pageSize);
  };

  const handleTableChange = (newPagination) => {
    loadVehicleTypes(newPagination.current, newPagination.pageSize);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#722ed1' }}>
          #{id}
        </div>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (nombre) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#333' }}>
            <CarOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
            {nombre}
          </div>
        </div>
      ),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      width: 120,
      render: (valor) => (
        <Tag 
          color="green"
          style={{ fontWeight: 'bold', fontSize: '14px' }}
        >
          <DollarOutlined />
          {parseFloat(valor).toFixed(2)}
        </Tag>
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
            title="¿Eliminar tipo de vehículo?"
            description={`¿Estás seguro de eliminar el tipo "${record.nombre}"?`}
            onConfirm={() => handleDelete(record.id, record.nombre)}
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
      <div style={{ padding: '24px' }}>
        <Title level={2} style={{ marginBottom: '24px', color: '#722ed1' }}>
          <CarOutlined style={{ marginRight: '8px' }} />
          Gestión de Tipos de Vehículo
        </Title>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Total Tipos"
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
                title="Valor Promedio"
                value={vehicleTypes.length > 0 ? (vehicleTypes.reduce((sum, t) => sum + parseFloat(t.valor || 0), 0) / vehicleTypes.length).toFixed(2) : 0}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="Lista de Tipos de Vehículo"
          extra={
            <Space size="middle">
              <Button 
                icon={<ReloadOutlined />}
                onClick={loadVehicleTypes}
                loading={loading}
              >
                Recargar
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreate}
                style={{ 
                  backgroundColor: '#722ed1',
                  borderColor: '#722ed1'
                }}
              >
                Nuevo Tipo
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={vehicleTypes}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} tipos de vehículo`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            onChange={handleTableChange}
          />
        </Card>

        {/* Modal del formulario */}
        <VehicleTypeFormSimple
          visible={formVisible}
          onCancel={() => setFormVisible(false)}
          onSuccess={handleFormSuccess}
          editingVehicleType={editingVehicleType}
        />
      </div>
    </AppLayout>
  );
};

export default VehicleTypeListSimple;