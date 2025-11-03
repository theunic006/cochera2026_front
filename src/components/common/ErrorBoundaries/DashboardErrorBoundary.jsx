import React from 'react';
import BaseErrorBoundary from './BaseErrorBoundary';

/**
 * Error Boundary para Dashboard
 * Maneja errores en el dashboard principal
 */
const DashboardErrorBoundary = ({ children }) => {
  const handleError = (error, errorInfo) => {
    console.error('❌ Error en Dashboard:', error);
    
    // Log adicional para errores críticos del dashboard
    if (process.env.NODE_ENV === 'production') {
      // Enviar a servicio de monitoreo
      // Sentry.captureException(error, { 
      //   tags: { section: 'dashboard' },
      //   extra: errorInfo 
      // });
    }
  };

  return (
    <BaseErrorBoundary
      title="Error en el Dashboard"
      subtitle="No se pudo cargar el panel de control. Intenta recargar la página."
      onError={handleError}
      showHomeButton={false}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default DashboardErrorBoundary;
