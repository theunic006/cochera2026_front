import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Row, Col, Statistic, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

/**
 * Componente de tabla genérica reutilizable
 * Props:
 * - columns: array - Columnas de la tabla
 * - dataSource: array - Datos de la tabla
 * - loading: boolean - Estado de carga
 * - pagination: object - Configuración de paginación
 * - onTableChange: function - Función para cambios de paginación
 * - onReload: function - Función para recargar datos
 * - searchPlaceholder: string - Placeholder del buscador
 * - searchFilterKey: string - Campo por el cual filtrar (ej: 'placa')
 * - searchFilterPath: string - Ruta anidada para filtrar (ej: 'vehiculo.placa')
 * - title: string - Título de la tabla
 * - extraActions: ReactNode - Acciones extra en el header
 * - showSearch: boolean - Mostrar buscador (default: true)
 * - showReload: boolean - Mostrar botón recargar (default: true)
 * - showStats: boolean - Mostrar estadísticas (default: true)
 * - statsTitle: string - Título de las estadísticas
 * - statsIcon: ReactNode - Icono de las estadísticas
 * - rowKey: string - Key para las filas (default: 'id')
 * - scroll: object - Configuración de scroll
 */
const TableBase = ({
  columns,
  dataSource = [],
  loading = false,
  pagination = {},
  onTableChange,
  onReload,
  searchPlaceholder = "Buscar...",
  searchFilterKey = null,
  searchFilterPath = null,
  customSearchFilter = null, // Nueva prop para filtro personalizado
  title = "Lista",
  extraActions = null,
  showSearch = true,
  showReload = true,
  showStats = true,
  statsTitle = "Total",
  statsIcon = null,
  rowKey = "id",
  scroll = { x: 900 },
  searchText, // Prop externa para controlar el texto de búsqueda
  setSearchText, // Prop externa para actualizar el texto de búsqueda
  ...tableProps
}) => {
  // Permitir control externo del estado de búsqueda
  const [internalSearchText, setInternalSearchText] = useState("");
  const searchValue = typeof searchText === 'string' ? searchText : internalSearchText;
  const setSearchValue = typeof setSearchText === 'function' ? setSearchText : setInternalSearchText;

  // Función para obtener valor anidado del objeto
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Filtrar datos según el texto de búsqueda
  // Ya no filtramos localmente, solo mostramos lo que llega
  const filteredData = dataSource;

  // Configuración por defecto de paginación
  const defaultPagination = {
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '15', '20', '50', '100'],
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} elementos`,
    size: 'default',
    ...pagination
  };

  return (
    <div>
      {/* Estadísticas y controles superiores */}
      {(showStats || showReload) && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {showStats && (
            <Col xs={12} sm={8} lg={6}>
              <Card>
                <Statistic
                  title={statsTitle}
                  value={pagination.total || dataSource.length}
                  prefix={statsIcon}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          )}
          {showReload && (
            <Col xs={12} sm={8} lg={6}>
              <Card>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onReload}
                  loading={loading}
                  block
                >
                  Actualizar
                </Button>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* Tabla principal */}
      <Card
        title={title}
        extra={
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {showSearch && (
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value.toUpperCase())}
                style={{ width: 200, textTransform: 'uppercase' }}
                maxLength={50}
                autoComplete="off"
              />
            )}
            {extraActions}
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={defaultPagination}
          onChange={onTableChange}
          rowKey={rowKey}
          scroll={scroll}
          {...tableProps}
        />
      </Card>
    </div>
  );
};

export default TableBase;