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
  UserOutlined, 
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { vehicleService } from '../../services/vehicleService';

const { Title, Text } = Typography;

const VehicleOwnersModal = ({ visible, onCancel, vehicleId, vehiclePlaca }) => {
  const [loading, setLoading] = useState(false);
  const [ownersData, setOwnersData] = useState({ vehiculo: null, propietarios: [] });

  useEffect(() => {
    if (visible && vehicleId) {
      loadOwners();
    }
  }, [visible, vehicleId]);

  const loadOwners = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.getVehicleOwners(vehicleId);
      
      if (response.success && response.data) {
        setOwnersData(response.data);
      } else {
        message.error('Error al cargar propietarios');
        setOwnersData({ vehiculo: null, propietarios: [] });
      }
    } catch (error) {
      console.error('Error loading owners:', error);
      message.error('Error al cargar propietarios');
      setOwnersData({ vehiculo: null, propietarios: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOwnersData({ vehiculo: null, propietarios: [] });
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <TeamOutlined style={{ color: '#722ed1' }} />
          <span style={{ color: '#722ed1' }}>Propietarios del Vehículo</span>
          {vehiclePlaca && <Tag color="blue">{vehiclePlaca}</Tag>}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={
        <Button type="primary" onClick={handleCancel} style={{ backgroundColor: '#722ed1' }}>
          Cerrar
        </Button>
      }
      width={1000}
    >
      <Spin spinning={loading}>
        {/* Información del vehículo */}
        {ownersData.vehiculo && (
          <Card 
            size="small" 
            style={{ 
              marginBottom: '16px', 
              backgroundColor: 'transparent',
              border: '1px solid #722ed1'
            }}
          >
            <Space wrap size="large">
              <div>
                <Text strong style={{ color: '#722ed1' }}>Placa:</Text>
                <br />
                <Tag color="blue" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {ownersData.vehiculo.placa}
                </Tag>
              </div>
              
              <div>
                <Text strong style={{ color: '#722ed1' }}>Marca:</Text>
                <br />
                <Text style={{ fontSize: '14px' }}>{ownersData.vehiculo.marca}</Text>
              </div>
              
              <div>
                <Text strong style={{ color: '#722ed1' }}>Modelo:</Text>
                <br />
                <Text style={{ fontSize: '14px' }}>{ownersData.vehiculo.modelo}</Text>
              </div>
              
              <div>
                <Text strong style={{ color: '#722ed1' }}>Color:</Text>
                <br />
                <Tag color="green" style={{ fontSize: '14px' }}>
                  {ownersData.vehiculo.color}
                </Tag>
              </div>
              
              <div>
                <Text strong style={{ color: '#722ed1' }}>Año:</Text>
                <br />
                <Text style={{ fontSize: '14px' }}>{ownersData.vehiculo.anio}</Text>
              </div>
            </Space>
          </Card>
        )}

        {/* Lista de propietarios */}
        <Card
          title={
            <Space>
              <TeamOutlined style={{ color: '#722ed1' }} />
              <span style={{ color: '#722ed1' }}>
                Propietarios ({ownersData.propietarios?.length || 0})
              </span>
            </Space>
          }
          size="small"
          style={{ backgroundColor: 'transparent' }}
        >
          {ownersData.propietarios && ownersData.propietarios.length > 0 ? (
            <Row gutter={[16, 16]}>
              {ownersData.propietarios.map((propietario) => (
                <Col xs={24} sm={12} md={8} lg={6} key={propietario.id}>
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
                        #{propietario.id}
                      </Tag>
                    </div>
                    
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div>
                        <UserOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                        <Text strong style={{ color: '#722ed1' }}>Nombre:</Text>
                        <br />
                        <Text style={{ fontSize: '13px' }}>
                          {propietario.nombre_completo || `${propietario.nombres || ''} ${propietario.apellidos || ''}`.trim() || 'Sin nombre'}
                        </Text>
                      </div>
                      
                      <div>
                        <PhoneOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        <Text strong style={{ color: '#722ed1' }}>Teléfono:</Text>
                        <br />
                        <Text style={{ fontSize: '13px' }}>
                          {propietario.telefono || 'Sin teléfono'}
                        </Text>
                      </div>
                      
                      <div>
                        <IdcardOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                        <Text strong style={{ color: '#722ed1' }}>Documento:</Text>
                        <br />
                        <Tag color="orange" style={{ fontSize: '11px' }}>
                          {propietario.documento || 'Sin documento'}
                        </Tag>
                      </div>
                      
                      {propietario.email && (
                        <div>
                          <Text strong style={{ color: '#722ed1' }}>Email:</Text>
                          <br />
                          <Text style={{ fontSize: '12px', color: '#1890ff' }}>
                            {propietario.email}
                          </Text>
                        </div>
                      )}
                      
                      {propietario.direccion && (
                        <div>
                          <Text strong style={{ color: '#722ed1' }}>Dirección:</Text>
                          <br />
                          <Text style={{ fontSize: '12px' }}>
                            {propietario.direccion}
                          </Text>
                        </div>
                      )}
                      
                      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '8px', marginTop: '8px' }}>
                        <CalendarOutlined style={{ color: '#722ed1', marginRight: '4px' }} />
                        <Text style={{ fontSize: '11px', color: '#999' }}>
                          Registro: {new Date(propietario.created_at).toLocaleDateString()}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty 
              description="No hay propietarios registrados para este vehículo"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>
      </Spin>
    </Modal>
  );
};

export default VehicleOwnersModal;