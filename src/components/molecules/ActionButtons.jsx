import { Space } from 'antd';
import PrimaryButton from '../atoms/PrimaryButton';
import DangerButton from '../atoms/DangerButton';
import DefaultButton from '../atoms/DefaultButton';
import SuccessButton from '../atoms/SuccessButton';
import WarningButton from '../atoms/WarningButton';
import PurpleButton from '../atoms/PurpleButton';
import PinkButton from '../atoms/PinkButton';
import CyanButton from '../atoms/CyanButton';
import YellowButton from '../atoms/YellowButton';
import MagentaButton from '../atoms/MagentaButton';
import DarkGreenButton from '../atoms/DarkGreenButton';
import IndigoButton from '../atoms/IndigoButton';
import Tooltip from '../atoms/Tooltip';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * ActionButtons Molecule - Botones de acción (Editar/Eliminar) agrupados
 * Soporta acciones extra con 12 colores de botones disponibles
 * 
 * @component
 * @example
 * // Uso básico
 * <ActionButtons
 *   onEdit={() => handleEdit(record)}
 *   onDelete={() => handleDelete(record)}
 * />
 * 
 * @example
 * // Con acciones extra de colores
 * <ActionButtons
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   extraActions={[
 *     {
 *       icon: <StarOutlined />,
 *       onClick: handleFavorite,
 *       tooltip: 'Marcar favorito',
 *       color: 'purple'
 *     },
 *     {
 *       icon: <HeartOutlined />,
 *       onClick: handleLike,
 *       tooltip: 'Me gusta',
 *       color: 'pink'
 *     },
 *     {
 *       icon: <CheckCircleOutlined />,
 *       onClick: handleActivate,
 *       tooltip: 'Activar',
 *       color: 'darkGreen'
 *     }
 *   ]}
 * />
 * 
 * Colores disponibles:
 * - default (gris), primary (azul), success (verde), warning (naranja), danger (rojo)
 * - purple (morado), pink (rosado), cyan (cian), yellow (amarillo)
 * - magenta (fucsia), darkGreen (verde oscuro), indigo (índigo)
 */
const ActionButtons = ({ 
  onEdit,
  onDelete,
  editTooltip = 'Editar',
  deleteTooltip = 'Eliminar',
  editDisabled = false,
  deleteDisabled = false,
  editLoading = false,
  deleteLoading = false,
  showEdit = true,
  showDelete = true,
  size = 'small',
  extraActions = [],
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <Space size="small" className={className} style={style} {...rest}>
      {/* Botón Editar - Usa PrimaryButton atom */}
      {showEdit && (
        <Tooltip title={editTooltip}>
          <PrimaryButton
            type="link"
            size={size}
            icon={<EditOutlined />}
            onClick={onEdit}
            disabled={editDisabled}
            loading={editLoading}
            style={{ padding: '4px 8px' }}
          />
        </Tooltip>
      )}

      {/* Botón Eliminar - Usa DangerButton atom */}
      {showDelete && (
        <Tooltip title={deleteTooltip}>
          <DangerButton
            type="link"
            size={size}
            icon={<DeleteOutlined />}
            onClick={onDelete}
            disabled={deleteDisabled}
            loading={deleteLoading}
            style={{ padding: '4px 8px' }}
          />
        </Tooltip>
      )}

      {/* Acciones extra - Soporta todos los botones de colores */}
      {extraActions.map((action, index) => {
        // Seleccionar el componente de botón según el color
        let ButtonComponent = DefaultButton;
        
        switch(action.color) {
          case 'primary':
            ButtonComponent = PrimaryButton;
            break;
          case 'success':
            ButtonComponent = SuccessButton;
            break;
          case 'warning':
            ButtonComponent = WarningButton;
            break;
          case 'danger':
            ButtonComponent = DangerButton;
            break;
          case 'purple':
            ButtonComponent = PurpleButton;
            break;
          case 'pink':
            ButtonComponent = PinkButton;
            break;
          case 'cyan':
            ButtonComponent = CyanButton;
            break;
          case 'yellow':
            ButtonComponent = YellowButton;
            break;
          case 'magenta':
            ButtonComponent = MagentaButton;
            break;
          case 'darkGreen':
            ButtonComponent = DarkGreenButton;
            break;
          case 'indigo':
            ButtonComponent = IndigoButton;
            break;
          default:
            ButtonComponent = DefaultButton;
        }

        return (
          <Tooltip key={index} title={action.tooltip || ''}>
            <ButtonComponent
              type="link"
              size={size}
              icon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
              loading={action.loading}
              style={{ padding: '4px 8px', ...action.style }}
            />
          </Tooltip>
        );
      })}
    </Space>
  );
};

ActionButtons.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  editTooltip: PropTypes.string,
  deleteTooltip: PropTypes.string,
  editDisabled: PropTypes.bool,
  deleteDisabled: PropTypes.bool,
  editLoading: PropTypes.bool,
  deleteLoading: PropTypes.bool,
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  extraActions: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.node,
    onClick: PropTypes.func,
    tooltip: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    color: PropTypes.oneOf([
      'default', 'primary', 'success', 'warning', 'danger',
      'purple', 'pink', 'cyan', 'yellow', 'magenta', 'darkGreen', 'indigo'
    ]),
    style: PropTypes.object,
  })),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ActionButtons;
