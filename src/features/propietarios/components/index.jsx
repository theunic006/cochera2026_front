import React from 'react';
import { ListErrorBoundary, FormErrorBoundary } from '../common/ErrorBoundaries';
import OwnerListComponent from './OwnerList';
import OwnerFormComponent from './OwnerForm';
import OwnerVehiclesModalComponent from './OwnerVehiclesModal';

// Wrap components with error boundaries
export const OwnerList = (props) => (
  <ListErrorBoundary listName="Propietarios">
    <OwnerListComponent {...props} />
  </ListErrorBoundary>
);

export const OwnerForm = (props) => (
  <FormErrorBoundary formName="Propietario">
    <OwnerFormComponent {...props} />
  </FormErrorBoundary>
);

export const OwnerVehiclesModal = (props) => (
  <ListErrorBoundary listName="Vehículos del Propietario">
    <OwnerVehiclesModalComponent {...props} />
  </ListErrorBoundary>
);

export default OwnerList;
