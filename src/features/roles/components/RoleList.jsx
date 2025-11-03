import { useState, useMemo } from 'react';
import { Row, Col, Space } from 'antd';
import { 
  SecurityScanOutlined,
  SafetyCertificateOutlined,
  StarOutlined
} from '@ant-design/icons';
import Avatar from '../../../components/atoms/Avatar';
import StatCard from '../../../components/molecules/StatCard';
import StatusBadge from '../../../components/molecules/StatusBadge';
import DataTable from '../../../components/organisms/DataTable';
import FormModal from '../../../components/organisms/FormModal';
import DeleteModalCustom from '../../../components/organisms/DeleteModalCustom';
import AppLayout from '../../../components/AppLayout';
import RoleFormFields from './RoleFormFields';
import { useRoles } from '../hooks/useRoles'; 

/**
 * RoleList - Gestión de roles con CRUD completo
 * Usa: useRoles, StatCard, DataTable, FormModal, DeleteModalR
 */
const RoleList = () => {
  const {
    roles,
    loading,
    pagination,
    stats,
    createRole,
    updateRole,
    deleteRole,
    refresh,
    handlePageChange,
  } = useRoles();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  // Estado para DeleteModal (controlado como FormModal)
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const isEditing = !!editingRole;

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const filteredRoles = useMemo(() => {
    if (!searchValue) return roles;
    const searchLower = searchValue.toLowerCase();
    return roles.filter(role => 
      role.descripcion?.toLowerCase().includes(searchLower) ||
      role.estado?.toLowerCase().includes(searchLower)
    );
  }, [roles, searchValue]);

  const handleCreate = () => {
    setEditingRole(null);
    setModalVisible(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setModalVisible(true);
  };

  const handleDelete = (role) => {
    setRoleToDelete(role);
    setDeleteVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    
    const result = await deleteRole(roleToDelete.id, roleToDelete.descripcion);
    
    if (result.success) {
      setDeleteVisible(false);
      setRoleToDelete(null);
    }
  };

  const handleFormSubmit = async (values) => {
    setFormLoading(true);
    
    const roleData = {
      descripcion: values.name.trim(),
      estado: values.is_active ? 'activo' : 'suspendido'
    };

    const result = isEditing 
      ? await updateRole(editingRole.id, roleData)
      : await createRole(roleData);

    setFormLoading(false);

    if (result.success) {
      setEditingRole(null);
      return true;
    } else if (result.errors) {
      throw result.errors;
    }
    return false;
  };

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
            <div style={{ fontWeight: 'bold', color: '#722ed1' }}>
              {descripcion}
            </div>
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
      width: 120,
      render: (estadoInfo, record) => {
        const isActive = estadoInfo?.is_active !== false;
        return (
          <StatusBadge 
            status={isActive ? 'active' : 'inactive'}
            text={isActive ? 'Activo' : 'Suspendido'}
          />
        );
      },
    },
    {
      title: 'Usuarios',
      dataIndex: 'users_count',
      key: 'users_count',
      width: 100,
      align: 'center',
      render: (count = 0) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff', fontSize: 18 }}>
            {count}
          </div>
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
  ], []);

  const formInitialValues = editingRole ? {
    name: editingRole.descripcion,
    is_active: editingRole.estado_info?.is_active !== false,
  } : {
    is_active: true,
  };

  return (
    <AppLayout>
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ 
            fontSize: 24, 
            fontWeight: 600, 
            margin: 0, 
            color: '#858585ff',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <SecurityScanOutlined style={{ color: '#722ed1' }} />
            Gestión de Roles
          </h1>
        </div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <StatCard
              title="Total Roles"
              value={stats.total}
              prefix={<SecurityScanOutlined />}
              color="primary"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard
              title="Roles Activos"
              value={stats.active}
              prefix={<SafetyCertificateOutlined />}
              color="success"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard
              title="Inactivos"
              value={stats.inactive}
              prefix={<SecurityScanOutlined />}
              color="danger"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard
              title="Total Usuarios"
              value={stats.totalUsers}
              prefix={<StarOutlined />}
              color="info"
            />
          </Col>
        </Row>

        <DataTable
          title=""
          dataSource={filteredRoles}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePageChange,
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onRefresh={refresh}
          createButtonText="Nuevo Rol"
          refreshButtonText="Actualizar"
          createButtonColor="purple"
          refreshButtonColor="primary"
          searchPlaceholder="Buscar por nombre o estado..."
          onSearch={handleSearch}
          searchBarWidth={300}
          showSearchBar={true}
          showCreateButton={true}
          showRefreshButton={true}
          emptyText="No hay roles registrados"
          emptyDescription="Crea el primer rol para empezar"
        />

        {modalVisible && (
          <FormModal
            key={editingRole?.id || 'new'}
            visible={modalVisible}
            title={
              <Space>
                <SecurityScanOutlined style={{ color: '#722ed1' }} />
                {isEditing ? 'Editar Rol' : 'Crear Nuevo Rol'}
              </Space>
            }
            onCancel={() => {
              setModalVisible(false);
              setEditingRole(null);
            }}
            onSubmit={handleFormSubmit}
            initialValues={formInitialValues}
            confirmLoading={formLoading}
            okText={isEditing ? 'Actualizar' : 'Crear'}
            width={600}
          >
            <RoleFormFields />
          </FormModal>
        )}

        {/* DeleteModalCustom - Modal 100% custom con CSS puro */}
        <DeleteModalCustom
          visible={deleteVisible}
          title="¿Eliminar rol?"
          itemName={roleToDelete?.descripcion}
          onCancel={() => {
            setDeleteVisible(false);
            setRoleToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppLayout>
  );
};

export default RoleList;
