import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Row,
  Col,
  Statistic,
  Typography,
  message,
  Tooltip,
  Form,
  Select,
  DatePicker
} from 'antd';
import {
  ReloadOutlined,
  FieldTimeOutlined,
  CreditCardOutlined,
  UserOutlined,
  SearchOutlined
} from '@ant-design/icons';
import salidaService from '../../services/salidaService';
import AppLayout from '../AppLayout';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const SalidasList = () => {
  const [loading, setLoading] = useState(false);
  const [salidas, setSalidas] = useState([]);
  const [filteredSalidas, setFilteredSalidas] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    placa: '',
    tipo_vehiculo: '',
    tipo_pago: '',
    fecha: null,
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadSalidas();
  }, []);

  useEffect(() => {
    handleSearch(searchText);
  }, [salidas]);

  const loadSalidas = async (page = 1, pageSize = 1000) => {
    setLoading(true);
    try {
      const response = await salidaService.getSalidas(page, pageSize);
      if (response.success) {
        setSalidas(response.data);
        setFilteredSalidas(response.data);
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

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredSalidas(salidas);
    } else {
      const lowerValue = value.toLowerCase();
      const filtered = salidas.filter(salida => {
        const placa = salida.registro?.vehiculo?.placa?.toLowerCase() || '';
        const tipoPago = salida.tipo_pago?.toLowerCase() || '';
        const usuario = salida.user?.name?.toLowerCase() || '';
        return placa.includes(lowerValue) || tipoPago.includes(lowerValue) || usuario.includes(lowerValue);
      });
      setFilteredSalidas(filtered);
    }
  };

  const handleAdvancedSearch = async () => {
    setLoading(true);
    setIsSearching(true);
    try {
      const params = {};
      if (filters.placa) params.placa = filters.placa;
      if (filters.tipo_vehiculo) params.tipo_vehiculo = filters.tipo_vehiculo;
      if (filters.tipo_pago) params.tipo_pago = filters.tipo_pago;
      if (filters.fecha) params.fecha = filters.fecha.format('YYYY-MM-DD');
      const queryString = new URLSearchParams(params).toString();
      const response = await salidaService.searchSalidas(queryString);
      if (response.success) {
        setSalidas(response.data);
        setFilteredSalidas(response.data);
        setPagination({
          current: 1,
          pageSize: pagination.pageSize,
          total: response.data.length,
        });
      } else {
        message.error('Error en la búsqueda');
      }
    } catch (error) {
      message.error(error.message || 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    if (isSearching && searchText) {
      handleSearch(searchText, newPagination.current, newPagination.pageSize);
    } else {
      loadSalidas(newPagination.current, newPagination.pageSize);
    }
  };

  // Estadísticas
  const totalSalidas = filteredSalidas.length;
  const totalEfectivo = filteredSalidas
    .filter(s => s.tipo_pago === 'EFECTIVO')
    .reduce((sum, s) => sum + (s.precio || 0), 0);
  const totalYape = filteredSalidas
    .filter(s => s.tipo_pago === 'YAPE')
    .reduce((sum, s) => sum + (s.precio || 0), 0);
  const totalMonto = filteredSalidas.reduce((sum, s) => sum + (s.precio || 0), 0);
  const cantidadEfectivo = filteredSalidas.filter(s => s.tipo_pago === 'EFECTIVO').length;
  const cantidadYape = filteredSalidas.filter(s => s.tipo_pago === 'YAPE').length;

  // Columnas de la tabla
  const columns = [
    {
      title: 'Vehículo (Placa)',
      dataIndex: ['registro', 'vehiculo', 'placa'],
      key: 'placa',
      render: (_, record) => record.registro?.vehiculo?.placa || '-',
    },
    {
      title: 'Tipo Vehículo',
      dataIndex: ['registro', 'vehiculo', 'tipo_vehiculo', 'nombre'],
      key: 'tipo_vehiculo',
      render: (_, record) => record.registro?.vehiculo?.tipo_vehiculo?.nombre || '-',
    },
    {
      title: 'Fecha Ingreso',
      dataIndex: ['registro', 'fecha_ingreso'],
      key: 'fecha_ingreso',
      render: (_, record) => record.registro?.fecha_ingreso || '-',
    },
    {
      title: 'Hora Ingreso',
      dataIndex: ['registro', 'hora_ingreso'],
      key: 'hora_ingreso',
      render: (_, record) => record.registro?.hora_ingreso || '-',
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
      render: (precio) => `S/ ${precio}`,
    },
    {
      title: 'Tipo Pago',
      dataIndex: 'tipo_pago',
      key: 'tipo_pago',
    },
    {
      title: 'Usuario',
      dataIndex: ['user', 'name'],
      key: 'user',
      render: (_, record) => record.user?.name || '-',
    },
  ];

  return (
    <AppLayout>
      <div>
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
        <Card
          title="Lista de Salidas"
          extra={
            <Input.Search
              placeholder="Buscar por placa..."
              allowClear
              enterButton
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 220 }}
            />
          }
        >
          <Table
            columns={columns}
            dataSource={filteredSalidas}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: filteredSalidas.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} salidas`,
              pageSizeOptions: ['10', '15', '20', '50', '100'],
            }}
            onChange={handleTableChange}
            scroll={{ x: true }}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default SalidasList;
