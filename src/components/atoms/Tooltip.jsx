import { Tooltip as AntTooltip } from 'antd';
import PropTypes from 'prop-types';

/**
 * Tooltip Atom - Información contextual al hacer hover
 * 
 * @component
 * @example
 * <Tooltip title="Información adicional">
 *   <Button>Hover me</Button>
 * </Tooltip>
 */
const Tooltip = ({ 
  children,
  title,
  placement = 'top', // 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'
  trigger = 'hover', // 'hover' | 'focus' | 'click' | 'contextMenu'
  color,
  open,
  defaultOpen = false,
  onOpenChange,
  overlayClassName = '',
  overlayStyle = {},
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  arrow = true,
  ...rest 
}) => {
  // Mapear propiedades deprecated a nuevas (Ant Design 5.x)
  const styles = Object.keys(overlayStyle).length > 0 ? { root: overlayStyle } : undefined;
  const classNames = overlayClassName ? { root: overlayClassName } : undefined;

  return (
    <AntTooltip
      title={title}
      placement={placement}
      trigger={trigger}
      color={color}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      styles={styles}
      classNames={classNames}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      arrow={arrow}
      {...rest}
    >
      {children}
    </AntTooltip>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placement: PropTypes.oneOf([
    'top', 'left', 'right', 'bottom',
    'topLeft', 'topRight', 'bottomLeft', 'bottomRight',
    'leftTop', 'leftBottom', 'rightTop', 'rightBottom'
  ]),
  trigger: PropTypes.oneOfType([
    PropTypes.oneOf(['hover', 'focus', 'click', 'contextMenu']),
    PropTypes.arrayOf(PropTypes.oneOf(['hover', 'focus', 'click', 'contextMenu']))
  ]),
  color: PropTypes.string,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  overlayClassName: PropTypes.string,
  overlayStyle: PropTypes.object,
  mouseEnterDelay: PropTypes.number,
  mouseLeaveDelay: PropTypes.number,
  arrow: PropTypes.bool,
};

export default Tooltip;
