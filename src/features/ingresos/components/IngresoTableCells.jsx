import React from 'react';
import { Button, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { calcularTiempoEstadiaConTolerancia } from '../../../utils/CalValores';

/**
 * Componente memoizado para mostrar la placa con observaciones
 * Solo se re-renderiza si la placa o las observaciones cambian
 */
export const PlacaCell = React.memo(({ vehiculo, onClick }) => {
  if (!vehiculo?.placa) {
    return <span style={{ color: '#aaa' }}>Sin placa</span>;
  }

  // Buscar la observación más reciente
  const obs = Array.isArray(vehiculo?.observaciones) && vehiculo.observaciones.length > 0
    ? vehiculo.observaciones[vehiculo.observaciones.length - 1]
    : null;

  // Asignar clase según tipo de observación
  let obsClass = '';
  if (obs) {
    switch ((obs.tipo || '').toLowerCase()) {
      case 'leve':
        obsClass = 'obs-opcion-leve';
        break;
      case 'grave':
        obsClass = 'obs-opcion-grave';
        break;
      case 'advertencia':
        obsClass = 'obs-opcion-advertencia';
        break;
      case 'información':
        obsClass = 'obs-opcion-info';
        break;
      case 'otro':
        obsClass = 'obs-opcion-otro';
        break;
      default:
        obsClass = 'obs-opcion-ninguno';
    }
  }

  return (
    <Button
      className={`placa-btn-responsive ${obsClass}`}
      color='primary'
      variant='outlined'
      type="link"
      onClick={onClick}
    >
      {vehiculo.placa}
    </Button>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si cambia la placa o las observaciones
  return (
    prevProps.vehiculo?.placa === nextProps.vehiculo?.placa &&
    prevProps.vehiculo?.observaciones?.length === nextProps.vehiculo?.observaciones?.length
  );
});

PlacaCell.displayName = 'PlacaCell';

/**
 * Componente memoizado para mostrar la hora de ingreso
 */
export const HoraIngresoCell = React.memo(({ horaIngreso }) => (
  <span>
    <ClockCircleOutlined /> {horaIngreso}
  </span>
), (prevProps, nextProps) => {
  return prevProps.horaIngreso === nextProps.horaIngreso;
});

HoraIngresoCell.displayName = 'HoraIngresoCell';

/**
 * Componente memoizado para calcular y mostrar el tiempo de estadía
 */
export const TiempoEstadiaCell = React.memo(({ fechaIngreso, horaIngreso, toleranciaMinutos }) => {
  const tiempo = calcularTiempoEstadiaConTolerancia(fechaIngreso, horaIngreso, toleranciaMinutos);
  
  return (
    <span>
      <ClockCircleOutlined /> {tiempo.texto}
    </span>
  );
}, (prevProps, nextProps) => {
  // Solo recalcular si cambia la fecha/hora de ingreso o la tolerancia
  return (
    prevProps.fechaIngreso === nextProps.fechaIngreso &&
    prevProps.horaIngreso === nextProps.horaIngreso &&
    prevProps.toleranciaMinutos === nextProps.toleranciaMinutos
  );
});

TiempoEstadiaCell.displayName = 'TiempoEstadiaCell';

/**
 * Componente memoizado para mostrar el precio por hora
 */
export const PrecioCell = React.memo(({ tipoVehiculo }) => {
  const valor = tipoVehiculo?.valor;
  
  return valor ? (
    <span>S/ {valor}.00</span>
  ) : (
    <span style={{color: '#aaa'}}>Sin valor</span>
  );
}, (prevProps, nextProps) => {
  return prevProps.tipoVehiculo?.valor === nextProps.tipoVehiculo?.valor;
});

PrecioCell.displayName = 'PrecioCell';

/**
 * Componente memoizado para calcular y mostrar el total a pagar
 */
export const TotalPagarCell = React.memo(({ fechaIngreso, horaIngreso, tipoVehiculo, toleranciaMinutos }) => {
  const valor = tipoVehiculo?.valor || 0;
  const tiempo = calcularTiempoEstadiaConTolerancia(fechaIngreso, horaIngreso, toleranciaMinutos);
  const total = valor * (tiempo.fracciones > 0 ? tiempo.fracciones : 1);
  
  return <span>S/ {total}.00</span>;
}, (prevProps, nextProps) => {
  // Solo recalcular si cambia algún dato relevante
  return (
    prevProps.fechaIngreso === nextProps.fechaIngreso &&
    prevProps.horaIngreso === nextProps.horaIngreso &&
    prevProps.tipoVehiculo?.valor === nextProps.tipoVehiculo?.valor &&
    prevProps.toleranciaMinutos === nextProps.toleranciaMinutos
  );
});

TotalPagarCell.displayName = 'TotalPagarCell';

/**
 * Componente memoizado para mostrar el tipo de vehículo
 */
export const TipoVehiculoCell = React.memo(({ tipoVehiculo }) => {
  const nombre = tipoVehiculo?.nombre;
  
  return nombre ? (
    <Tag color="blue">{nombre}</Tag>
  ) : (
    <span style={{color: '#aaa'}}>Sin tipo</span>
  );
}, (prevProps, nextProps) => {
  return prevProps.tipoVehiculo?.nombre === nextProps.tipoVehiculo?.nombre;
});

TipoVehiculoCell.displayName = 'TipoVehiculoCell';

/**
 * Componente memoizado para mostrar el propietario
 */
export const PropietarioCell = React.memo(({ vehiculo }) => {
  const propietario = vehiculo?.propietario;
  
  return propietario ? (
    <span>{propietario.nombre}</span>
  ) : (
    <span style={{color: '#aaa'}}>Sin propietario</span>
  );
}, (prevProps, nextProps) => {
  return prevProps.vehiculo?.propietario?.nombre === nextProps.vehiculo?.propietario?.nombre;
});

PropietarioCell.displayName = 'PropietarioCell';

export default {
  PlacaCell,
  HoraIngresoCell,
  TiempoEstadiaCell,
  PrecioCell,
  TotalPagarCell,
  TipoVehiculoCell,
  PropietarioCell
};
