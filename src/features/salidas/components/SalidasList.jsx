import { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col, Statistic, Card, Tag } from 'antd';
import { salidaService } from '../services/salidaService';
import AppLayout from '../../../components/AppLayout';
import TableBase from '../../../components/common/TableBase';
import { useDebounce } from '../../../hooks';

const SalidasList = () => {
  const [loading, setLoading] = useState(false);
  const [salidas, setSalidas] = useState([]);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
  });

  const loadSalidas = useCallback(async (page = 1, pageSize = 1000) => {
    try {
      setLoading(true);
      const response = await salidaService.getSalidas(page, pageSize);
      const data = response.data || [];
      setSalidas(data);
      setPagination(prev => ({
        ...prev,
        total: response.total || data.length,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error('Error al cargar salidas:', error);
      setSalidas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSalidas();
  }, [loadSalidas]);

  const handleTableChange = useCallback((newPagination) => {
    setPagination(newPagination);
  }, []);

  const customSearchFilter = useCallback((item) => {
    if (!debouncedSearchText) return true;
    const searchLower = debouncedSearchText.toLowerCase();
    const placa = item.placa?.toLowerCase() || '';
    const tipoPago = item.tipo_pago?.toLowerCase() || '';
    const usuario = item.usuario?.toLowerCase() || '';
    return placa.includes(searchLower) || tipoPago.includes(searchLower) || usuario.includes(searchLower);
  }, [debouncedSearchText]);

  const estadisticas = useMemo(() => {
    const totalSalidas = salidas.length;
    const totalEfectivo = salidas
      .filter(s => s.tipo_pago === 'EFECTIVO')
      .reduce((sum, s) => sum + parseFloat(s.precio || 0), 0);
    const totalYape = salidas
      .filter(s => s.tipo_pago === 'YAPE')
      .reduce((sum, s) => sum + parseFloat(s.precio || 0), 0);
    const totalMonto = totalEfectivo + totalYape;
    const cantidadEfectivo = salidas.filter(s => s.tipo_pago === 'EFECTIVO').length;
    const cantidadYape = salidas.filter(s => s.tipo_pago === 'YAPE').length;

    return {
      totalSalidas,
      totalEfectivo,
      totalYape,
      totalMonto,
      cantidadEfectivo,
      cantidadYape,
    };
  }, [salidas]);

  const columns = useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <input
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      onFilter: (value, record) => record.id.toString().includes(value),
    },
    {
      title: 'Placa',
      dataIndex: 'placa',
      key: 'placa',
      sorter: (a, b) => (a.placa || '').localeCompare(b.placa || ''),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <input
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      onFilter: (value, record) => (record.placa || '').toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Fecha Salida',
      dataIndex: 'fecha_salida',
      key: 'fecha_salida',
      sorter: (a, b) => new Date(a.fecha_salida) - new Date(b.fecha_salida),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <input
            type="date"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      onFilter: (value, record) => record.fecha_salida.includes(value),
    },
    {
      title: 'Hora Salida',
      dataIndex: 'hora_salida',
      key: 'hora_salida',
      sorter: (a, b) => (a.hora_salida || '').localeCompare(b.hora_salida || ''),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <input
            type="time"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      onFilter: (value, record) => (record.hora_salida || '').includes(value),
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      sorter: (a, b) => parseFloat(a.precio || 0) - parseFloat(b.precio || 0),
      render: (precio) => `S/ ${parseFloat(precio || 0).toFixed(2)}`,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <input
            type="number"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      onFilter: (value, record) => parseFloat(record.precio || 0) === parseFloat(value),
    },
    {
      title: 'Tipo Pago',
      dataIndex: 'tipo_pago',
      key: 'tipo_pago',
      sorter: (a, b) => (a.tipo_pago || '').localeCompare(b.tipo_pago || ''),
      render: (tipo_pago) => (
        <Tag color={tipo_pago === 'YAPE' ? 'purple' : 'green'}>
          {tipo_pago}
        </Tag>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <select
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          >
            <option value="">Todos</option>
            <option value="EFECTIVO">EFECTIVO</option>
            <option value="YAPE">YAPE</option>
          </select>
        </div>
      ),
      onFilter: (value, record) => record.tipo_pago === value,
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario',
      key: 'usuario',
      sorter: (a, b) => (a.usuario || '').localeCompare(b.usuario || ''),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <input
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      onFilter: (value, record) => (record.usuario || '').toLowerCase().includes(value.toLowerCase()),
    },
  ], []);

  return (
    <AppLayout>
      <div style={{ padding: '24px' }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Salidas"
                value={estadisticas.totalSalidas}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Efectivo"
                value={estadisticas.totalEfectivo}
                precision={2}
                prefix="S/"
                valueStyle={{ color: '#52c41a' }}
                suffix={`(${estadisticas.cantidadEfectivo})`}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Yape"
                value={estadisticas.totalYape}
                precision={2}
                prefix="S/"
                valueStyle={{ color: '#722ed1' }}
                suffix={`(${estadisticas.cantidadYape})`}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Monto Total"
                value={estadisticas.totalMonto}
                precision={2}
                prefix="S/"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
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
