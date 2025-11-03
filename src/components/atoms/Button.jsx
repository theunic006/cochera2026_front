import { Button as AntButton } from 'antd';
import PropTypes from 'prop-types';

/**
 * Button Atom - Wrapper de Ant Design Button con estilos consistentes
 * 
 * @component
 * @example
 * <Button type="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 */
const Button = ({ 
  children, 
  type = 'default', 
  size = 'middle', 
  loading = false,
  disabled = false,
  danger = false,
  ghost = false,
  icon,
  block = false,
  htmlType = 'button',
  onClick,
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <AntButton
      type={type}
      size={size}
      loading={loading}
      disabled={disabled}
      danger={danger}
      ghost={ghost}
      icon={icon}
      block={block}
      htmlType={htmlType}
      onClick={onClick}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </AntButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['primary', 'default', 'dashed', 'text', 'link']),
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  danger: PropTypes.bool,
  ghost: PropTypes.bool,
  icon: PropTypes.node,
  block: PropTypes.bool,
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Button;
