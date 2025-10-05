import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Row, Col, Statistic, Spin, Alert, Input } from 'antd';
import { EyeOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import observacionService from '../../services/observacionService';
import AppLayout from '../AppLayout';

const { Title } = Typography;

const ObservacionesList = () => {
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredObservaciones, setFilteredObservaciones] = useState([]);

  useEffect(() => {
    loadObservaciones();
  }, []);

  useEffect(() => {
    handleSearch(searchText);
  }, [observaciones]);

  const loadObservaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await observacionService.getObservaciones();
      if (response.success) {
        setObservaciones(response.data);
        setFilteredObservaciones(response.data);
      } else {
        setError('Error al cargar observaciones');
      }
    } catch (err) {
      setError('Error al cargar observaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredObservaciones(observaciones);
    } else {
      const lowerValue = value.toLowerCase();
      const filtered = observaciones.filter(obs =>
        obs.tipo?.toLowerCase().includes(lowerValue) ||
        obs.descripcion?.toLowerCase().includes(lowerValue) ||
        obs.vehiculo?.placa?.toLowerCase().includes(lowerValue)
      );
      setFilteredObservaciones(filtered);
    }
  };

  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Vehículo (Placa)',
      dataIndex: ['vehiculo', 'placa'],
      key: 'placa',
      render: (_, record) => record.vehiculo?.placa || '-',
    },
    {
      title: 'Frecuencia',
      dataIndex: ['vehiculo', 'frecuencia'],
      key: 'frecuencia',
      render: (_, record) => record.vehiculo?.frecuencia || '-',
    },
    {
      title: 'Fecha de Registro',
      dataIndex: 'created_at',
      key: 'created_at',
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
      title: 'Usuario',
      dataIndex: ['usuario', 'name'],
      key: 'usuario',
      render: (_, record) => record.usuario?.name || '-',
    },
  ];

  return (
    <AppLayout>
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Total Observaciones"
                value={filteredObservaciones.length}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Recargar"
                valueRender={() => (
                  <ReloadOutlined style={{ fontSize: 24, color: '#1890ff', cursor: 'pointer' }} onClick={loadObservaciones} />
                )}
              />
            </Card>
          </Col>
        </Row>
        <Card
          title="Lista de Observaciones"
          extra={
            <Input.Search
              placeholder="Buscar por tipo, descripción o placa..."
              allowClear
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 260 }}
            />
          }
        >
          {loading ? (
            <Spin tip="Cargando observaciones..." style={{ width: '100%' }} />
          ) : error ? (
            <Alert type="error" message={error} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredObservaciones}
              rowKey="id"
              pagination={{ pageSize: 15 }}
              scroll={{ x: true }}
            />
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default ObservacionesList;
