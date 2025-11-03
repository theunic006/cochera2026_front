import { Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * IndigoButton Atom - Botón índigo sólido
 * 
 * Botón especializado con color índigo (#2f54eb).
 * Útil para acciones profesionales, enlaces importantes o funciones especiales.
 * 
 * @component
 * @example
 * <IndigoButton onClick={handleAction}>Acción</IndigoButton>
 * <IndigoButton icon={<ThunderboltOutlined />}>Ejecutar</IndigoButton>
 */
const IndigoButton = ({ 
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const indigoStyle = {
    backgroundColor: '#2f54eb',
    borderColor: '#2f54eb',
    color: '#fff',
    ...style
  };

  return (
    <Button 
      type="primary"
      style={indigoStyle}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

IndigoButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']),
  style: PropTypes.object,
  className: PropTypes.string,
};

export default IndigoButton;
