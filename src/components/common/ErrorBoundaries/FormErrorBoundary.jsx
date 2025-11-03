import React from 'react';
import BaseErrorBoundary from './BaseErrorBoundary';

/**
 * Error Boundary para Formularios
 * Maneja errores específicos de formularios
 */
const FormErrorBoundary = ({ children, formName = 'formulario' }) => {
  const handleError = (error, errorInfo) => {
    console.error(`❌ Error en ${formName}:`, error);
    
    // Aquí puedes enviar a servicio de logging con contexto del formulario
    // Ejemplo: Sentry.captureException(error, { tags: { form: formName } });
  };

  const handleReset = () => {
    console.log(`🔄 Reseteando ${formName}`);
    // Limpiar datos del formulario si es necesario
  };

  return (
    <BaseErrorBoundary
      title="Error en el Formulario"
      subtitle={`Ocurrió un problema con ${formName}. Por favor, recarga e intenta de nuevo.`}
      onError={handleError}
      onReset={handleReset}
      showHomeButton={true}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default FormErrorBoundary;
