import { Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * MagentaButton Atom - Botón magenta sólido
 * 
 * Botón especializado con color magenta (#c41d7f).
 * Útil para acciones creativas, destacados especiales o funciones premium.
 * 
 * @component
 * @example
 * <MagentaButton onClick={handleSpecial}>Especial</MagentaButton>
 * <MagentaButton icon={<StarFilled />}>Premium</MagentaButton>
 */
const MagentaButton = ({ 
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const magentaStyle = {
    backgroundColor: '#c41d7f',
    borderColor: '#c41d7f',
    color: '#fff',
    ...style
  };

  return (
    <Button 
      type="primary"
      style={magentaStyle}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

MagentaButton.propTypes = {
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

export default MagentaButton;
