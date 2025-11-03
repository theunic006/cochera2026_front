import { Form } from 'antd';
import Input from '../atoms/Input';
import PropTypes from 'prop-types';

/**
 * FormField Molecule - Campo de formulario con label y validación
 * 
 * @component
 * @example
 * <FormField
 *   label="Nombre"
 *   name="name"
 *   required
 *   placeholder="Ingrese su nombre"
 * />
 */
const FormField = ({ 
  label,
  name,
  required = false,
  message,
  rules = [],
  tooltip,
  help,
  validateStatus, // '' | 'success' | 'warning' | 'error' | 'validating'
  hasFeedback = false,
  extra,
  type = 'text',
  placeholder,
  disabled = false,
  inputProps = {},
  ...rest 
}) => {
  // Construir reglas de validación
  const fieldRules = [
    ...(required ? [{ required: true, message: message || `${label} es requerido` }] : []),
    ...rules
  ];

  // Seleccionar el componente de input apropiado
  const getInputComponent = () => {
    switch (type) {
      case 'textarea':
        return <Input.TextArea placeholder={placeholder} disabled={disabled} {...inputProps} />;
      case 'password':
        return <Input.Password placeholder={placeholder} disabled={disabled} {...inputProps} />;
      default:
        return <Input type={type} placeholder={placeholder} disabled={disabled} {...inputProps} />;
    }
  };

  return (
    <Form.Item
      label={label}
      name={name}
      rules={fieldRules}
      tooltip={tooltip}
      help={help}
      validateStatus={validateStatus}
      hasFeedback={hasFeedback}
      extra={extra}
      {...rest}
    >
      {getInputComponent()}
    </Form.Item>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  required: PropTypes.bool,
  message: PropTypes.string,
  rules: PropTypes.array,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  help: PropTypes.string,
  validateStatus: PropTypes.oneOf(['', 'success', 'warning', 'error', 'validating']),
  hasFeedback: PropTypes.bool,
  extra: PropTypes.node,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'textarea']),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  inputProps: PropTypes.object,
};

export default FormField;
