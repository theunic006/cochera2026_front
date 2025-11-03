import React from 'react';
import { ListErrorBoundary, FormErrorBoundary } from '../common/ErrorBoundaries';
import VehicleListComponent from './VehicleListSimple';
import VehicleFormComponent from './VehicleFormSimple';
import VehicleOwnersModalComponent from './VehicleOwnersModal';

// Wrap components with error boundaries
export const VehicleList = (props) => (
  <ListErrorBoundary listName="Vehículos">
    <VehicleListComponent {...props} />
  </ListErrorBoundary>
);

export const VehicleForm = (props) => (
  <FormErrorBoundary formName="Vehículo">
    <VehicleFormComponent {...props} />
  </FormErrorBoundary>
);

export const VehicleOwnersModal = (props) => (
  <ListErrorBoundary listName="Propietarios del Vehículo">
    <VehicleOwnersModalComponent {...props} />
  </ListErrorBoundary>
);

// ✅ OPTIMIZACIÓN: Exportar células memoizadas
export * from './VehicleTableCells';

export default VehicleList;