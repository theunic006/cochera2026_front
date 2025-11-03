import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Typography, message } from 'antd';
import { CalendarOutlined, CarOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import { registroService } from '../services/registroService';
import RegistroForm from './RegistroForm';
import AppLayout from '../../../components/AppLayout';
import TableBase from '../../../components/common/TableBase';
import { useDebounce } from '../../../hooks';

const { Title } = Typography;

const RegistroList = () => {
  const [loading, setLoading] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });
  const [registroFormVisible, setRegistroFormVisible] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState(null);

  useEffect(() => {
    loadRegistros();
  }, []);

  // ✅ OPTIMIZACIÓN: useCallback - Carga de registros
  const loadRegistros = useCallback(async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const response = await registroService.getRegistros(page, pageSize);
      if (response.success) {
        setRegistros(response.data);
        setPagination({
          current: response.pagination?.current_page || page,
          pageSize: response.pagination?.per_page || pageSize,
          total: response.pagination?.total || response.data.length,
        });
      } else {
        message.error('Error al cargar registros');
      }
    } catch (error) {
      message.error(error.message || 'Error al cargar registros');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ OPTIMIZACIÓN: useCallback - Cambio de tabla
  const handleTableChange = useCallback((newPagination) => {
    loadRegistros(newPagination.current, newPagination.pageSize);
  }, [loadRegistros]);

  // ✅ OPTIMIZACIÓN: useCallback - Crear registro
  const handleCreateRegistro = useCallback(() => {
    setEditingRegistro(null);
    setRegistroFormVisible(true);
  }, []);

  // ✅ OPTIMIZACIÓN: useCallback - Editar registro
  const handleEditRegistro = useCallback((registro) => {
    setEditingRegistro(registro);
    setRegistroFormVisible(true);
  }, []);

  // ✅ OPTIMIZACIÓN: useCallback - Eliminar registro
  const handleDeleteRegistro = useCallback(async (registro) => {
    try {
      const response = await registroService.deleteRegistro(registro.id);
      if (response.success) {
        message.success('Registro eliminado exitosamente');
        loadRegistros(pagination.current, pagination.pageSize);
      } else {
        message.error('Error al eliminar registro');
      }
    } catch (error) {
      message.error(error.message || 'Error al eliminar registro');
    }
  }, [loadRegistros, pagination.current, pagination.pageSize]);

  // ✅ OPTIMIZACIÓN: useCallback - Éxito del formulario
  const handleFormSuccess = useCallback(() => { 
    setRegistroFormVisible(false);
    setEditingRegistro(null);
    loadRegistros(pagination.current, pagination.pageSize);
  }, [loadRegistros, pagination.current, pagination.pageSize]);

  // ✅ OPTIMIZACIÓN: useMemo - Configuración de columnas
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
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (id) => <span style={{ fontWeight: 'bold', color: '#722ed1' }}>#{id}</span>,
    },
        {
        title: 'Placa-R',
        dataIndex: 'placa',
        key: 'placa',
        render: (placa) => <span style={{color: '#11f72fff' }}><CarOutlined /> {placa}</span>,
    },
    {
        title: 'Placa-Edit',
        dataIndex: ['vehiculo', 'placa'],
        key: 'placa',
        render: (_, record) => record.vehiculo?.placa ? <span style={{color: '#ee2525ff'}}><CarOutlined /> {record.vehiculo.placa}</span> : <span style={{color: '#ee2525ff'}}>Sin placa</span>,
    },
    {
        title: 'Tipo de Vehículo',
        dataIndex: ['vehiculo', 'tipo_vehiculo'],
        key: 'tipo_vehiculo',
        render: (_, record) => {
            const tipo = record.vehiculo?.tipo_vehiculo;
            return tipo ? (
                <span>
                    <TagOutlined /> {tipo.nombre} 
                </span>
            ) : <span style={{color: '#aaa'}}>Sin tipo</span>;
        },
    },
    {
        title: 'Valor',
        dataIndex: ['vehiculo', 'tipo_vehiculo'],
        key: 'tipo_vehiculo',
        render: (_, record) => {
            const tipo = record.vehiculo?.tipo_vehiculo;
            return tipo ? (
                <span>
                    S/. {tipo.valor}.00 Soles
                </span>
            ) : <span style={{color: '#aaa'}}>Sin tipo</span>;
        },
    },
    {
        title: 'Usuario',
        dataIndex: 'user',
        key: 'user',
        render: (user) => <span style={{color: '#2d99b9ff' }}><UserOutlined /> {user}</span>,
    },
    {
        title: 'Fecha',
        dataIndex: 'fecha',
        key: 'fecha',
        render: (fecha) => <span><CalendarOutlined /> {fecha}</span>,
    },
  ], [handleEditRegistro, handleDeleteRegistro]);

  return (
    <AppLayout>
      <div>
        <TableBase
          columns={columns}
          dataSource={registros}
          loading={loading}
          pagination={pagination}
          onTableChange={handleTableChange}
          onReload={() => loadRegistros()}
          searchPlaceholder="Buscar por placa..."
          searchFilterKey="placa"
          title="Lista de Registros"
          statsTitle="Total Registros"
          statsIcon={<CalendarOutlined />}
          scroll={{ x: 800 }}
        />
        <RegistroForm
          visible={registroFormVisible}
          onCancel={() => {
            setRegistroFormVisible(false);
            setEditingRegistro(null);
          }}
          onSuccess={handleFormSuccess}
          editingRegistro={editingRegistro}
        />
      </div>
    </AppLayout>
  );
};

export default RegistroList;
