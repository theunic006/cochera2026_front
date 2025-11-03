import { Breadcrumb } from 'antd';
import Button from '../atoms/Button';
import Divider from '../atoms/Divider';
import PropTypes from 'prop-types';

/**
 * PageHeader Molecule - Encabezado de página con título, breadcrumb y acciones
 * 
 * @component
 * @example
 * <PageHeader
 *   title="Gestión de Roles"
 *   breadcrumbItems={[{ title: 'Inicio' }, { title: 'Roles' }]}
 *   actions={<Button type="primary">Crear Rol</Button>}
 * />
 */
const PageHeader = ({ 
  title,
  subtitle,
  breadcrumbItems = [],
  actions,
  extra,
  showDivider = true,
  className = '',
  style = {},
  ...rest 
}) => {
  return (
    <div 
      className={className}
      style={{ marginBottom: 24, ...style }}
      {...rest}
    >
      {/* Breadcrumb */}
      {breadcrumbItems.length > 0 && (
        <Breadcrumb 
          items={breadcrumbItems}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Header con título y acciones */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: showDivider ? 16 : 0
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: 24, 
            fontWeight: 600,
            marginBottom: subtitle ? 8 : 0
          }}>
            {title}
          </h1>
          {subtitle && (
            <div style={{ 
              fontSize: 14, 
              color: '#8c8c8c',
              marginTop: 4
            }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Acciones */}
        {actions && (
          <div style={{ 
            display: 'flex', 
            gap: 8, 
            alignItems: 'center' 
          }}>
            {actions}
          </div>
        )}
      </div>

      {/* Extra content */}
      {extra && (
        <div style={{ marginTop: 16 }}>
          {extra}
        </div>
      )}

      {/* Divider */}
      {showDivider && <Divider style={{ margin: '0 0 24px 0' }} />}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  breadcrumbItems: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    href: PropTypes.string,
    onClick: PropTypes.func,
  })),
  actions: PropTypes.node,
  extra: PropTypes.node,
  showDivider: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default PageHeader;
