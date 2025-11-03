import { Input as AntInput } from 'antd';
import PropTypes from 'prop-types';

/**
 * Input Atom - Wrapper de Ant Design Input con validaciones
 * 
 * @component
 * @example
 * <Input 
 *   placeholder="Ingrese texto" 
 *   value={value}
 *   onChange={handleChange}
 * />
 */
const Input = ({ 
  value,
  defaultValue,
  placeholder = '',
  type = 'text',
  size = 'middle',
  disabled = false,
  allowClear = false,
  prefix,
  suffix,
  maxLength,
  showCount = false,
  onChange,
  onPressEnter,
  onBlur,
  onFocus,
  className = '',
  style = {},
  status, // '' | 'error' | 'warning'
  ...rest 
}) => {
  return (
    <AntInput
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      type={type}
      size={size}
      disabled={disabled}
      allowClear={allowClear}
      prefix={prefix}
      suffix={suffix}
      maxLength={maxLength}
      showCount={showCount}
      onChange={onChange}
      onPressEnter={onPressEnter}
      onBlur={onBlur}
      onFocus={onFocus}
      className={className}
      style={style}
      status={status}
      {...rest}
    />
  );
};

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  maxLength: PropTypes.number,
  showCount: PropTypes.bool,
  onChange: PropTypes.func,
  onPressEnter: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  status: PropTypes.oneOf(['', 'error', 'warning']),
};

// Sub-componentes
Input.TextArea = AntInput.TextArea;
Input.Search = AntInput.Search;
Input.Password = AntInput.Password;

export default Input;
