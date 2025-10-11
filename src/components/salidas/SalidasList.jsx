import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  message,
} from 'antd';
import {
  FieldTimeOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import salidaService from '../../services/salidaService';
import AppLayout from '../AppLayout';
import TableBase from '../common/TableBase';

const SalidasList = () => {
  const [loading, setLoading] = useState(false);
  const [salidas, setSalidas] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });

  useEffect(() => {
    loadSalidas();
  }, []);

  const loadSalidas = async (page = 1, pageSize = 1000) => {
    setLoading(true);
    try {
      const response = await salidaService.getSalidas(page, pageSize);
   
      if (response.success) {
        setSalidas(response.data);
        setPagination({
          ...pagination,
          current: 1,
          pageSize: 15,
          total: response.data.length,
        });
      } else {
        message.error('Error al cargar salidas');
      }
    } catch (error) {
      message.error('Error al cargar salidas');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  // Función de filtrado personalizado para múltiples campos
  const customSearchFilter = (item, searchText) => {
    const searchLower = searchText.toLowerCase();
    
    // Buscar en placa
    const placa = item.registro?.vehiculo?.placa || item.placa || '';
    if (placa.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en tipo de pago
    const tipoPago = item.tipo_pago || '';
    if (tipoPago.toLowerCase().includes(searchLower)) return true;
    
    // Buscar en usuario
    const usuario = item.user?.name || item.user || '';
    if (usuario.toLowerCase().includes(searchLower)) return true;
    
    return false;
  };

  // Estadísticas calculadas
  const totalSalidas = salidas.length;
  
  const totalEfectivo = salidas
    .filter(s => s.tipo_pago === 'EFECTIVO')
    .reduce((sum, s) => sum + (s.precio || 0), 0);
  const totalYape = salidas
    .filter(s => s.tipo_pago === 'YAPE')
    .reduce((sum, s) => sum + (s.precio || 0), 0);
  const totalMonto = salidas.reduce((sum, s) => sum + (s.precio || 0), 0);
  const cantidadEfectivo = salidas.filter(s => s.tipo_pago === 'EFECTIVO').length;
  const cantidadYape = salidas.filter(s => s.tipo_pago === 'YAPE').length;

  // Columnas de la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Placa',
      dataIndex: ['registro', 'vehiculo', 'placa'],
      key: 'placa',
      render: (text, record) => {
        return record.registro?.vehiculo?.placa || record.placa || '-';
      },
    },
    {
      title: 'Fecha Salida',
      dataIndex: 'fecha_salida',
      key: 'fecha_salida',
    },
    {
      title: 'Hora Salida',
      dataIndex: 'hora_salida',
      key: 'hora_salida',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      render: (precio) => `S/ ${precio || 0}.00`,
    },
    {
      title: 'Tipo Pago',
      dataIndex: 'tipo_pago',
      key: 'tipo_pago',
    },
    {
      title: 'Usuario',
      dataIndex: ['user', 'name'],
      key: 'usuario',
      render: (text, record) => record.user?.name || record.user || '-',
    },
  ];

  return (
    <AppLayout>
      <div>
        {/* Estadísticas */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Total Salidas"
                value={totalSalidas}
                prefix={<FieldTimeOutlined />}
                valueStyle={{ color: '#18c52fff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Total Efectivo"
                value={`S/ ${totalEfectivo}`}
                prefix={<CreditCardOutlined />}
                valueStyle={{ color: '#722ed1' }}
                suffix={<span style={{ fontSize: 22, color: '#18c52fff' }}> || ({cantidadEfectivo})</span>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Total Yape"
                value={`S/ ${totalYape}`}
                prefix={<CreditCardOutlined />}
                valueStyle={{ color: '#722ed1' }}
                suffix={<span style={{ fontSize: 22, color: '#18c52fff' }}> || ({cantidadYape})</span>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card>
              <Statistic
                title="Monto Total"
                value={`S/ ${totalMonto}`}
                prefix={<CreditCardOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabla con TableBase */}
        <TableBase
          dataSource={salidas}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '15', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} salidas`,
          }}
          onTableChange={handleTableChange}
          customSearchFilter={customSearchFilter}
          searchPlaceholder="Buscar por placa, tipo de pago o usuario..."
          title="Lista de Salidas"
          onReload={loadSalidas}
        />
      </div>
    </AppLayout>
  );
};

export default SalidasList;
