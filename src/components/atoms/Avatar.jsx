
import { Avatar as AntAvatar } from 'antd';
import PropTypes from 'prop-types';

/**
 * Avatar Atom - Componente para avatares de usuario
 * 
 * @component
 * @example
 * <Avatar src="https://..." />
 * <Avatar icon={<UserOutlined />} />
 * <Avatar>JD</Avatar>
 */
const Avatar = ({ 
  src,
  icon,
  alt,
  size = 'default', // number | 'large' | 'small' | 'default'
  shape = 'circle', // 'circle' | 'square'
  gap,
  children,
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <AntAvatar
      src={src}
      icon={icon}
      alt={alt}
      size={size}
      shape={shape}
      gap={gap}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </AntAvatar>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  icon: PropTypes.node,
  alt: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['large', 'small', 'default'])
  ]),
  shape: PropTypes.oneOf(['circle', 'square']),
  gap: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

// Sub-componente
Avatar.Group = AntAvatar.Group;

export default Avatar;
