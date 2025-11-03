import { Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * YellowButton Atom - Botón amarillo sólido
 * 
 * Botón especializado con color amarillo dorado (#faad14).
 * Útil para destacar, promociones especiales o acciones importantes.
 * Nota: Usa texto oscuro para mejor contraste.
 * 
 * @component
 * @example
 * <YellowButton onClick={handlePromo}>Promoción</YellowButton>
 * <YellowButton icon={<StarOutlined />}>Destacar</YellowButton>
 */
const YellowButton = ({ 
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const yellowStyle = {
    backgroundColor: '#faad14',
    borderColor: '#faad14',
    color: '#000',
    ...style
  };

  return (
    <Button 
      type="primary"
      style={yellowStyle}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

YellowButton.propTypes = {
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

export default YellowButton;
