import { Switch as AntSwitch } from 'antd';
import PropTypes from 'prop-types';

/**
 * Switch Atom - Toggle de estado con estilos consistentes
 * 
 * @component
 * @example
 * <Switch 
 *   checked={isActive} 
 *   onChange={handleChange}
 *   checkedChildren="Activo"
 *   unCheckedChildren="Inactivo"
 * />
 */
const Switch = ({ 
  checked,
  defaultChecked,
  disabled = false,
  loading = false,
  size = 'default', // 'default' | 'small'
  checkedChildren,
  unCheckedChildren,
  onChange,
  onClick,
  autoFocus = false,
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <AntSwitch
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      loading={loading}
      size={size}
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      onChange={onChange}
      onClick={onClick}
      autoFocus={autoFocus}
      className={className}
      style={style}
      {...rest}
    />
  );
};

Switch.propTypes = {
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['default', 'small']),
  checkedChildren: PropTypes.node,
  unCheckedChildren: PropTypes.node,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Switch;
