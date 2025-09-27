import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Button, 
  Space, 
  Typography, 
  message,
  Card,
  Tag,
  Empty,
  Spin,
  Row,
  Col
} from 'antd';
import { 
  CarOutlined, 
  CalendarOutlined,
  TeamOutlined,
  IdcardOutlined,
  BgColorsOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { ownerService } from '../../services/ownerService';

const { Title, Text } = Typography;

const OwnerVehiclesModal = ({ visible, onCancel, ownerId, ownerName }) => {
  const [loading, setLoading] = useState(false);
  const [vehiclesData, setVehiclesData] = useState({ propietario: null, vehiculos: [] });

  useEffect(() => {
    if (visible && ownerId) {
      loadVehicles();
    }
  }, [visible, ownerId]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await ownerService.getOwnerVehicles(ownerId);
      
      if (response.success && response.data) {
        setVehiclesData(response.data);
      } else {
        message.error('Error al cargar vehículos');
        setVehiclesData({ propietario: null, vehiculos: [] });
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      message.error('Error al cargar vehículos');
      setVehiclesData({ propietario: null, vehiculos: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVehiclesData({ propietario: null, vehiculos: [] });
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <CarOutlined style={{ color: '#1890ff' }} />
          <span style={{ color: '#1890ff' }}>Vehículos del Propietario</span>
          {ownerName && <Tag color="blue">{ownerName}</Tag>}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={
        <Button type="primary" onClick={handleCancel} style={{ backgroundColor: '#1890ff' }}>
          Cerrar
        </Button>
      }
      width={1200}
    >
      <Spin spinning={loading}>
        {/* Información del propietario */}
        {vehiclesData.propietario && (
          <Card 
            size="small" 
            style={{ 
              marginBottom: '16px', 
              backgroundColor: 'transparent',
              border: '1px solid #1890ff'
            }}
          >
            <Space wrap size="large">
              <div>
                <Text strong style={{ color: '#1890ff' }}>Propietario:</Text>
                <br />
                <Tag color="blue" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {vehiclesData.propietario.nombre_completo}
                </Tag>
              </div>
              
              <div>
                <Text strong style={{ color: '#1890ff' }}>Documento:</Text>
                <br />
                <Tag color="orange" style={{ fontSize: '14px' }}>
                  {vehiclesData.propietario.documento}
                </Tag>
              </div>
              
              <div>
                <Text strong style={{ color: '#1890ff' }}>Teléfono:</Text>
                <br />
                <Text style={{ fontSize: '14px' }}>{vehiclesData.propietario.telefono}</Text>
              </div>
              
              <div>
                <Text strong style={{ color: '#1890ff' }}>Email:</Text>
                <br />
                <Text style={{ fontSize: '14px', color: '#1890ff' }}>
                  {vehiclesData.propietario.email}
                </Text>
              </div>
            </Space>
          </Card>
        )}

        {/* Lista de vehículos */}
        <Card
          title={
            <Space>
              <CarOutlined style={{ color: '#1890ff' }} />
              <span style={{ color: '#1890ff' }}>
                Vehículos ({vehiclesData.vehiculos?.length || 0})
              </span>
            </Space>
          }
          size="small"
          style={{ backgroundColor: 'transparent' }}
        >
          {vehiclesData.vehiculos && vehiclesData.vehiculos.length > 0 ? (
            <Row gutter={[16, 16]}>
              {vehiclesData.vehiculos.map((vehiculo) => (
                <Col xs={24} sm={12} md={8} lg={6} key={vehiculo.id}>
                  <Card
                    size="small"
                    style={{ 
                      backgroundColor: 'transparent',
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px'
                    }}
                    hoverable
                  >
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <Tag color="blue" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        #{vehiculo.id}
                      </Tag>
                    </div>
                    
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div>
                        <CarOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                        <Text strong style={{ color: '#1890ff' }}>Placa:</Text>
                        <br />
                        <Tag color="blue" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                          {vehiculo.placa}
                        </Tag>
                      </div>
                      
                      <div>
                        <ToolOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        <Text strong style={{ color: '#1890ff' }}>Marca:</Text>
                        <br />
                        <Text style={{ fontSize: '13px' }}>
                          {vehiculo.marca || 'Sin marca'}
                        </Text>
                      </div>
                      
                      <div>
                        <IdcardOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                        <Text strong style={{ color: '#1890ff' }}>Modelo:</Text>
                        <br />
                        <Text style={{ fontSize: '13px' }}>
                          {vehiculo.modelo || 'Sin modelo'}
                        </Text>
                      </div>
                      
                      <div>
                        <BgColorsOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                        <Text strong style={{ color: '#1890ff' }}>Color:</Text>
                        <br />
                        <Tag color="green" style={{ fontSize: '11px' }}>
                          {vehiculo.color || 'Sin color'}
                        </Tag>
                      </div>
                      
                      <div>
                        <CalendarOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
                        <Text strong style={{ color: '#1890ff' }}>Año:</Text>
                        <br />
                        <Tag color="orange" style={{ fontSize: '11px' }}>
                          {vehiculo.anio || 'Sin año'}
                        </Tag>
                      </div>
                      
                      {vehiculo.tipo_vehiculo_nombre && (
                        <div>
                          <Text strong style={{ color: '#1890ff' }}>Tipo:</Text>
                          <br />
                          <Tag color="purple" style={{ fontSize: '11px' }}>
                            {vehiculo.tipo_vehiculo_nombre}
                          </Tag>
                        </div>
                      )}
                      
                      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '8px', marginTop: '8px' }}>
                        <CalendarOutlined style={{ color: '#1890ff', marginRight: '4px' }} />
                        <Text style={{ fontSize: '11px', color: '#999' }}>
                          Registro: {new Date(vehiculo.created_at).toLocaleDateString()}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty 
              description="No hay vehículos registrados para este propietario"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>
      </Spin>
    </Modal>
  );
};

export default OwnerVehiclesModal;
