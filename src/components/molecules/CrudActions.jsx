import { Space } from 'antd';
import PrimaryButton from '../atoms/PrimaryButton';
import SuccessButton from '../atoms/SuccessButton';
import WarningButton from '../atoms/WarningButton';
import DangerButton from '../atoms/DangerButton';
import DefaultButton from '../atoms/DefaultButton';
import Tooltip from '../atoms/Tooltip';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * CrudActions Molecule - Botones CRUD completos (Crear/Ver/Editar/Eliminar)
 * 
 * Componente versátil que maneja todas las acciones CRUD estándar.
 * Usa botones atoms especializados según la acción.
 * 
 * @component
 * @example
 * // Uso como botones de fila (Edit/Delete)
 * <CrudActions
 *   onEdit={() => handleEdit(record)}
 *   onDelete={() => handleDelete(record)}
 *   size="small"
 *   buttonType="link"
 * />
 * 
 * @example
 * // Uso como botones de header (Create)
 * <CrudActions
 *   onCreate={handleCreate}
 *   createText="Nuevo Rol"
 *   size="middle"
 *   buttonType="default"
 * />
 * 
 * @example
 * // Uso completo con todas las acciones
 * <CrudActions
 *   onCreate={handleCreate}
 *   onView={handleView}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   createText="Nuevo"
 *   size="middle"
 * />
 */
const CrudActions = ({ 
  // Acciones CRUD
  onCreate,
  onView,
  onEdit,
  onDelete,
  onRefresh,
  
  // Textos y tooltips
  createText = 'Crear',
  createTooltip = 'Crear nuevo',
  viewTooltip = 'Ver detalles',
  editTooltip = 'Editar',
  deleteTooltip = 'Eliminar',
  refreshTooltip = 'Actualizar',
  
  // Estados de loading
  createLoading = false,
  viewLoading = false,
  editLoading = false,
  deleteLoading = false,
  refreshLoading = false,
  
  // Estados de disabled
  createDisabled = false,
  viewDisabled = false,
  editDisabled = false,
  deleteDisabled = false,
  refreshDisabled = false,
  
  // Visibilidad
  showCreate = true,
  showView = true,
  showEdit = true,
  showDelete = true,
  showRefresh = true,
  
  // Iconos personalizados
  createIcon,
  viewIcon,
  editIcon,
  deleteIcon,
  refreshIcon,
  
  // Tipo de botón: 'default' | 'link' | 'text' | 'primary'
  buttonType = 'link',
  
  // Tamaño
  size = 'small',
  
  // Acciones extra
  extraActions = [],
  
  // Estilos
  className = '',
  style = {},
  spacing = 'small',
  
  ...rest 
}) => {
  const isCompact = buttonType === 'link' || buttonType === 'text';
  const buttonStyle = isCompact ? { padding: '4px 8px' } : {};

  return (
    <Space size={spacing} className={className} style={style} {...rest}>
      {/* Botón Crear - PrimaryButton */}
      {onCreate && showCreate && (
        <Tooltip title={createTooltip}>
          <PrimaryButton
            type={buttonType}
            size={size}
            icon={createIcon || <PlusOutlined />}
            onClick={onCreate}
            disabled={createDisabled}
            loading={createLoading}
            style={buttonStyle}
          >
            {!isCompact && createText}
          </PrimaryButton>
        </Tooltip>
      )}

      {/* Botón Refrescar - DefaultButton */}
      {onRefresh && showRefresh && (
        <Tooltip title={refreshTooltip}>
          <DefaultButton
            type={buttonType}
            size={size}
            icon={refreshIcon || <i className="fa fa-refresh" />}
            onClick={onRefresh}
            disabled={refreshDisabled}
            loading={refreshLoading}
            style={buttonStyle}
          >
            {!isCompact && 'Actualizar'}
          </DefaultButton>
        </Tooltip>
      )}

      {/* Botón Ver - SuccessButton */}
      {onView && showView && (
        <Tooltip title={viewTooltip}>
          <SuccessButton
            type={buttonType}
            size={size}
            icon={viewIcon || <EyeOutlined />}
            onClick={onView}
            disabled={viewDisabled}
            loading={viewLoading}
            style={buttonStyle}
            ghost={buttonType === 'default'}
          />
        </Tooltip>
      )}

      {/* Botón Editar - PrimaryButton */}
      {onEdit && showEdit && (
        <Tooltip title={editTooltip}>
          <PrimaryButton
            type={buttonType}
            size={size}
            icon={editIcon || <EditOutlined />}
            onClick={onEdit}
            disabled={editDisabled}
            loading={editLoading}
            style={buttonStyle}
          />
        </Tooltip>
      )}

      {/* Botón Eliminar - DangerButton */}
      {onDelete && showDelete && (
        <Tooltip title={deleteTooltip}>
          <DangerButton
            type={buttonType}
            size={size}
            icon={deleteIcon || <DeleteOutlined />}
            onClick={onDelete}
            disabled={deleteDisabled}
            loading={deleteLoading}
            style={buttonStyle}
          />
        </Tooltip>
      )}

      {/* Acciones extra personalizadas */}
      {extraActions.map((action, index) => {
        const ButtonComponent = action.danger ? DangerButton : 
                               action.success ? SuccessButton :
                               action.warning ? WarningButton :
                               action.primary ? PrimaryButton : DefaultButton;

        return (
          <Tooltip key={index} title={action.tooltip || ''}>
            <ButtonComponent
              type={buttonType}
              size={size}
              icon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
              loading={action.loading}
              style={{ ...buttonStyle, ...action.style }}
            />
          </Tooltip>
        );
      })}
    </Space>
  );
};

CrudActions.propTypes = {
  // Acciones
  onCreate: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onRefresh: PropTypes.func,
  
  // Textos
  createText: PropTypes.string,
  createTooltip: PropTypes.string,
  viewTooltip: PropTypes.string,
  editTooltip: PropTypes.string,
  deleteTooltip: PropTypes.string,
  refreshTooltip: PropTypes.string,
  
  // Loading states
  createLoading: PropTypes.bool,
  viewLoading: PropTypes.bool,
  editLoading: PropTypes.bool,
  deleteLoading: PropTypes.bool,
  refreshLoading: PropTypes.bool,
  
  // Disabled states
  createDisabled: PropTypes.bool,
  viewDisabled: PropTypes.bool,
  editDisabled: PropTypes.bool,
  deleteDisabled: PropTypes.bool,
  refreshDisabled: PropTypes.bool,
  
  // Visibility
  showCreate: PropTypes.bool,
  showView: PropTypes.bool,
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  showRefresh: PropTypes.bool,
  
  // Custom icons
  createIcon: PropTypes.node,
  viewIcon: PropTypes.node,
  editIcon: PropTypes.node,
  deleteIcon: PropTypes.node,
  refreshIcon: PropTypes.node,
  
  // Button appearance
  buttonType: PropTypes.oneOf(['default', 'link', 'text', 'primary']),
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  spacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  // Extra actions
  extraActions: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.node,
    onClick: PropTypes.func,
    tooltip: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    danger: PropTypes.bool,
    success: PropTypes.bool,
    warning: PropTypes.bool,
    primary: PropTypes.bool,
    style: PropTypes.object,
  })),
  
  // Styles
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CrudActions;
