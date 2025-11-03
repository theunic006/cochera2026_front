import { Badge as AntBadge } from 'antd';
import PropTypes from 'prop-types';

/**
 * Badge Atom - Componente para mostrar badges de estado
 * 
 * @component
 * @example
 * <Badge count={5} />
 * <Badge status="success" text="Activo" />
 */
const Badge = ({ 
  count,
  showZero = false,
  overflowCount = 99,
  dot = false,
  status, // 'success' | 'processing' | 'default' | 'error' | 'warning'
  text,
  color,
  offset,
  size = 'default',
  title,
  children,
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <AntBadge
      count={count}
      showZero={showZero}
      overflowCount={overflowCount}
      dot={dot}
      status={status}
      text={text}
      color={color}
      offset={offset}
      size={size}
      title={title}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </AntBadge>
  );
};

Badge.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.node]),
  showZero: PropTypes.bool,
  overflowCount: PropTypes.number,
  dot: PropTypes.bool,
  status: PropTypes.oneOf(['success', 'processing', 'default', 'error', 'warning']),
  text: PropTypes.string,
  color: PropTypes.string,
  offset: PropTypes.array,
  size: PropTypes.oneOf(['default', 'small']),
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Badge;
