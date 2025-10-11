import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { calcularTiempoEstadiaConTolerancia } from '../../utils/CalValores';
import { Card, Button, Space, Tooltip, Row, Col, message, Tag, Input } from 'antd';
import { CarOutlined, ClockCircleOutlined, DollarOutlined, TagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import TableBase from '../common/TableBase';
import { ingresoService } from '../../services/ingresoService';
import { vehiculoService } from '../../services/vehiculoService';
import AppLayout from '../AppLayout';
import EditarForm from './EditarForm';
import TerminarModal from './TerminarModal';
import { vehicleTypeService } from '../../services/vehicleTypeService';
import { toleranceService } from '../../services/toleranceService';
import { useAuth } from '../../context/AuthContext';

const { Search } = Input;

// Componente optimizado para el input de nueva placa
const PlacaInput = React.memo(({ value, onChange, onRegister, loading, disabled }) => (
  <Space>
    <Input
      type="text"
      placeholder="Placa para nuevo ingreso"
      value={value}
      onChange={onChange}
      style={{ width: 180, padding: 6, borderRadius: 4 }}
      maxLength={15}
      autoComplete="off"
    />
    <Button
      type="primary"
      loading={loading}
      disabled={disabled}
      onClick={onRegister}
    >
      Registrar Ingreso
    </Button>
  </Space>
));

const IngresoList = () => {
  const { user } = useAuth();
  const [toleranciaMinutos, setToleranciaMinutos] = useState(null);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
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

  // Función para cargar ingresos
  const cargarIngresos = useCallback(async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const response = await ingresoService.getIngresos(page, pageSize);
      if (response.success) {
        setIngresos(response.data);
        setPagination(prev => ({
          ...prev,
          current: response.pagination?.current_page || page,
          pageSize: response.pagination?.per_page || pageSize,
          total: response.pagination?.total || response.data.length,
        }));
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

    // Obtener tolerancia de la empresa actual usando el servicio
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
    cargarIngresos();
  }, [cargarIngresos]);

  // Función optimizada para manejar cambios en la placa
  const handlePlacaChange = useCallback((e) => {
    const value = e.target.value;
    // Solo convertir a mayúsculas, mover validaciones al momento del submit
    setNuevaPlaca(value.toUpperCase());
  }, []);

  // Función para limpiar y validar placa antes de enviar
  const cleanPlacaForSubmit = useCallback((placa) => {
    return placa.replace(/[^A-Z0-9-]/g, '').trim();
  }, []);

  // Función memoizada para registrar nuevo ingreso
  const handleRegistrarIngreso = useCallback(async () => {
    setRegistrando(true);
    try {
      // Limpiar y validar placa antes de procesar
      const placaLimpia = cleanPlacaForSubmit(nuevaPlaca);
      
      if (!placaLimpia) {
        message.warning('Ingrese una placa válida (solo letras, números y guiones)');
        setRegistrando(false);
        return;
      }

      // Verificar si la placa ya está registrada en ingresos activos
      const placaExiste = ingresos.some(
        i => i.vehiculo?.placa?.toUpperCase() === placaLimpia
      );
      if (placaExiste) {
        message.success('Vehículo en cochera');
        setRegistrando(false);
        return;
      }
      // Aquí deberías llamar a la API para registrar el ingreso
      const response = await vehiculoService.createVehiculo({ placa: placaLimpia });
      if (response.success) {
        message.success('Ingreso correctamente');
        setNuevaPlaca("");
        cargarIngresos();
      } else {
        message.error(response.message || 'Error al registrar ingreso');
      }
    } catch (error) {
      message.error(error.message || 'Error al registrar ingreso');
    } finally {
      setRegistrando(false);
    }
  }, [nuevaPlaca, ingresos, cleanPlacaForSubmit, cargarIngresos]);

  const handleTableChange = useCallback((newPagination) => {
    cargarIngresos(newPagination.current, newPagination.pageSize);
  }, [cargarIngresos]);

  const handleTerminar = useCallback(async (ingreso) => {
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
  }, []);

  // Función memoizada para recargar datos
  const handleReload = useCallback(() => {
    cargarIngresos(pagination.current, pagination.pageSize);
  }, [cargarIngresos, pagination.current, pagination.pageSize]);

  // Función optimizada para editar ingreso
  const handleEditIngreso = useCallback((record) => {
    setIngresoEdit(record);
    setPlacaEdit(record.vehiculo.placa);
    setModalVisible(true);
  }, []);

  // Memoizar las columnas para evitar re-renders innecesarios
  const columns = useMemo(() => [
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
            onClick={() => handleEditIngreso(record)}
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
        const tiempo = calcularTiempoEstadiaConTolerancia(record.fecha_ingreso, record.hora_ingreso, toleranciaMinutos);
        return <span><ClockCircleOutlined /> {tiempo.texto}</span>;
      },
    },
    {
      title: 'Precio',
      key: 'precio',
      render: (_, record) => {
        const valor = record.vehiculo?.tipo_vehiculo?.valor;
        return valor ? <span>S/ {valor}.00</span> : <span style={{color: '#aaa'}}>Sin valor</span>;
      },
    },
    {
      title: 'Total a Pagar',
      key: 'total_pagar',
      render: (_, record) => {
        const valor = record.vehiculo?.tipo_vehiculo?.valor || 0;
        const tiempo = calcularTiempoEstadiaConTolerancia(record.fecha_ingreso, record.hora_ingreso, toleranciaMinutos);
        const total = valor * (tiempo.fracciones > 0 ? tiempo.fracciones : 1);
        return <span> S/ {total}.00</span>;
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
  ], [toleranciaMinutos, handleEditIngreso, handleTerminar]);

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
              cargarIngresos();
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
          cargarIngresos();
        }}
        onPagoYape={() => {
          setTerminarModalVisible(false);
          message.success('Pago registrado: Yape');
          cargarIngresos();
        }}
      />
      <div>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={24} lg={12} style={{ marginBottom: 16 }}>
            <Card>
              <PlacaInput
                value={nuevaPlaca}
                onChange={handlePlacaChange}
                onRegister={handleRegistrarIngreso}
                loading={registrando}
                disabled={!nuevaPlaca.trim()}
              />
            </Card>
          </Col>
        </Row>

        <TableBase
          columns={columns}
          dataSource={ingresos}
          loading={loading}
          pagination={pagination}
          onTableChange={handleTableChange}
          onReload={handleReload}
          searchPlaceholder="Buscar por placa..."
          searchFilterPath="vehiculo.placa"
          title="Lista de Ingresos"
          statsTitle="Total Ingresos"
          statsIcon={<CarOutlined />}
        />
      </div>
    </AppLayout>
  );
};

export default IngresoList;
