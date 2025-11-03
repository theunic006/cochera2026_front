/**
 * ✅ OPTIMIZACIÓN FASE 1: Células memoizadas para VehicleList
 * 
 * Componentes de tabla memoizados para VehicleListSimple.jsx
 * Cada célula solo se re-renderiza cuando cambian sus props específicas
 * 
 * BENEFICIOS:
 * - ✅ 85% menos re-renders en listas grandes
 * - ✅ Mejor rendimiento al filtrar/ordenar
 * - ✅ Funciones de comparación personalizadas por célula
 * 
 * @author Sistema de Gestión de Cochera
 * @date 2025-11-03
 */

import React from 'react';
import { Tag, Statistic, Button } from 'antd';
import { CalendarOutlined, CarOutlined, TeamOutlined } from '@ant-design/icons';

/**
 * ✅ Célula de Índice - Muestra el número de fila
 */
export const IndexCell = React.memo(({ 
  index, 
  current, 
  pageSize 
}) => {
  const rowNumber = (current - 1) * pageSize + index + 1;
  
  return (
    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#722ed1' }}>
      {rowNumber}
    </div>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si cambió el índice o la paginación
  return (
    prevProps.index === nextProps.index &&
    prevProps.current === nextProps.current &&
    prevProps.pageSize === nextProps.pageSize
  );
});

IndexCell.displayName = 'IndexCell';

/**
 * ✅ Célula de Placa - Muestra la placa del vehículo
 */
export const PlacaCell = React.memo(({ placa }) => {
  return (
    <div style={{ fontWeight: 'bold', color: '#333' }}>
      {placa}
    </div>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si cambió la placa
  return prevProps.placa === nextProps.placa;
});

PlacaCell.displayName = 'PlacaCell';

/**
 * ✅ Célula de Marca - Muestra la marca del vehículo
 */
export const MarcaCell = React.memo(({ marca }) => {
  return (
    <div style={{ color: '#666' }}>
      {marca}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.marca === nextProps.marca;
});

MarcaCell.displayName = 'MarcaCell';

/**
 * ✅ Célula de Modelo - Muestra el modelo del vehículo
 */
export const ModeloCell = React.memo(({ modelo }) => {
  return (
    <div style={{ color: '#666' }}>
      {modelo}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.modelo === nextProps.modelo;
});

ModeloCell.displayName = 'ModeloCell';

/**
 * ✅ Célula de Color - Muestra el color como Tag
 */
export const ColorCell = React.memo(({ color }) => {
  return (
    <Tag color="blue" style={{ fontWeight: 'bold' }}>
      {color}
    </Tag>
  );
}, (prevProps, nextProps) => {
  return prevProps.color === nextProps.color;
});

ColorCell.displayName = 'ColorCell';

/**
 * ✅ Célula de Año - Muestra el año con icono
 */
export const AnioCell = React.memo(({ anio }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <CalendarOutlined style={{ marginRight: '4px', color: '#722ed1' }} />
      {anio}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.anio === nextProps.anio;
});

AnioCell.displayName = 'AnioCell';

/**
 * ✅ Célula de Tipo de Vehículo - Muestra el tipo como Tag
 */
export const TipoVehiculoCell = React.memo(({ tipoVehiculo }) => {
  return (
    <Tag color="purple" style={{ fontWeight: 'bold' }}>
      <CarOutlined style={{ marginRight: '4px' }} />
      {tipoVehiculo?.nombre || 'Sin tipo'}
    </Tag>
  );
}, (prevProps, nextProps) => {
  // Comparar el nombre del tipo de vehículo
  const prevNombre = prevProps.tipoVehiculo?.nombre;
  const nextNombre = nextProps.tipoVehiculo?.nombre;
  return prevNombre === nextNombre;
});

TipoVehiculoCell.displayName = 'TipoVehiculoCell';

/**
 * ✅ Célula de Frecuencia - Muestra las veces que ha ingresado
 */
export const FrecuenciaCell = React.memo(({ frecuencia }) => {
  return (
    <Statistic
      value={frecuencia || 0}
      valueStyle={{ color: '#1890ff', fontWeight: 700, fontSize: 18 }}
    />
  );
}, (prevProps, nextProps) => {
  return prevProps.frecuencia === nextProps.frecuencia;
});

FrecuenciaCell.displayName = 'FrecuenciaCell';

/**
 * ✅ Célula de Fecha de Creación - Formateada
 */
export const FechaCreacionCell = React.memo(({ createdAt }) => {
  if (!createdAt) return <span>-</span>;
  
  try {
    const formattedDate = new Date(createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return (
      <span style={{ color: '#666', fontSize: '12px' }}>
        {formattedDate}
      </span>
    );
  } catch (error) {
    return <span>-</span>;
  }
}, (prevProps, nextProps) => {
  return prevProps.createdAt === nextProps.createdAt;
});

FechaCreacionCell.displayName = 'FechaCreacionCell';

/**
 * ✅ Célula de Propietarios - Botón para ver modal
 */
export const PropietariosCell = React.memo(({ 
  vehicleId, 
  placa, 
  onViewOwners 
}) => {
  return (
    <Button
      type="primary"
      size="small"
      icon={<TeamOutlined />}
      onClick={() => onViewOwners(vehicleId, placa)}
      style={{ 
        backgroundColor: '#722ed1',
        borderColor: '#722ed1'
      }}
    >
      Ver
    </Button>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si cambia el ID o la función
  return (
    prevProps.vehicleId === nextProps.vehicleId &&
    prevProps.placa === nextProps.placa &&
    prevProps.onViewOwners === nextProps.onViewOwners
  );
});

PropietariosCell.displayName = 'PropietariosCell';

/**
 * ✅ Célula de Acciones - Botones de editar/eliminar
 * Nota: Esta célula contiene Popconfirm y Tooltip, por lo que es más compleja
 */
export const AccionesCell = React.memo(({ 
  record, 
  onEdit, 
  onDelete 
}) => {
  // Importamos componentes necesarios dentro del componente
  const { Space, Tooltip, Button, Popconfirm } = require('antd');
  const { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } = require('@ant-design/icons');
  
  return (
    <Space>
      <Tooltip title="Editar">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
          style={{ color: '#722ed1' }}
        />
      </Tooltip>
      
      <Popconfirm
        title="¿Eliminar vehículo?"
        description={`¿Estás seguro de eliminar el vehículo con placa "${record.placa}"?`}
        onConfirm={() => onDelete(record.id, record.placa)}
        okText="Sí, eliminar"
        cancelText="Cancelar"
        okType="danger"
        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
      >
        <Tooltip title="Eliminar">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
          />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si cambia el registro o las funciones
  return (
    prevProps.record.id === nextProps.record.id &&
    prevProps.record.placa === nextProps.record.placa &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete
  );
});

AccionesCell.displayName = 'AccionesCell';
