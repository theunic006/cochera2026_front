/**
 * ✅ OPTIMIZACIÓN FASE 2: Sistema de preload y cache de rutas
 * Precargar componentes lazy para navegación instantánea
 */

// Cache de componentes precargados
const routeCache = new Map();

/**
 * Precargar un componente lazy
 */
export const preloadRoute = (importFunction, routeName) => {
  if (routeCache.has(routeName)) {
    return routeCache.get(routeName);
  }

  const promise = importFunction();
  routeCache.set(routeName, promise);
  
  console.log(`✅ Precargando ruta: ${routeName}`);
  return promise;
};

/**
 * Verificar si una ruta ya está en cache
 */
export const isRouteCached = (routeName) => {
  return routeCache.has(routeName);
};

/**
 * Limpiar cache de rutas (útil para logout o cambio de permisos)
 */
export const clearRouteCache = () => {
  routeCache.clear();
  console.log('🗑️ Cache de rutas limpiado');
};

/**
 * Precargar múltiples rutas en paralelo
 */
export const preloadMultipleRoutes = (routes) => {
  return Promise.all(
    routes.map(({ importFunction, routeName }) => 
      preloadRoute(importFunction, routeName)
    )
  );
};

/**
 * Hook para precargar ruta on hover
 */
export const usePreloadRoute = () => {
  return (importFunction, routeName) => {
    return () => preloadRoute(importFunction, routeName);
  };
};
