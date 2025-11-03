import { Empty } from 'antd';
import Icon from '../atoms/Icon';
import PropTypes from 'prop-types';

/**
 * EmptyState Molecule - Estado vacío con icono, título y descripción
 * 
 * @component
 * @example
 * <EmptyState
 *   icon="InboxOutlined"
 *   title="No hay datos"
 *   description="No se encontraron resultados"
 * />
 */
const EmptyState = ({ 
  icon,
  iconName = 'InboxOutlined',
  title = 'No hay datos',
  description,
  image,
  imageStyle,
  children,
  className = '',
  style = {},
  ...rest 
}) => {
  // Si se proporciona una imagen personalizada, úsala
  if (image) {
    return (
      <Empty
        image={image}
        imageStyle={imageStyle}
        description={
          <div>
            {title && <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{title}</div>}
            {description && <div style={{ color: '#999' }}>{description}</div>}
          </div>
        }
        className={className}
        style={style}
        {...rest}
      >
        {children}
      </Empty>
    );
  }

  // Estado vacío con icono
  return (
    <div 
      className={className}
      style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        ...style 
      }}
      {...rest}
    >
      {icon || <Icon name={iconName} style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />}
      
      {title && (
        <div style={{ 
          fontSize: 16, 
          fontWeight: 500, 
          color: '#595959',
          marginBottom: 8 
        }}>
          {title}
        </div>
      )}
      
      {description && (
        <div style={{ 
          fontSize: 14, 
          color: '#999',
          marginBottom: children ? 16 : 0 
        }}>
          {description}
        </div>
      )}
      
      {children}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  iconName: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.node,
  imageStyle: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default EmptyState;
