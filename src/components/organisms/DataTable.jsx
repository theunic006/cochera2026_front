import { useState, useEffect } from 'react';
import { Table, Space, Modal } from 'antd';
import SearchBar from '../molecules/SearchBar';
import PageHeader from '../molecules/PageHeader';
import ActionButtons from '../molecules/ActionButtons';
import CrudActions from '../molecules/CrudActions';
import EmptyState from '../molecules/EmptyState';
import PrimaryButton from '../atoms/PrimaryButton';
import PurpleButton from '../atoms/PurpleButton';
import SuccessButton from '../atoms/SuccessButton';
import DangerButton from '../atoms/DangerButton';
import WarningButton from '../atoms/WarningButton';
import CyanButton from '../atoms/CyanButton';
import PinkButton from '../atoms/PinkButton';
import YellowButton from '../atoms/YellowButton';
import DarkGreenButton from '../atoms/DarkGreenButton';
import DefaultButton from '../atoms/DefaultButton';
import { PlusOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * DataTable Organism - Tabla genérica con CRUD, búsqueda, paginación
 * 
 * @component
 * @example
 * <DataTable
 *   title="Gestión de Roles"
 *   dataSource={roles}
 *   columns={columns}
 *   onCreate={() => setModalVisible(true)}
 *   onEdit={(record) => handleEdit(record)}
 *   onDelete={(record) => handleDelete(record)}
 * />
 */
const DataTable = ({
  // Header
  title,
  subtitle,
  breadcrumbItems = [],
  
  // Data
  dataSource = [],
  columns = [],
  loading = false,
  rowKey = 'id',
  
  // Search
  searchable = true,
  showSearch = true,
  searchPlaceholder = 'Buscar...',
  onSearch,
  
  // Pagination
  pagination = true,
  pageSize = 10,
  total,
  currentPage,
  onPageChange,
  
  // Actions
  onCreate,
  onEdit,
  onDelete,
  onRefresh,
  createButtonText = 'Crear',
  refreshButtonText = 'Actualizar',
  showCreateButton = true,
  showRefreshButton = true,
  showSearchBar = true,
  createButtonColor = 'purple', // 'purple' | 'primary' | 'success' | 'danger' | etc
  refreshButtonColor = 'primary',
  searchBarWidth = 300,
  showActions = true,
  extraActions = [],
  extraHeaderActions,
  
  // Table props
  scroll,
  bordered = false,
  size = 'middle',
  expandable,
  rowSelection,
  
  // Empty state
  emptyText = 'No hay datos disponibles',
  emptyDescription,
  
  // Custom
  className = '',
  style = {},
  tableProps = {},
  
  ...rest
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState(dataSource);

  // Actualizar filteredData cuando dataSource cambie
  useEffect(() => {
    setFilteredData(dataSource);
  }, [dataSource]);

  // Helper para obtener el componente de botón según el color
  const getButtonComponent = (color) => {
    const buttonMap = {
      primary: PrimaryButton,
      purple: PurpleButton,
      success: SuccessButton,
      danger: DangerButton,
      warning: WarningButton,
      cyan: CyanButton,
      pink: PinkButton,
      yellow: YellowButton,
      darkgreen: DarkGreenButton,
      default: DefaultButton,
    };
    return buttonMap[color.toLowerCase()] || PurpleButton;
  };

  // Manejar búsqueda local si no hay onSearch externo
  const handleSearch = (value) => {
    setSearchValue(value);
    
    if (onSearch) {
      // Búsqueda controlada externamente
      onSearch(value);
    } else {
      // Búsqueda local
      if (!value) {
        setFilteredData(dataSource);
      } else {
        const filtered = dataSource.filter(item =>
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(value.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    }
  };

  // Manejar eliminación - delegar al componente padre
  const handleDelete = (record) => {
    if (onDelete) {
      onDelete(record);
    }
  };

  // Agregar columna de acciones si es necesario
  const enhancedColumns = [...columns];
  if (showActions && (onEdit || onDelete)) {
    enhancedColumns.push({
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <ActionButtons
          onEdit={onEdit ? () => onEdit(record) : undefined}
          onDelete={onDelete ? () => handleDelete(record) : undefined}
          showEdit={!!onEdit}
          showDelete={!!onDelete}
          extraActions={extraActions}
        />
      ),
    });
  }

  // Configuración de paginación
  const paginationConfig = pagination
    ? {
        pageSize: pageSize,
        total: total || filteredData.length,
        current: currentPage,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }
    : false;

  // Datos a mostrar
  const displayData = onSearch ? dataSource : filteredData;

  // Componentes de botones según color
  const CreateButtonComponent = getButtonComponent(createButtonColor);
  const RefreshButtonComponent = getButtonComponent(refreshButtonColor);

  return (
    <div className={className} style={style} {...rest}>
      {/* Header */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbItems={breadcrumbItems}
        showDivider={false}
        actions={
          extraHeaderActions || (
            <div style={{ width: '100%' }}>
              {/* Primera fila: Botones de acción */}
              <Space style={{ marginBottom: showSearchBar ? 12 : 0 }}>
                {showCreateButton && onCreate && (
                  <CreateButtonComponent
                    icon={<PlusOutlined />}
                    onClick={onCreate}
                    loading={loading}
                    size="middle"
                  >
                    {createButtonText}
                  </CreateButtonComponent>
                )}
                {showRefreshButton && onRefresh && (
                  <RefreshButtonComponent
                    icon={<ReloadOutlined />}
                    onClick={onRefresh}
                    loading={loading}
                    size="middle"
                  >
                    {refreshButtonText}
                  </RefreshButtonComponent>
                )}
              </Space>
              
              {/* Segunda fila: Barra de búsqueda (alineada a la derecha) */}
              {showSearchBar && searchable && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SearchBar
                    placeholder={searchPlaceholder}
                    onSearch={handleSearch}
                    onChange={handleSearch}
                    allowClear
                    size="middle"
                    style={{ width: searchBarWidth }}
                  />
                </div>
              )}
            </div>
          )
        }
      />

      {/* Table */}
      <Table
        dataSource={displayData}
        columns={enhancedColumns}
        loading={loading}
        rowKey={rowKey}
        pagination={paginationConfig}
        scroll={scroll}
        bordered={bordered}
        size={size}
        expandable={expandable}
        rowSelection={rowSelection}
        locale={{
          emptyText: (
            <EmptyState
              title={emptyText}
              description={emptyDescription}
            />
          ),
        }}
        {...tableProps}
      />
    </div>
  );
};

DataTable.propTypes = {
  // Header
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  breadcrumbItems: PropTypes.array,
  
  // Data
  dataSource: PropTypes.array,
  columns: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  
  // Search
  searchable: PropTypes.bool,
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  onSearch: PropTypes.func,
  
  // Pagination
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  pageSize: PropTypes.number,
  total: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  
  // Actions
  onCreate: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onRefresh: PropTypes.func,
  createButtonText: PropTypes.string,
  refreshButtonText: PropTypes.string,
  showCreateButton: PropTypes.bool,
  showRefreshButton: PropTypes.bool,
  showSearchBar: PropTypes.bool,
  createButtonColor: PropTypes.oneOf(['primary', 'purple', 'success', 'danger', 'warning', 'cyan', 'pink', 'yellow', 'darkgreen', 'default']),
  refreshButtonColor: PropTypes.oneOf(['primary', 'purple', 'success', 'danger', 'warning', 'cyan', 'pink', 'yellow', 'darkgreen', 'default']),
  searchBarWidth: PropTypes.number,
  showActions: PropTypes.bool,
  extraActions: PropTypes.array,
  extraHeaderActions: PropTypes.node,
  
  // Table props
  scroll: PropTypes.object,
  bordered: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  expandable: PropTypes.object,
  rowSelection: PropTypes.object,
  
  // Empty state
  emptyText: PropTypes.string,
  emptyDescription: PropTypes.string,
  
  // Custom
  className: PropTypes.string,
  style: PropTypes.object,
  tableProps: PropTypes.object,
};

export default DataTable;
