import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Statistic, Spin, Alert } from 'antd';
import { EyeOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import observacionService from '../../services/observacionService';
import AppLayout from '../AppLayout';
import TableBase from '../common/TableBase';

const { Title } = Typography;

const ObservacionesList = () => {
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadObservaciones();
  }, []);

  const loadObservaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await observacionService.getObservaciones();
      if (response.success) {
        // Asegurar que los datos sean un array
        const data = Array.isArray(response.data) ? response.data : [];
        setObservaciones(data);
      } else {
        setObservaciones([]); // Evitar pasar undefined
        setError('Error al cargar observaciones');
      }
    } catch (err) {
      setError('Error al cargar observaciones');
    } finally {
      setLoading(false);
    }
  };

  // Función de filtrado personalizado para múltiples campos
  const customSearchFilter = (item, searchText) => {
    const searchLower = searchText.toLowerCase();
    
    // Buscar en tipo
    const tipo = item.tipo || '';
    if (tipo.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en descripción
    const descripcion = item.descripcion || '';
    if (descripcion.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en placa del vehículo
    const placa = item.vehiculo?.placa || '';
    if (placa.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en usuario
    const usuario = item.usuario?.name || '';
    if (usuario.toLowerCase().includes(searchLower)) return true;
    
    return false;
  };

  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (tipo) => {
        let obsClass = '';
        switch ((tipo || '').toLowerCase()) {
          case 'leve':
            obsClass = 'obs-opcion-leve'; break;
          case 'grave':
            obsClass = 'obs-opcion-grave'; break;
          case 'advertencia':
            obsClass = 'obs-opcion-advertencia'; break;
          case 'información':
            obsClass = 'obs-opcion-info'; break;
          case 'otro':
            obsClass = 'obs-opcion-otro'; break;
          default:
            obsClass = 'obs-opcion-ninguno'; break;
        }
        return <span className={obsClass} style={{ padding: '2px 10px', borderRadius: 6 }}>{tipo || '-'}</span>;
      }
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
      render: (_, record) => {
        const placa = record.vehiculo?.placa;
        return placa
          ? <span className="placa-celeste" style={{ color: '#505aecff', fontWeight: 600 }}>{placa}</span>
          : '-';
      },
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
                value={observaciones.length}
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

        {error ? (
          <Alert type="error" message={error} />
        ) : (
          <TableBase
            dataSource={observaciones}
            columns={columns}
            loading={loading}
            customSearchFilter={customSearchFilter}
            searchPlaceholder="Buscar por tipo, descripción, placa o usuario..."
            title="Lista de Observaciones"
            onReload={loadObservaciones}
            pagination={{ pageSize: 15 }}
            scroll={{ x: true }}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default ObservacionesList;
