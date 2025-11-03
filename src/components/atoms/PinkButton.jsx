import { Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * PinkButton Atom - Botón rosado sólido
 * 
 * Botón especializado con color rosado (#eb2f96).
 * Útil para acciones relacionadas con favoritos, destacados o promociones.
 * 
 * @component
 * @example
 * <PinkButton onClick={handleFavorite}>Favorito</PinkButton>
 * <PinkButton icon={<HeartOutlined />}>Me gusta</PinkButton>
 */
const PinkButton = ({ 
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const pinkStyle = {
    backgroundColor: '#eb2f96',
    borderColor: '#eb2f96',
    color: '#fff',
    ...style
  };

  return (
    <Button 
      type="primary"
      style={pinkStyle}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

PinkButton.propTypes = {
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

export default PinkButton;
