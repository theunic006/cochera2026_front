import { Divider as AntDivider } from 'antd';
import PropTypes from 'prop-types';

/**
 * Divider Atom - Línea divisoria para separar secciones
 * 
 * @component
 * @example
 * <Divider />
 * <Divider orientation="left">Sección</Divider>
 */
const Divider = ({ 
  children,
  dashed = false,
  orientation = 'center', // 'left' | 'center' | 'right'
  orientationMargin,
  plain = false,
  type = 'horizontal', // 'horizontal' | 'vertical'
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <AntDivider
      dashed={dashed}
      orientation={orientation}
      orientationMargin={orientationMargin}
      plain={plain}
      type={type}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </AntDivider>
  );
};

Divider.propTypes = {
  children: PropTypes.node,
  dashed: PropTypes.bool,
  orientation: PropTypes.oneOf(['left', 'center', 'right']),
  orientationMargin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  plain: PropTypes.bool,
  type: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Divider;
