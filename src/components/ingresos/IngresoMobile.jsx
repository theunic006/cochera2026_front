import React, { useEffect, useState, useCallback } from 'react';
import { calcularTiempoEstadiaConTolerancia, getTiempoEstadia } from '../../utils/CalValores';
import { Button, Space, message, Tag, Input, Drawer, Form, Select, Row, Col, Modal, Divider } from 'antd';
import { CarOutlined, ClockCircleOutlined, DollarOutlined, SearchOutlined, PlusOutlined, ArrowLeftOutlined, CreditCardOutlined } from '@ant-design/icons';
import { ingresoService } from '../../services/ingresoService';
import { vehiculoService } from '../../services/vehiculoService';
import { vehicleTypeService } from '../../services/vehicleTypeService';
import { toleranceService } from '../../services/toleranceService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './IngresoMobile.css';

const { Search } = Input;
const { Option } = Select;

const IngresoMobile = () => {
  const [searchText, setSearchText] = useState("");
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [toleranciaMinutos, setToleranciaMinutos] = useState(null);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [nuevaPlaca, setNuevaPlaca] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  
  // Estados para modales y drawers
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [terminarModalVisible, setTerminarModalVisible] = useState(false);
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);
  const [form] = Form.useForm();

  // Función para cargar ingresos
  const cargarIngresos = useCallback(async (search = "") => {
    setLoading(true);
    try {
      let response;
      if (search.trim()) {
        response = await ingresoService.getIngresos(1, 1000, { search: search.trim() });
      } else {
        response = await ingresoService.getIngresos(1, 100);
      }
      if (response.success) {
        setIngresos(response.data);
      } else {
        message.error('Error al cargar ingresos');
      }
    } catch (error) {
      message.error(error.message || 'Error al cargar ingresos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar tipos de vehículo y tolerancia al montar
  useEffect(() => {
    const fetchTiposVehiculo = async () => {
      const response = await vehicleTypeService.getAllVehicleTypes();
      if (response.success && Array.isArray(response.data)) {
        setTiposVehiculo(response.data);
      } else {
        setTiposVehiculo([]);
      }
    };
    fetchTiposVehiculo();

    const fetchTolerancia = async () => {
      if (user && user.id_company) {
        try {
          const tolerancia = await toleranceService.getToleranceByEmpresa(user.id_company);
          let minutosTolerancia = null;
          if (
            tolerancia &&
            tolerancia.data &&
            Array.isArray(tolerancia.data.data) &&
            tolerancia.data.data[0]
          ) {
            minutosTolerancia = tolerancia.data.data[0].minutos;
          }
          setToleranciaMinutos(minutosTolerancia);
        } catch (err) {
          setToleranciaMinutos(null);
        }
      }
    };
    fetchTolerancia();
  }, [user]);

  useEffect(() => {
    cargarIngresos(searchText);
  }, [cargarIngresos, searchText]);

  // Función para registrar nuevo ingreso
  const handleRegistrarIngreso = useCallback(async () => {
    setRegistrando(true);
    try {
      const placaLimpia = nuevaPlaca.replace(/[^A-Z0-9-]/g, '').trim();
      
      if (!placaLimpia) {
        message.warning('Ingrese una placa válida');
        setRegistrando(false);
        return;
      }

      const response = await vehiculoService.createVehiculo({ placa: placaLimpia });

      if (response.success) {
        const comentario = response.comentario || '';
        const mensaje = response.message || 'Ingreso procesado correctamente';
        
        if (comentario) {
          if (comentario.includes('Ya existe ingreso')) {
            message.warning(`${mensaje}. ${comentario}`, 4);
          } else if (comentario.includes('No existe placa')) {
            message.success(`${mensaje}. ${comentario}`, 4);
          } else if (comentario.includes('Existe placa')) {
            message.info(`${mensaje}. ${comentario}`, 4);
          } else {
            message.success(`${mensaje}. ${comentario}`, 4);
          }
        } else {
          message.success(mensaje);
        }
        
        setNuevaPlaca("");
        cargarIngresos(searchText);
      } else {
        const errorMsg = response.message || 'Error al registrar ingreso';
        const comentario = response.comentario || '';
        const mensajeCompleto = comentario ? `${errorMsg}. ${comentario}` : errorMsg;
        message.error(mensajeCompleto);
      }
    } catch (error) {
      message.error(error.message || 'Error al registrar ingreso');
    } finally {
      setRegistrando(false);
    }
  }, [nuevaPlaca, cargarIngresos, searchText]);

  // Función para editar ingreso
  const handleEditIngreso = useCallback(async (ingreso) => {
    try {
      const res = await ingresoService.getIngresoById(ingreso.id);
      if (res.success && res.data && res.data.data) {
        setIngresoSeleccionado(res.data.data);
        form.setFieldsValue({
          placa: res.data.data.vehiculo?.placa,
          fecha_ingreso: res.data.data.fecha_ingreso,
          hora_ingreso: res.data.data.hora_ingreso,
          tipo_vehiculo: res.data.data.vehiculo?.tipo_vehiculo?.id || '',
          tipo_observacion: 'Ninguno',
          observaciones: '',
          frecuencia: res.data.data.vehiculo?.frecuencia || '',
        });
        setEditDrawerVisible(true);
      } else {
        message.error('No se pudo obtener la información del ingreso');
      }
    } catch (err) {
      message.error('Error al obtener información');
    }
  }, [form]);

  // Función para terminar ingreso
  const handleTerminar = useCallback(async (ingreso) => {
    try {
      const res = await ingresoService.getIngresoById(ingreso.id);
      if (res.success && res.data && res.data.data) {
        setIngresoSeleccionado(res.data.data);
        setTerminarModalVisible(true);
      } else {
        message.error('No se pudo obtener la información del ingreso');
      }
    } catch (err) {
      message.error('Error al obtener información');
    }
  }, []);

  // Función para actualizar ingreso
  const handleUpdateIngreso = async (values) => {
    if (!ingresoSeleccionado?.id) {
      message.error("No se encontró el ingreso a editar");
      return;
    }
    
    try {
      const payload = {
        fecha_ingreso: values.fecha_ingreso,
        hora_ingreso: values.hora_ingreso,
        vehiculo: {
          placa: (values.placa || '').toUpperCase(),
          tipo_vehiculo_id: values.tipo_vehiculo,
        },
        observacion: {
          id_vehiculo: ingresoSeleccionado.vehiculo?.id,
          tipo: values.tipo_observacion || 'Ninguno',
          descripcion: values.observaciones || '',
        },
      };
      
      const response = await ingresoService.updateIngreso(ingresoSeleccionado.id, payload);
      if (response.success) {
        message.success('Ingreso actualizado correctamente');
        setEditDrawerVisible(false);
        setIngresoSeleccionado(null);
        form.resetFields();
        cargarIngresos(searchText);
      } else {
        message.error(response.message || 'Error al actualizar ingreso');
      }
    } catch (error) {
      message.error(error.message || 'Error al actualizar ingreso');
    }
  };

  // Función para terminar ingreso con pago
  const handleTerminarIngreso = async (tipoPago) => {
    try {
      setLoading(true);

      // Obtener tolerancia de la empresa
      let toleranciaMinutos = null;
      if (user && user.id_company) {
        try {
          const tolerancia = await toleranceService.getToleranceByEmpresa(user.id_company);
          if (tolerancia?.data && Array.isArray(tolerancia.data) && tolerancia.data[0]) {
            toleranciaMinutos = tolerancia.data[0].minutos;
          }
        } catch (err) {
          console.error('Error obteniendo tolerancia:', err);
        }
      }

      // Calcular tiempo y precio
      const tiempoObj = calcularTiempoEstadiaConTolerancia(
        ingresoSeleccionado.fecha_ingreso, 
        ingresoSeleccionado.hora_ingreso, 
        toleranciaMinutos
      );
      
      const vehiculo = ingresoSeleccionado.vehiculo || {};
      const tipoVehiculo = vehiculo.tipo_vehiculo || {};
      const precioHora = tipoVehiculo.valor || 0;
      const fracciones = tiempoObj.fracciones;
      const total = precioHora * (fracciones > 0 ? fracciones : 1);
      const tiempoEstadia = getTiempoEstadia(ingresoSeleccionado);

      // Registrar pago y terminar ingreso
      const response = await ingresoService.deleteIngreso(ingresoSeleccionado.id, {
        tiempo: tiempoEstadia,
        precio: total,
        tipo_pago: tipoPago.toUpperCase()
      });

      if (response.success) {
        message.success(`Pago por ${tipoPago} registrado exitosamente`);
        setTerminarModalVisible(false);
        cargarIngresos(searchText); // Recargar la lista
      } else {
        message.error(response.message || 'Error al registrar pago');
      }
    } catch (error) {
      console.error('Error al terminar ingreso:', error);
      message.error('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener clases CSS basadas en el tema
  const getThemeClass = (baseClass) => {
    return `${baseClass} ${isDarkMode ? 'dark' : 'light'}`;
  };

  // Renderizar item de la lista
  const renderIngresoItem = (ingreso, index) => {
    if (!ingreso || !ingreso.id) {
      return null; // Evitar renderizar items inválidos
    }

    const tiempo = calcularTiempoEstadiaConTolerancia(ingreso.fecha_ingreso, ingreso.hora_ingreso, toleranciaMinutos);
    const valor = ingreso.vehiculo?.tipo_vehiculo?.valor || 0;
    const total = valor * (tiempo.fracciones > 0 ? tiempo.fracciones : 1);
    
    // Determinar color de observación
    const obs = Array.isArray(ingreso.vehiculo?.observaciones) && ingreso.vehiculo.observaciones.length > 0
      ? ingreso.vehiculo.observaciones[ingreso.vehiculo.observaciones.length - 1]
      : null;
    
    let obsColor = '#1890ff';
    if (obs) {
      switch ((obs.tipo || '').toLowerCase()) {
        case 'leve': obsColor = '#52c41a'; break;
        case 'grave': obsColor = '#ff4d4f'; break;
        case 'advertencia': obsColor = '#faad14'; break;
        case 'información': obsColor = '#1890ff'; break;
        case 'otro': obsColor = '#722ed1'; break;
        default: obsColor = isDarkMode ? '#d9d9d9' : '#595959'; break;
      }
    }

    return (
      <div key={`ingreso-${ingreso.id}`} className={getThemeClass('ingreso-mobile-list-item')}>
        <Row justify="space-between" align="top">
          <Col span={18}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              {/* Placa */}
              <div>
                <span 
                  className="vehicle-plate"
                  style={{ color: obsColor }}
                  onClick={() => handleEditIngreso(ingreso)}
                >
                  {ingreso.vehiculo?.placa || 'Sin placa'}
                </span>
                {ingreso.vehiculo?.tipo_vehiculo && (
                  <Tag 
                    className="vehicle-type-tag"
                    color="purple"
                  >
                    {ingreso.vehiculo.tipo_vehiculo.nombre}
                  </Tag>
                )}
              </div>
              
              {/* Tiempo y precio */}
              <Row gutter={16}>
                <Col span={12}>
                  <Space size={4}>
                    <ClockCircleOutlined className={getThemeClass('time-info')} />
                    <span className="time-info">
                      {ingreso.hora_ingreso}
                    </span>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space size={4}>
                    <span className="price-text">
                      S/ {total}.00
                    </span>
                  </Space>
                </Col>
              </Row>
              
              {/* Tiempo de estadía */}
              <span className="time-info">
                Estadía: {tiempo.texto}
              </span>
            </Space>
          </Col>
          
          <Col span={6}>
            <div className="fin-button-container">
              <Button
                type="primary"
                danger
                size="large"
                onClick={() => handleTerminar(ingreso)}
                className="fin-button"
              >
                FIN
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className={getThemeClass('ingreso-mobile-container')}>
      {/* Header */}
      <div className={getThemeClass('ingreso-mobile-header')}>
        <Row justify="space-between" align="middle">
          <Col>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/ingresos')}
              className={getThemeClass('header-back-button')}
            >
              Volver
            </Button>
          </Col>
          <Col>
            <h4 className={getThemeClass('header-title')}>
             Bienvenido  {user?.name || user?.nombre || 'Usuario'}
            </h4>
          </Col>

        </Row>
      </div>

      {/* Sección de nuevo ingreso */}
      <div className={getThemeClass('ingreso-mobile-add-section')}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Nueva placa"
            value={nuevaPlaca}
            onChange={(e) => setNuevaPlaca(e.target.value.toUpperCase())}
            size="large"
            maxLength={15}
            className="add-input"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            loading={registrando}
            disabled={!nuevaPlaca.trim()}
            onClick={handleRegistrarIngreso}
            size="large"
            className="add-button"
          >
            Registrar
          </Button>
        </Space.Compact>
      </div>

      {/* Sección de búsqueda */}
      <div className={getThemeClass('ingreso-mobile-search-section')}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Search
            placeholder="Buscar por placa..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
            className="search-input"
          />
          <div className={getThemeClass('vehicle-counter')}>
            <span className={getThemeClass('counter-label')}>
              Total de Vehículos:
            </span>
            <span className={getThemeClass('counter-value')}>
              {ingresos.length}
            </span>
          </div>
        </Space>
      </div>

      {/* Lista de ingresos */}
      <div className="ingreso-mobile-content">
        {loading ? (
          <div className="ingreso-mobile-loading">
            <span>Cargando...</span>
          </div>
        ) : ingresos.length === 0 ? (
          <div className="ingreso-mobile-empty">
            <CarOutlined className={getThemeClass('empty-icon')} />
            <span>No hay ingresos</span>
          </div>
        ) : (
          ingresos.map((ingreso, index) => renderIngresoItem(ingreso, index))
        )}
      </div>

      {/* Drawer de edición */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Editar Ingreso</span>
            <Button
              type="primary"
              icon={<CarOutlined />}
              onClick={async () => {
                if (!ingresoSeleccionado?.id) {
                  message.error("No se encontró el ingreso para imprimir");
                  return;
                }
                try {
                  message.loading("Enviando a la impresora...", 0);
                  const { default: apiClient } = await import('../../utils/apiClient');
                  const response = await apiClient.get(`/ingresos/${ingresoSeleccionado.id}/print`);
                  message.destroy();
                  if (response.status === 200) {
                    message.success("Ticket enviado a la impresora correctamente");
                  } else {
                    message.error("Error al imprimir el ticket");
                  }
                } catch (error) {
                  message.destroy();
                  message.error(`Error al imprimir: ${error.message}`);
                }
              }}
            >
              Imprimir Ticket
            </Button>
          </div>
        }
        placement="bottom"
        height="90%"
        onClose={() => setEditDrawerVisible(false)}
        open={editDrawerVisible}
        className="ingreso-mobile-drawer"
        styles={{
          body: { padding: '16px' }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateIngreso}
        >
          <Form.Item
            label="Placa"
            name="placa"
            rules={[{ required: true, message: 'Ingrese la placa' }]}
          >
            <Input 
              size="large" 
              maxLength={15} 
              className="form-input large"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Fecha"
                name="fecha_ingreso"
                rules={[{ required: true, message: 'Ingrese la fecha' }]}
              >
                <Input type="date" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hora Ingreso"
                name="hora_ingreso"
                rules={[{ required: true, message: 'Ingrese la hora' }]}
              >
                <Input type="time" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Tipo de Vehículo"
            name="tipo_vehiculo"
            rules={[{ required: true, message: 'Seleccione tipo de vehículo' }]}
          >
            <Select 
              size="large" 
              placeholder="Seleccione tipo de vehículo"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {tiposVehiculo.map(tipo => (
                <Option key={tipo.id} value={tipo.id}>
                  {tipo.nombre} - S/ {tipo.valor}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Frecuencia"
            name="frecuencia"
          >
            <Input 
              size="large" 
              maxLength={15} 
              className="form-input large"
              disabled 
            />
          </Form.Item>

          <Form.Item
            label="Tipo Observación"
            name="tipo_observacion"
            initialValue="Ninguno"
          >
            <Select size="large">
              <Option value="Ninguno">
                <span style={{ color: 'inherit' }}>Ninguno</span>
              </Option>
              <Option value="Leve">
                <span style={{ color: '#52c41a' }}>Leve</span>
              </Option>
              <Option value="Grave">
                <span style={{ color: '#ff4d4f' }}>Grave</span>
              </Option>
              <Option value="Advertencia">
                <span style={{ color: '#faad14' }}>Advertencia</span>
              </Option>
              <Option value="Información">
                <span style={{ color: '#1890ff' }}>Información</span>
              </Option>
              <Option value="Otro">
                <span style={{ color: '#722ed1' }}>Otro</span>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Observaciones"
            name="observaciones"
          >
            <Input.TextArea 
              rows={3} 
              maxLength={255}
              placeholder="Ingrese observaciones (opcional)"
            />
          </Form.Item>

          {/* Mostrar las dos últimas observaciones del vehículo si existen */}
          {Array.isArray(ingresoSeleccionado?.vehiculo?.observaciones) && 
           ingresoSeleccionado.vehiculo.observaciones.length > 0 && (
            <div className={getThemeClass('vehicle-observations')}>
              <strong className="observations-title">
                Últimas observaciones del vehículo:
              </strong>
              {ingresoSeleccionado.vehiculo.observaciones.slice(-2).map((obs, idx) => (
                <div
                  key={obs.id || idx}
                  className={getThemeClass('observation-item')}
                  onClick={() => form.setFieldsValue({ observaciones: obs.descripcion })}
                >
                  <div className="observation-header">
                    <strong className="observation-type">{obs.tipo}:</strong>
                    <span className="observation-description">{obs.descripcion}</span>
                  </div>
                  <small className="observation-meta">
                    {obs.created_at ? new Date(obs.created_at).toLocaleString('es-PE') : 'Sin fecha'}
                    {obs.usuario?.name ? ` | Por: ${obs.usuario.name}` : ''}
                  </small>
                </div>
              ))}
            </div>
          )}

          <Form.Item>
            <Space className="form-buttons">
              <Button size="large" onClick={() => setEditDrawerVisible(false)}>
                Atrás
              </Button>
              <Button type="primary" size="large" htmlType="submit">
                Actualizar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Modal de terminar */}
      <Modal
        title="Terminar Ingreso"
        open={terminarModalVisible}
        onCancel={() => setTerminarModalVisible(false)}
        footer={null}
        centered
        className="ingreso-mobile-modal"
      >
        {ingresoSeleccionado && (
          <div>
            <div className="modal-title">
              <h3 className="title">
                {ingresoSeleccionado.vehiculo?.placa}
              </h3>
              <span className="modal-subtitle">
                Ingreso: {ingresoSeleccionado.hora_ingreso}
              </span>
            </div>

            <Divider />

            <div className="payment-summary">
              {(() => {
                const tiempo = calcularTiempoEstadiaConTolerancia(
                  ingresoSeleccionado.fecha_ingreso,
                  ingresoSeleccionado.hora_ingreso,
                  toleranciaMinutos
                );
                const valor = ingresoSeleccionado.vehiculo?.tipo_vehiculo?.valor || 0;
                const total = valor * (tiempo.fracciones > 0 ? tiempo.fracciones : 1);

                return (
                  <Space direction="vertical" size={8} className="payment-summary">
                    <Row className="summary-row">
                      <span>Tiempo:</span>
                      <strong>{tiempo.texto}</strong>
                    </Row>
                    <Row className="summary-row">
                      <span>Precio por hora:</span>
                      <span>S/ {valor}.00</span>
                    </Row>
                    <Row className="summary-row">
                      <strong>Total a pagar:</strong>
                      <strong className="summary-total">
                        S/ {total}.00
                      </strong>
                    </Row>
                  </Space>
                );
              })()}
            </div>

            <Space direction="vertical" size={12} className="payment-buttons">
              <Button
                type="primary"
                size="large"
                block
                icon={<CreditCardOutlined />}
                onClick={() => handleTerminarIngreso('Efectivo')}
                className="payment-button efectivo"
                loading={loading}
              >
                Pago en Efectivo
              </Button>
              <Button
                type="primary"
                size="large"
                block
                icon={<CreditCardOutlined />}
                onClick={() => handleTerminarIngreso('Yape')}
                className="payment-button yape"
                loading={loading}
              >
                Pago con Yape
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IngresoMobile;