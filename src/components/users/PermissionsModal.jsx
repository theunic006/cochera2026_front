import React, { useState, useEffect } from 'react';
import { Modal, Switch, Table, Typography, Space, message, Tag } from 'antd';
import { SafetyOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { permissionService } from '../../services/permissionService';

const { Title, Text } = Typography;

const PermissionsModal = ({
  visible,
  onCancel,
  selectedUser
}) => {
  // Estados locales para permisos
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar permisos cuando se abre el modal
  useEffect(() => {
    if (visible && selectedUser) {
      loadPermissions();
    }
  }, [visible, selectedUser]);

  /**
   * Cargar todos los permisos y los permisos del usuario
   */
  const loadPermissions = async () => {
    setLoading(true);
    
    try {
      // Cargar todos los permisos disponibles
      const allPermsResponse = await permissionService.getAllPermissions();
      console.log('Respuesta de todos los permisos:', allPermsResponse);
      
      if (allPermsResponse.success) {
        // Manejar diferentes estructuras de respuesta
        let permissionsData = allPermsResponse.data;
        
        // Si data es un objeto con una propiedad que contiene el array
        if (permissionsData && typeof permissionsData === 'object' && !Array.isArray(permissionsData)) {
          // Buscar el array dentro del objeto
          const possibleArrayKeys = ['permissions', 'data', 'items'];
          for (const key of possibleArrayKeys) {
            if (Array.isArray(permissionsData[key])) {
              permissionsData = permissionsData[key];
              break;
            }
          }
        }
        
        setAllPermissions(Array.isArray(permissionsData) ? permissionsData : []);
      }
      
      // Cargar permisos del usuario
      const userPermsResponse = await permissionService.getUserPermissions(selectedUser.id);
      console.log('Respuesta de permisos del usuario:', userPermsResponse);
      
      if (userPermsResponse.success) {
        let userPermsData = userPermsResponse.data;
        
        // Manejar diferentes estructuras de respuesta
        if (userPermsData && typeof userPermsData === 'object' && !Array.isArray(userPermsData)) {
          // Buscar el array dentro del objeto
          const possibleArrayKeys = ['permissions', 'data', 'items'];
          for (const key of possibleArrayKeys) {
            if (Array.isArray(userPermsData[key])) {
              userPermsData = userPermsData[key];
              break;
            }
          }
        }
        
        // Convertir a array si no lo es
        const userPermsArray = Array.isArray(userPermsData) ? userPermsData : [];
        const userPermIds = userPermsArray.map(p => p.id || p);
        
        setSelectedPermissions(userPermIds);
      } else {
        // Si no hay permisos asignados, inicializar vacío
        setSelectedPermissions([]);
      }
    } catch (error) {
      console.error('Error al cargar permisos:', error);
      message.error(error.message || 'Error al cargar permisos');
      // Inicializar vacío en caso de error
      setAllPermissions([]);
      setSelectedPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar permisos del usuario
   */
  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const response = await permissionService.assignPermissions(
        selectedUser.id, 
        selectedPermissions
      );
      
      if (response.success) {
        message.success('Permisos actualizados exitosamente');
        handleClose();
      } else {
        message.error(response.message || 'Error al actualizar permisos');
      }
    } catch (error) {
      message.error(error.message || 'Error al actualizar permisos');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar cambio de selección de permisos
   */
  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  /**
   * Cerrar modal y limpiar estados
   */
  const handleClose = () => {
    setAllPermissions([]);
    setSelectedPermissions([]);
    onCancel();
  };
  /**
   * Agrupar permisos por módulo y tipo de acción
   */
  const groupPermissionsByModule = () => {
    const grouped = {};
    
    allPermissions.forEach(permission => {
      // Soportar nombres de campos en español e inglés
      const module = permission.module || permission.modulo || permission.módulo || 'Otros';
      const slug = permission.slug || '';
      
      // Determinar el tipo de acción desde el slug
      let action = 'view'; // Por defecto
      if (slug.includes('.view')) action = 'view';
      else if (slug.includes('.create')) action = 'create';
      else if (slug.includes('.edit')) action = 'edit';
      else if (slug.includes('.delete')) action = 'delete';
      else if (slug.includes('.assign')) action = 'assign';
      else if (slug.includes('.export')) action = 'export';
      
      if (!grouped[module]) {
        grouped[module] = {
          moduleName: module,
          permissions: {}
        };
      }
      
      grouped[module].permissions[action] = permission;
    });
    
    return Object.values(grouped);
  };

  /**
   * Verificar si un permiso está seleccionado
   */
  const isPermissionSelected = (permissionId) => {
    return selectedPermissions.includes(permissionId);
  };

  /**
   * Toggle de un permiso individual
   */
  const togglePermission = (permissionId) => {
    if (isPermissionSelected(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (
        <Text strong style={{ color: '#722ed1' }}>{index + 1}</Text>
      ),
    },
    {
      title: 'Módulo',
      dataIndex: 'moduleName',
      key: 'moduleName',
      width: 150,
      render: (text) => (
        <Text strong>{text}</Text>
      ),
    },
    {
      title: 'Ver',
      key: 'view',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const permission = record.permissions.view;
        return permission ? (
          <Switch
            checked={isPermissionSelected(permission.id)}
            onChange={() => togglePermission(permission.id)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            style={{
              backgroundColor: isPermissionSelected(permission.id) ? '#52c41a' : undefined
            }}
          />
        ) : (
          <Tag color="default"></Tag>
        );
      },
    },
    {
      title: 'Crear',
      key: 'create',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const permission = record.permissions.create;
        return permission ? (
          <Switch
            checked={isPermissionSelected(permission.id)}
            onChange={() => togglePermission(permission.id)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            style={{
              backgroundColor: isPermissionSelected(permission.id) ? '#52c41a' : undefined
            }}
          />
        ) : (
          <Tag color="default"></Tag>
        );
      },
    },
    {
      title: 'Actualizar',
      key: 'edit',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const permission = record.permissions.edit;
        return permission ? (
          <Switch
            checked={isPermissionSelected(permission.id)}
            onChange={() => togglePermission(permission.id)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            style={{
              backgroundColor: isPermissionSelected(permission.id) ? '#52c41a' : undefined
            }}
          />
        ) : (
          <Tag color="default"></Tag>
        );
      },
    },
    {
      title: 'Eliminar',
      key: 'delete',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const permission = record.permissions.delete;
        return permission ? (
          <Switch
            checked={isPermissionSelected(permission.id)}
            onChange={() => togglePermission(permission.id)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            style={{
              backgroundColor: isPermissionSelected(permission.id) ? '#52c41a' : undefined
            }}
          />
        ) : (
          <Tag color="default"></Tag>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <SafetyOutlined style={{ color: '#722ed1' }} />
          <span>Permisos Roles de Usuario - {selectedUser?.name}</span>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      onOk={handleSavePermissions}
      okText="Guardar"
      cancelText="Salir"
      width={900}
      confirmLoading={loading}
      okButtonProps={{ 
        disabled: loading,
        icon: <CheckOutlined />,
        style: { background: '#52c41a', borderColor: '#52c41a' }
      }}
      cancelButtonProps={{
        danger: true,
      }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text>Cargando permisos...</Text>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={groupPermissionsByModule()}
            rowKey="moduleName"
            pagination={false}
            size="middle"
            bordered
            scroll={{ y: 450 }}
            style={{ marginBottom: 16 }}
          />
          
          <div style={{ 
            padding: '12px 16px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text type="secondary">
              Permisos seleccionados: <Text strong style={{ color: '#722ed1' }}>{selectedPermissions.length}</Text>
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Total disponible: {allPermissions.length}
            </Text>
          </div>
        </>
      )}
      
      {allPermissions.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <Text type="secondary">No hay permisos disponibles</Text>
        </div>
      )}
    </Modal>
  );
};

export default PermissionsModal;
