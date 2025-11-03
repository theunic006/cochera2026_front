import { Statistic } from 'antd';
import Card from '../atoms/Card';
import PropTypes from 'prop-types';
import { cloneElement } from 'react';

/**
 * StatCard Molecule - Card con estadística integrada
 * 
 * Diseño optimizado para mostrar estadísticas con:
 * - Fondo oscuro semi-transparente
 * - Iconos grandes con colores según tipo
 * - Números destacados
 * - Responsive design
 * 
 * @component
 * @example
 * <StatCard
 *   title="Total Usuarios"
 *   value={150}
 *   prefix={<UserOutlined />}
 *   color="primary"
 * />
 */
const StatCard = ({ 
  title,
  value,
  prefix,
  suffix,
  precision = 0,
  color = 'default', // 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'default'
  loading = false,
  bordered = false,
  hoverable = true,
  extra,
  formatter,
  className = '',
  style = {},
  cardProps = {},
  statisticProps = {},
  ...rest 
}) => {
  // Mapeo de colores para valores y iconos
  const colorMap = {
    primary: '#722ed1',   // Morado
    success: '#52c41a',   // Verde
    danger: '#ff4d4f',    // Rojo
    warning: '#faad14',   // Naranja
    info: '#1890ff',      // Azul
    default: '#858585',   // Gris claro
  };

  const valueColor = colorMap[color] || colorMap.default;

  // Clonar el icono prefix con estilos personalizados
  const styledPrefix = prefix ? cloneElement(prefix, {
    style: {
      fontSize: '24px',
      color: valueColor,
      marginRight: '8px',
      ...prefix.props?.style
    }
  }) : null;

  return (
    <Card
      bordered={bordered}
      hoverable={hoverable}
      loading={loading}
      className={className}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        transition: 'all 0.3s ease',
        ...style
      }}
      {...cardProps}
      {...rest}
    >
      <Statistic
        title={
          <span style={{ 
            color: '#858585', 
            fontSize: '14px',
            fontWeight: 400,
            display: 'block',
            marginBottom: '8px'
          }}>
            {title}
          </span>
        }
        value={value}
        prefix={styledPrefix}
        suffix={suffix}
        precision={precision}
        valueStyle={{ 
          color: valueColor,
          fontSize: '32px',
          fontWeight: 600,
          lineHeight: 1.2,
          ...statisticProps?.valueStyle 
        }}
        formatter={formatter}
        {...statisticProps}
      />
      {extra && <div style={{ marginTop: 16 }}>{extra}</div>}
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  precision: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'success', 'danger', 'warning', 'info', 'default']),
  loading: PropTypes.bool,
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  extra: PropTypes.node,
  formatter: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  cardProps: PropTypes.object,
  statisticProps: PropTypes.object,
};

export default StatCard;

/**
 * Ejemplos de uso:
 * 
 * // Estadística básica
 * <StatCard
 *   title="Total Roles"
 *   value={25}
 *   color="primary"
 * />
 * 
 * // Con icono y color
 * <StatCard
 *   title="Usuarios Activos"
 *   value={150}
 *   prefix={<UserOutlined />}
 *   color="success"
 * />
 * 
 * // Con precisión decimal
 * <StatCard
 *   title="Tasa de Éxito"
 *   value={98.5}
 *   suffix="%"
 *   precision={2}
 *   color="info"
 * />
 * 
 * // Con contenido extra
 * <StatCard
 *   title="Ventas"
 *   value={1250}
 *   prefix="$"
 *   color="success"
 *   extra={<Button>Ver detalles</Button>}
 * />
 */
