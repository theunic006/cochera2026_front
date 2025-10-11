import React, { useState, useEffect } from 'react';
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
  ClockCircleOutlined, 
  PlusOutlined, 
  FieldTimeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { toleranceService } from '../../services/toleranceService';
import AppLayout from '../AppLayout';
import ToleranceFormSimple from './ToleranceFormSimple';
import TableBase from '../common/TableBase';

const { Title } = Typography;

const ToleranceList = () => {
  const [loading, setLoading] = useState(false);
  const [tolerances, setTolerances] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingTolerance, setEditingTolerance] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });

  useEffect(() => {
    loadTolerances();
  }, []);

  const loadTolerances = async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const response = await toleranceService.getTolerances(page, pageSize);
      
      if (response.success) {
        setTolerances(response.data);
        setPagination({
          current: response.pagination.current_page,
          pageSize: response.pagination.per_page,
          total: response.pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '15', '20', '50', '100'],
        });
      } else {
        message.error('Error al cargar tolerancias');
      }
    } catch (error) {
      console.error('Error al cargar tolerancias:', error);
      message.error('Error al cargar tolerancias');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTolerance(null);
    setFormVisible(true);
  };

  const handleEdit = (tolerance) => {
    setEditingTolerance(tolerance);
    setFormVisible(true);
  };

  const handleDelete = async (id, name) => {
    try {
      const response = await toleranceService.deleteTolerance(id);
      
      if (response.success) {
        message.success(`Tolerancia de ${name} eliminada correctamente`);
        loadTolerances(pagination.current, pagination.pageSize);
      } else {
        message.error(response.message || 'Error al eliminar tolerancia');
      }
    } catch (error) {
      console.error('Error al eliminar tolerancia:', error);
      message.error('Error al eliminar la tolerancia');
    }
  };

  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingTolerance(null);
    loadTolerances(pagination.current, pagination.pageSize);
  };

  const handleTableChange = (newPagination) => {
    loadTolerances(newPagination.current, newPagination.pageSize);
  };

  // Función de filtrado personalizado para múltiples campos
  const customSearchFilter = (item, searchText) => {
    const searchLower = searchText.toLowerCase();
    
    // Buscar en descripción
    const descripcion = item.descripcion || '';
    if (descripcion.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en minutos
    const minutos = item.minutos?.toString() || '';
    if (minutos.includes(searchLower)) return true;
    
    return false;
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
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (descripcion) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#333' }}>
            {descripcion}
          </div>
        </div>
      ),
    },
    {
      title: 'Minutos',
      dataIndex: 'minutos',
      key: 'minutos',
      width: 120,
      render: (minutos) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#1890ff', fontSize: '16px' }}>
            {minutos}
          </div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            minutos
          </div>
        </div>
      ),
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date) => {
        if (!date) return '-';
        const formattedDate = new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        return formattedDate;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#722ed1' }}
            />
          </Tooltip>
          
          <Popconfirm
            title="¿Eliminar tolerancia?"
            description={`¿Estás seguro de eliminar la tolerancia "${record.descripcion}"?`}
            onConfirm={() => handleDelete(record.id, record.descripcion)}
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
          <FieldTimeOutlined style={{ marginRight: '8px' }} />
          Gestión de Tolerancias
        </Title>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Total Tolerancias"
                value={pagination.total}
                prefix={<FieldTimeOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Página Actual"
                value={pagination.current}
                prefix={<ClockCircleOutlined />}
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
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Promedio Minutos"
                value={tolerances.length > 0 ? Math.round(tolerances.reduce((sum, t) => sum + (t.minutos || 0), 0) / tolerances.length) : 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
                suffix="min"
              />
            </Card>
          </Col>
        </Row>

        <TableBase
          dataSource={tolerances}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} tolerancias`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onTableChange={handleTableChange}
          customSearchFilter={customSearchFilter}
          searchPlaceholder="Buscar por descripción o minutos..."
          title="Lista de Tolerancias"
          onReload={loadTolerances}
          extraActions={
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{ 
                backgroundColor: '#722ed1',
                borderColor: '#722ed1'
              }}
            >
              Nueva Tolerancia
            </Button>
          }
        />

        {/* Modal del formulario */}
        <ToleranceFormSimple
          visible={formVisible}
          onCancel={() => {
            setFormVisible(false);
            setEditingTolerance(null);
          }}
          onSuccess={handleFormSuccess}
          editingTolerance={editingTolerance}
        />
      </div>
    </AppLayout>
  );
};

export default ToleranceList;