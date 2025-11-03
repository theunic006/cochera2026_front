import { Tag as AntTag } from 'antd';
import PropTypes from 'prop-types';

/**
 * Tag Atom - Componente para etiquetas de categorización
 * 
 * @component
 * @example
 * <Tag color="blue">Activo</Tag>
 * <Tag color="red" closable onClose={handleClose}>Inactivo</Tag>
 */
const Tag = ({ 
  children,
  color,
  closable = false,
  closeIcon,
  onClose,
  icon,
  bordered = true,
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <AntTag
      color={color}
      closable={closable}
      closeIcon={closeIcon}
      onClose={onClose}
      icon={icon}
      bordered={bordered}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </AntTag>
  );
};

Tag.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  closable: PropTypes.bool,
  closeIcon: PropTypes.node,
  onClose: PropTypes.func,
  icon: PropTypes.node,
  bordered: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

// Sub-componente CheckableTag
Tag.CheckableTag = AntTag.CheckableTag;

export default Tag;

/**
 * Colores predefinidos:
 * - success / green
 * - processing / blue
 * - error / red
 * - warning / orange
 * - default / gray
 * - magenta, purple, cyan, geekblue, lime, gold, volcano
 */
