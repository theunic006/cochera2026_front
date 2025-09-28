import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, message, Modal, Tooltip, Popconfirm, Statistic, Row, Col, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, CalendarOutlined, CarOutlined, UserOutlined, BankOutlined, TagOutlined } from '@ant-design/icons';
import { registroService } from '../../services/registroService';
import RegistroForm from './RegistroForm';
import AppLayout from '../AppLayout';
import { DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

const RegistroList = () => {
  const [loading, setLoading] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });
  const [searchText, setSearchText] = useState('');
  const [registroFormVisible, setRegistroFormVisible] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState(null);

  useEffect(() => {
    loadRegistros();
  }, []);

  const loadRegistros = async (page = 1, pageSize = 15) => {
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
  };

  const handleTableChange = (newPagination) => {
    loadRegistros(newPagination.current, newPagination.pageSize);
  };

  const handleCreateRegistro = () => {
    setEditingRegistro(null);
    setRegistroFormVisible(true);
  };

  const handleEditRegistro = (registro) => {
    setEditingRegistro(registro);
    setRegistroFormVisible(true);
  };

  const handleDeleteRegistro = async (registro) => {
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
  };

  const handleFormSuccess = () => { 
    setRegistroFormVisible(false);
    setEditingRegistro(null);
    loadRegistros(pagination.current, pagination.pageSize);
  };

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
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (id) => <span style={{ fontWeight: 'bold', color: '#722ed1' }}>#{id}</span>,
    },
    {
        title: 'Placa',
        dataIndex: ['vehiculo', 'placa'],
        key: 'placa',
        render: (_, record) => record.vehiculo?.placa ? <span><CarOutlined /> {record.vehiculo.placa}</span> : <span style={{color: '#aaa'}}>Sin placa</span>,
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
        title: 'Modelo',
        dataIndex: ['vehiculo', 'modelo'],
        key: 'modelo',
        render: (_, record) => record.vehiculo?.modelo || <span style={{color: '#aaa'}}>Sin modelo</span>,
    },
    {
        title: 'Marca',
        dataIndex: ['vehiculo', 'marca'],
        key: 'marca',
        render: (_, record) => record.vehiculo?.marca || <span style={{color: '#aaa'}}>Sin marca</span>,
    },
    {
        title: 'Color',
        dataIndex: ['vehiculo', 'color'],
        key: 'color',
        render: (_, record) => record.vehiculo?.color || <span style={{color: '#aaa'}}>Sin color</span>,
    },
    {
        title: 'Año',
        dataIndex: ['vehiculo', 'anio'],
        key: 'anio',
        render: (_, record) => record.vehiculo?.anio || <span style={{color: '#aaa'}}>Sin año</span>,
    },

    {
        title: 'Fecha',
        dataIndex: 'fecha',
        key: 'fecha',
        render: (fecha) => <span><CalendarOutlined /> {fecha}</span>,
    },
];

  return (
    <AppLayout>
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Total Registros"
                value={pagination.total}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => loadRegistros()}
                loading={loading}
                block
              >
                Actualizar
              </Button>
            </Card>
          </Col>
        </Row>
        <Card
          title="Lista de Registros"

        >
          <Table
            columns={columns}
            dataSource={registros}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '15', '20', '50', '100'],
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
              size: 'default',
            }}
            onChange={handleTableChange}
            rowKey="id"
            scroll={{ x: 800 }}
          />
        </Card>
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
