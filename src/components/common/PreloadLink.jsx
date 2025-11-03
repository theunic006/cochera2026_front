/**
 * ✅ OPTIMIZACIÓN FASE 2: Link con preload automático
 * Precargar componentes al hacer hover sobre los links
 */

import { Link } from 'react-router-dom';
import { usePreloadRoute } from '../../utils/preloadRoutes';

const PreloadLink = ({ 
  to, 
  preload, 
  routeName, 
  children, 
  onMouseEnter,
  ...props 
}) => {
  const preloadRouteHook = usePreloadRoute();

  const handleMouseEnter = (e) => {
    // Precargar la ruta cuando el usuario hace hover
    if (preload && routeName) {
      preloadRouteHook(preload, routeName)();
    }
    
    // Llamar al handler original si existe
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  return (
    <Link 
      to={to} 
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  );
};

export default PreloadLink;
