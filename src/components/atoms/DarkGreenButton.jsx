import { Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * DarkGreenButton Atom - Botón verde oscuro sólido
 * 
 * Botón especializado con color verde oscuro (#389e0d).
 * Útil para confirmaciones importantes, acciones exitosas o estados activos.
 * 
 * @component
 * @example
 * <DarkGreenButton onClick={handleConfirm}>Confirmar</DarkGreenButton>
 * <DarkGreenButton icon={<CheckCircleOutlined />}>Activar</DarkGreenButton>
 */
const DarkGreenButton = ({ 
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const darkGreenStyle = {
    backgroundColor: '#389e0d',
    borderColor: '#389e0d',
    color: '#fff',
    ...style
  };

  return (
    <Button 
      type="primary"
      style={darkGreenStyle}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

DarkGreenButton.propTypes = {
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

export default DarkGreenButton;
