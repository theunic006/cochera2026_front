import { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Typography, Space } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, DownloadOutlined } from '@ant-design/icons';
import AppLayout from './AppLayout';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Reportes = () => {
  const [reportType, setReportType] = useState('ingresos');
  const [dateRange, setDateRange] = useState(null);

  const chartPlaceholderStyle = {
    height: '300px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  return (
    <AppLayout>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            📊 Reportes y Análisis
          </Title>
          <Text type="secondary">
            Visualiza estadísticas y genera reportes del sistema
          </Text>
        </div>

        {/* Controles de filtros */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Tipo de Reporte:</Text>
                <Select
                  value={reportType}
                  onChange={setReportType}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'ingresos', label: 'Ingresos' },
                    { value: 'ocupacion', label: 'Ocupación' },
                    { value: 'usuarios', label: 'Usuarios' },
                    { value: 'vehiculos', label: 'Vehículos' },
                  ]}
                />
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Rango de Fechas:</Text>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  style={{ width: '100%' }}
                />
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Acciones:</Text>
                <Button type="primary" icon={<DownloadOutlined />} block>
                  Exportar Reporte
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Gráficos */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <BarChartOutlined />
                  Ingresos Mensuales
                </Space>
              }
            >
              <div style={chartPlaceholderStyle}>
                📊 Gráfico de Barras
                <br />
                (Aquí iría Chart.js o similar)
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <LineChartOutlined />
                  Ocupación por Horas
                </Space>
              }
            >
              <div style={chartPlaceholderStyle}>
                📈 Gráfico de Líneas
                <br />
                (Aquí iría Chart.js o similar)
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <PieChartOutlined />
                  Distribución de Vehículos
                </Space>
              }
            >
              <div style={chartPlaceholderStyle}>
                🥧 Gráfico Circular
                <br />
                (Aquí iría Chart.js o similar)
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <BarChartOutlined />
                  Resumen Semanal
                </Space>
              }
            >
              <div style={chartPlaceholderStyle}>
                📊 Resumen de Datos
                <br />
                (Aquí iría Chart.js o similar)
              </div>
            </Card>
          </Col>
        </Row>

        {/* Tabla resumen */}
        <Card
          title="🔍 Datos Resumidos"
          style={{ marginTop: '24px' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Title level={3} style={{ color: '#1890ff', margin: 0 }}>$45,800</Title>
                <Text type="secondary">Ingresos Este Mes</Text>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Title level={3} style={{ color: '#52c41a', margin: 0 }}>89%</Title>
                <Text type="secondary">Ocupación Promedio</Text>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Title level={3} style={{ color: '#fa8c16', margin: 0 }}>156</Title>
                <Text type="secondary">Total Espacios</Text>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Title level={3} style={{ color: '#722ed1', margin: 0 }}>3.2h</Title>
                <Text type="secondary">Tiempo Promedio</Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reportes;