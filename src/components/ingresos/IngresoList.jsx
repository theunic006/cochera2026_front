import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Space, Tooltip, Statistic, Row, Col, message, Popconfirm, Tag, Input, Modal, Form, Select, Checkbox } from 'antd';
import { CarOutlined, ClockCircleOutlined, DollarOutlined, TagOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { ingresoService } from '../../services/ingresoService';
import { vehiculoService } from '../../services/vehiculoService';
import AppLayout from '../AppLayout';
import EditarForm from './EditarForm';
import TerminarModal from './TerminarModal';
import { vehicleTypeService } from '../../services/vehicleTypeService';

const { Search } = Input;
const calcularTiempoEstadia = (fecha, hora) => {
  if (!fecha || !hora) return { horas: 0, minutos: 0, texto: '-' };
  const ingreso = new Date(`${fecha}T${hora}`);
  const ahora = new Date();
  const diffMs = ahora - ingreso;
  if (isNaN(diffMs)) return { horas: 0, minutos: 0, texto: '-' };
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs / (1000 * 60)) % 60);
  const fracciones = Math.ceil(diffMs / (1000 * 60 * 60)); // Para el cobro por fracción
  return { horas, minutos, fracciones, texto: `${horas}h ${minutos}m` };
};

const IngresoList = () => {
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  // Cargar tipos de vehículo al montar
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
  }, []);
  const [searchText, setSearchText] = useState("");
  const [nuevaPlaca, setNuevaPlaca] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
  });
  // Estado para modal de edición de placa
  const [modalVisible, setModalVisible] = useState(false);
  const [placaEdit, setPlacaEdit] = useState("");
  const [ingresoEdit, setIngresoEdit] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  // Estado para modal de terminar
  const [terminarModalVisible, setTerminarModalVisible] = useState(false);
  const [ingresoTerminar, setIngresoTerminar] = useState(null);

  useEffect(() => {
    cargarIngresos();
  }, []);

  const cargarIngresos = async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const response = await ingresoService.getIngresos(page, pageSize);
      if (response.success) {
        setIngresos(response.data);
        setPagination({
          current: response.pagination?.current_page || page,
          pageSize: response.pagination?.per_page || pageSize,
          total: response.pagination?.total || response.data.length,
        });
      } else {
        message.error('Error al cargar ingresos');
      }
    } catch (error) {
      message.error(error.message || 'Error al cargar ingresos');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    cargarIngresos(newPagination.current, newPagination.pageSize);
  };

  const handleTerminar = async (ingreso) => {
    // Refrescar datos del ingreso desde el backend antes de mostrar el modal
    try {
      const res = await ingresoService.getIngresoById(ingreso.id);
      if (res.success && res.data && res.data.data) {
        setIngresoTerminar(res.data.data);
        setTerminarModalVisible(true);
      } else {
        message.error('No se pudo obtener la información actualizada del ingreso');
      }
    } catch (err) {
      message.error('Error al obtener información actualizada');
    }
  };

  const columns = [
    {
      title: 'Placa',
      dataIndex: ['vehiculo', 'placa'],
      key: 'placa',
      render: (_, record) =>
        record.vehiculo?.placa ? (
          <Button
            className="placa-btn-responsive"
            color='primary'
            variant='outlined'
            type="link"
            onClick={() => {
              setIngresoEdit(record);
              setPlacaEdit(record.vehiculo.placa);
              setModalVisible(true);
            }}
          >
            {record.vehiculo.placa}
          </Button>
        ) : (
          <span style={{ color: '#aaa' }}>Sin placa</span>
        ),
    },
    {
      title: 'Hora de Ingreso',
      dataIndex: 'hora_ingreso',
      key: 'hora_ingreso',
      render: (hora, record) => <span><ClockCircleOutlined /> {record.hora_ingreso}</span>,
    },
    {
      title: 'Tiempo de Estadia',
      key: 'tiempo_estadia',
      render: (_, record) => {
        const tiempo = calcularTiempoEstadia(record.fecha_ingreso, record.hora_ingreso);
        return <span><ClockCircleOutlined /> {tiempo.texto}</span>;
      },
    },
    {
      title: 'Precio',
      key: 'precio',
      render: (_, record) => {
        const valor = record.vehiculo?.tipo_vehiculo?.valor;
        return valor ? <span>S/ {valor}</span> : <span style={{color: '#aaa'}}>Sin valor</span>;
      },
    },
    {
      title: 'Total a Pagar',
      key: 'total_pagar',
      render: (_, record) => {
        const valor = record.vehiculo?.tipo_vehiculo?.valor || 0;
        const tiempo = calcularTiempoEstadia(record.fecha_ingreso, record.hora_ingreso);
        const total = valor * (tiempo.fracciones > 0 ? tiempo.fracciones : 1);
        return <span> S/ {total}</span>;
      },
    },
    {
      title: 'Tipo de Vehículo',
      key: 'tipo_vehiculo',
      render: (_, record) => {
        const tipo = record.vehiculo?.tipo_vehiculo;
        return tipo ? (
          <Tag color="purple"><TagOutlined /> {tipo.nombre}</Tag>
        ) : <span style={{color: '#aaa'}}>Sin tipo</span>;
      },
    },
    {
      title: 'Terminar',
      key: 'terminar',
      render: (_, record) => (
        <Tooltip title="Terminar ingreso">
          <Button type="primary" icon={<CheckCircleOutlined />} danger onClick={() => handleTerminar(record)}>
            Terminar
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <AppLayout>
      <EditarForm
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onFinish={async (values) => {
          setEditLoading(true);
          try {
            const payload = {
              vehiculo: {
                placa: values.placa,
                tipo_vehiculo: { id: values.tipo_vehiculo },
                persona: {
                  tipo_persona: values.tipo_persona,
                  dni: values.dni,
                  nombre: values.propietario,
                  telefono: values.telefono,
                },
              },
              user:{
                name: values.usuario,
              },
              fecha_ingreso: values.fecha,
              hora_ingreso: values.hora,
              observaciones: values.observaciones,
              prohibido: values.prohibido,
            };
            const response = await ingresoService.updateIngreso(ingresoEdit.id, payload);
            if (response.success) {
              message.success('Ingreso actualizado');
              setModalVisible(false);
              setIngresoEdit(null);
              setPlacaEdit("");
              cargarIngresos(pagination.current, pagination.pageSize);
            } else {
              message.error(response.message || 'Error al actualizar ingreso');
            }
          } catch (error) {
            message.error(error.message || 'Error al actualizar ingreso');
          } finally {
            setEditLoading(false);
          }
        }}
        initialValues={ingresoEdit && {
          placa: placaEdit,
          fecha: ingresoEdit?.fecha_ingreso,
          hora: ingresoEdit?.hora_ingreso,
          tipo_persona: ingresoEdit?.vehiculo?.persona?.tipo_persona || '',
          usuario: ingresoEdit?.usuario?.name || ingresoEdit?.usuario?.nombre || '',
          prohibido: ingresoEdit?.prohibido || false,
          observaciones: ingresoEdit?.observaciones || '',
          tipo_vehiculo: ingresoEdit?.vehiculo?.tipo_vehiculo?.id || '',
          dni: ingresoEdit?.vehiculo?.persona?.dni || '',
          propietario: ingresoEdit?.vehiculo?.persona?.nombre || '',
          telefono: ingresoEdit?.vehiculo?.persona?.telefono || '',
        }}
        loading={editLoading}
        setPlacaEdit={setPlacaEdit}
        ingresoEdit={ingresoEdit}
        tiposVehiculo={tiposVehiculo}
      />

      {/* Modal de Terminar Ingreso */}
      <TerminarModal
        visible={terminarModalVisible}
        ingreso={ingresoTerminar}
        onCancel={() => setTerminarModalVisible(false)}
        onPagoEfectivo={() => {
          setTerminarModalVisible(false);
          message.success('Pago registrado: Efectivo');
        }}
        onPagoYape={() => {
          setTerminarModalVisible(false);
          message.success('Pago registrado: Yape');
        }}
      />
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={24} lg={12} style={{ marginBottom: 16 }}>
            <Card>
              <Space>
                <Input
                  type="text"
                  placeholder="Placa para nuevo ingreso"
                  value={nuevaPlaca}
                  onChange={e => setNuevaPlaca(e.target.value.replace(/[^A-Z0-9-]/gi, '').toUpperCase())}
                  style={{ width: 180, padding: 6, borderRadius: 4, textTransform: 'uppercase' }}
                  maxLength={15}
                  autoComplete="off"
                />
                <Button
                  type="primary"
                  loading={registrando}
                  disabled={!nuevaPlaca.trim()}
                  onClick={async () => {
                    setRegistrando(true);
                    try {
                      // Verificar si la placa ya está registrada en ingresos activos
                      const placaExiste = ingresos.some(
                        i => i.vehiculo?.placa?.toUpperCase() === nuevaPlaca.trim()
                      );
                      if (placaExiste) {
                        message.success('Vehículo en cochera');
                        setRegistrando(false);
                        return;
                      }
                      // Aquí deberías llamar a la API para registrar el ingreso
                      const response = await vehiculoService.createVehiculo({ placa: nuevaPlaca.trim() });
                      if (response.success) {
                        message.success('Ingreso correctamente');
                        setNuevaPlaca("");
                        cargarIngresos(pagination.current, pagination.pageSize);
                      } else {
                        message.error(response.message || 'Error al registrar ingreso');
                      }
                    } catch (error) {
                      message.error(error.message || 'Error al registrar ingreso');
                    } finally {
                      setRegistrando(false);
                    }
                  }}
                >
                  Registrar Ingreso
                </Button>
              </Space>
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Total Ingresos"
                value={pagination.total}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => cargarIngresos()}
                loading={loading}
                block
              >
                Actualizar
              </Button>
            </Card>
          </Col>
        </Row>
        <Card
          title="Lista de Ingresos"
          extra={
            <Input
              type="text"
              placeholder="Buscar por placa..."
              value={searchText}
              onChange={e => setSearchText(e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase())}
              style={{ width: 200, padding: 6, borderRadius: 4, textTransform: 'uppercase' }}
              maxLength={15}
              autoComplete="off"
            />
          }
        >
          <Table
            columns={columns}
            dataSource={
              searchText.trim()
                ? ingresos.filter(i => i.vehiculo?.placa?.toUpperCase().includes(searchText.trim()))
                : ingresos
            }
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '15', '20', '50', '100'],
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} ingresos`,
              size: 'default',
            }}
            onChange={handleTableChange}
            rowKey="id"
            scroll={{ x: 900 }}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default IngresoList;
