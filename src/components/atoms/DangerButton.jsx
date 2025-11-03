import { Button as AntButton } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * DangerButton Atom - Botón de peligro (rojo) para acciones destructivas
 * 
 * @component
 * @example
 * <DangerButton onClick={handleDelete}>
 *   Eliminar
 * </DangerButton>
 */
const DangerButton = ({ 
  children,
  onClick,
  loading = false,
  disabled = false,
  icon,
  showIcon = false,
  size = 'middle',
  htmlType = 'button',
  block = false,
  ghost = false,
  className = '',
  style = {},
  ...rest 
}) => {
  const defaultIcon = showIcon && !icon ? <DeleteOutlined /> : icon;

  return (
    <AntButton
      type="primary"
      danger
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      icon={defaultIcon}
      size={size}
      htmlType={htmlType}
      block={block}
      ghost={ghost}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </AntButton>
  );
};

DangerButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  showIcon: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']),
  block: PropTypes.bool,
  ghost: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default DangerButton;
