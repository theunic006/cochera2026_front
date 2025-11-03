import Badge from '../atoms/Badge';
import PropTypes from 'prop-types';

/**
 * StatusBadge Molecule - Badge con colores predefinidos según estado
 * 
 * @component
 * @example
 * <StatusBadge status="active" text="Activo" />
 * <StatusBadge status="inactive" text="Inactivo" />
 */
const StatusBadge = ({ 
  status = 'default',
  text,
  customColor,
  dot = false,
  className = '',
  style = {},
  ...rest 
}) => {
  // Mapeo de estados a colores
  const statusColorMap = {
    active: 'success',      // Verde
    inactive: 'default',    // Gris
    pending: 'processing',  // Azul
    warning: 'warning',     // Naranja
    error: 'error',         // Rojo
    success: 'success',     // Verde
    default: 'default',     // Gris
  };

  // Mapeo de estados a textos en español (si no se proporciona texto)
  const statusTextMap = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    warning: 'Advertencia',
    error: 'Error',
    success: 'Exitoso',
    default: 'Por defecto',
  };

  const badgeColor = customColor || statusColorMap[status] || 'default';
  const badgeText = text || statusTextMap[status] || status;

  return (
    <Badge
      status={badgeColor}
      text={badgeText}
      dot={dot}
      className={className}
      style={style}
      {...rest}
    />
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'active', 
    'inactive', 
    'pending', 
    'warning', 
    'error', 
    'success', 
    'default'
  ]),
  text: PropTypes.string,
  customColor: PropTypes.string,
  dot: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default StatusBadge;

/**
 * Ejemplos de uso:
 * 
 * <StatusBadge status="active" />           → Badge verde "Activo"
 * <StatusBadge status="inactive" />         → Badge gris "Inactivo"
 * <StatusBadge status="pending" />          → Badge azul "Pendiente"
 * <StatusBadge status="warning" />          → Badge naranja "Advertencia"
 * <StatusBadge status="error" />            → Badge rojo "Error"
 * <StatusBadge status="active" text="En línea" /> → Badge verde con texto custom
 */
