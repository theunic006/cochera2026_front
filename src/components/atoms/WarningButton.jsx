import { Button as AntButton } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * WarningButton Atom - Botón de advertencia (naranja) para acciones que requieren atención
 * 
 * @component
 * @example
 * <WarningButton onClick={handleWarning}>
 *   Advertir
 * </WarningButton>
 */
const WarningButton = ({ 
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
  const defaultIcon = showIcon && !icon ? <WarningOutlined /> : icon;

  return (
    <AntButton
      type="primary"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      icon={defaultIcon}
      size={size}
      htmlType={htmlType}
      block={block}
      ghost={ghost}
      className={className}
      style={{
        backgroundColor: ghost ? 'transparent' : '#faad14',
        borderColor: '#faad14',
        color: ghost ? '#faad14' : '#fff',
        ...style
      }}
      {...rest}
    >
      {children}
    </AntButton>
  );
};

WarningButton.propTypes = {
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

export default WarningButton;
