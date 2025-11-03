import { Button as AntButton } from 'antd';
import PropTypes from 'prop-types';

/**
 * DefaultButton Atom - Botón por defecto (gris) para acciones secundarias
 * 
 * @component
 * @example
 * <DefaultButton onClick={handleCancel}>
 *   Cancelar
 * </DefaultButton>
 */
const DefaultButton = ({ 
  children,
  onClick,
  loading = false,
  disabled = false,
  icon,
  size = 'middle',
  htmlType = 'button',
  block = false,
  ghost = false,
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <AntButton
      type="default"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      icon={icon}
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

DefaultButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']),
  block: PropTypes.bool,
  ghost: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default DefaultButton;
