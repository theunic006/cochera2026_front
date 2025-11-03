import { Card as AntCard } from 'antd';
import PropTypes from 'prop-types';

/**
 * Card Atom - Wrapper de Ant Design Card con estilos consistentes
 * 
 * @component
 * @example
 * <Card title="Título" bordered hoverable>
 *   Contenido de la tarjeta
 * </Card>
 */
const Card = ({ 
  children,
  title,
  extra,
  bordered = true,
  hoverable = false,
  loading = false,
  size = 'default', // 'default' | 'small'
  type, // 'inner'
  cover,
  actions,
  bodyStyle = {},
  headStyle = {},
  className = '',
  style = {},
  ...rest 
}) => {
  // Mapear propiedades deprecated a nuevas
  const variant = bordered ? 'outlined' : 'borderless';
  const styles = {
    ...(Object.keys(bodyStyle).length > 0 && { body: bodyStyle }),
    ...(Object.keys(headStyle).length > 0 && { header: headStyle })
  };

  return (
    <AntCard
      title={title}
      extra={extra}
      variant={variant}
      hoverable={hoverable}
      loading={loading}
      size={size}
      type={type}
      cover={cover}
      actions={actions}
      styles={Object.keys(styles).length > 0 ? styles : undefined}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </AntCard>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  extra: PropTypes.node,
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['default', 'small']),
  type: PropTypes.oneOf(['inner']),
  cover: PropTypes.node,
  actions: PropTypes.arrayOf(PropTypes.node),
  bodyStyle: PropTypes.object,
  headStyle: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};

// Sub-componentes
Card.Grid = AntCard.Grid;
Card.Meta = AntCard.Meta;

export default Card;
