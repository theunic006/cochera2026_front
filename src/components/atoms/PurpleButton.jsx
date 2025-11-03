import { Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * PurpleButton Atom - Botón morado sólido
 * 
 * Botón especializado con color morado (#722ed1).
 * Útil para acciones especiales, premium o destacadas.
 * 
 * @component
 * @example
 * <PurpleButton onClick={handlePremium}>Premium</PurpleButton>
 * <PurpleButton icon={<CrownOutlined />} loading={loading}>Upgrade</PurpleButton>
 */
const PurpleButton = ({ 
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const purpleStyle = {
    backgroundColor: '#722ed1',
    borderColor: '#722ed1',
    color: '#fff',
    ...style
  };

  return (
    <Button 
      type="primary"
      style={purpleStyle}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

PurpleButton.propTypes = {
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

export default PurpleButton;
