import { Button as AntButton } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * SuccessButton Atom - Botón de éxito (verde) para acciones positivas
 * 
 * @component
 * @example
 * <SuccessButton onClick={handleApprove}>
 *   Aprobar
 * </SuccessButton>
 */
const SuccessButton = ({ 
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
  const defaultIcon = showIcon && !icon ? <CheckCircleOutlined /> : icon;

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
        backgroundColor: ghost ? 'transparent' : '#52c41a',
        borderColor: '#52c41a',
        color: ghost ? '#52c41a' : '#fff',
        ...style
      }}
      {...rest}
    >
      {children}
    </AntButton>
  );
};

SuccessButton.propTypes = {
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

export default SuccessButton;
