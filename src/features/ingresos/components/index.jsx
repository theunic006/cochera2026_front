import React from 'react';
import { ListErrorBoundary, FormErrorBoundary } from '../common/ErrorBoundaries';
import IngresoListComponent from './IngresoList';
import IngresoFormComponent from './IngresoForm';
import IngresoMobileComponent from './IngresoMobile';

// Wrap components with error boundaries
export const IngresoList = (props) => (
  <ListErrorBoundary listName="Ingresos">
    <IngresoListComponent {...props} />
  </ListErrorBoundary>
);

export const IngresoForm = (props) => (
  <FormErrorBoundary formName="Ingreso">
    <IngresoFormComponent {...props} />
  </FormErrorBoundary>
);

export const IngresoMobile = (props) => (
  <ListErrorBoundary listName="Ingresos (Móvil)">
    <IngresoMobileComponent {...props} />
  </ListErrorBoundary>
);

// Export otros servicios sin cambios
export { default as ConsultaSunat } from './consultaSunat';
export { imprimirTicketSunat } from './imprimirTicketSunat';
export { 
  enviarFacturaSunat, 
  construirBodySunat, 
  puedeEmitirFactura, 
  determinarTipoComprobante 
} from './enviarFactura';

// Default export
export default IngresoList;
