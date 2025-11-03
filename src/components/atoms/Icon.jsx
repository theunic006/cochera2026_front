import * as AntIcons from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Icon Atom - Wrapper unificado para todos los iconos de Ant Design
 * 
 * @component
 * @example
 * <Icon name="UserOutlined" style={{ fontSize: 20 }} />
 * <Icon name="DeleteOutlined" style={{ color: 'red' }} />
 */
const Icon = ({ 
  name, 
  style = {}, 
  className = '',
  onClick,
  ...rest 
}) => {
  // Obtener el componente del icono dinámicamente
  const IconComponent = AntIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" no encontrado en @ant-design/icons`);
    return null;
  }

  return (
    <IconComponent 
      style={style} 
      className={className}
      onClick={onClick}
      {...rest}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Icon;

/**
 * Iconos más usados (para referencia):
 * 
 * - UserOutlined
 * - EditOutlined
 * - DeleteOutlined
 * - PlusOutlined
 * - SearchOutlined
 * - CloseOutlined
 * - CheckOutlined
 * - WarningOutlined
 * - InfoCircleOutlined
 * - SettingOutlined
 * - HomeOutlined
 * - FileOutlined
 * - FolderOutlined
 * - DownloadOutlined
 * - UploadOutlined
 * - EyeOutlined
 * - EyeInvisibleOutlined
 * - LockOutlined
 * - UnlockOutlined
 * - CarOutlined
 * - DashboardOutlined
 * - TeamOutlined
 * - CalendarOutlined
 */
