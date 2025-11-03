import React from 'react';
import BaseErrorBoundary from './BaseErrorBoundary';

/**
 * Error Boundary para Listas
 * Maneja errores específicos de componentes de lista
 */
const ListErrorBoundary = ({ children, listName = 'lista' }) => {
  const handleError = (error, errorInfo) => {
    console.error(`❌ Error en ${listName}:`, error);
    // Aquí puedes enviar a servicio de logging
  };

  const handleReset = () => {
    // Lógica específica de reset para listas
    console.log(`🔄 Reseteando ${listName}`);
  };

  return (
    <BaseErrorBoundary
      title="Error al Cargar la Lista"
      subtitle={`No se pudo cargar ${listName}. Por favor, intenta nuevamente.`}
      onError={handleError}
      onReset={handleReset}
      showHomeButton={false}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default ListErrorBoundary;
