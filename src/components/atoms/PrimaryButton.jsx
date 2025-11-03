import { Button as AntButton } from 'antd';
import PropTypes from 'prop-types';

/**
 * PrimaryButton Atom - Botón primario (azul) para acciones principales
 * 
 * @component
 * @example
 * <PrimaryButton onClick={handleSave} loading={saving}>
 *   Guardar
 * </PrimaryButton>
 */
const PrimaryButton = ({ 
  children,
  onClick,
  loading = false,
  disabled = false,
  icon,
  size = 'middle', // 'large' | 'middle' | 'small'
  htmlType = 'button', // 'button' | 'submit' | 'reset'
  block = false,
  danger = false,
  ghost = false,
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <AntButton
      type="primary"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      icon={icon}
      size={size}
      htmlType={htmlType}
      block={block}
      danger={danger}
      ghost={ghost}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </AntButton>
  );
};

PrimaryButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']),
  block: PropTypes.bool,
  danger: PropTypes.bool,
  ghost: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default PrimaryButton;
