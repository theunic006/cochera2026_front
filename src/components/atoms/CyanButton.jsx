import { Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * CyanButton Atom - Botón cian sólido
 * 
 * Botón especializado con color cian (#13c2c2).
 * Útil para acciones relacionadas con información, enlaces o visualización.
 * 
 * @component
 * @example
 * <CyanButton onClick={handleInfo}>Info</CyanButton>
 * <CyanButton icon={<InfoCircleOutlined />}>Ver detalles</CyanButton>
 */
const CyanButton = ({ 
  children, 
  style = {}, 
  className = '',
  ...props 
}) => {
  const cyanStyle = {
    backgroundColor: '#13c2c2',
    borderColor: '#13c2c2',
    color: '#fff',
    ...style
  };

  return (
    <Button 
      type="primary"
      style={cyanStyle}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

CyanButton.propTypes = {
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

export default CyanButton;
