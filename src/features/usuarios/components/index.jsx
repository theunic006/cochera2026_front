import React from 'react';
import { ListErrorBoundary, FormErrorBoundary } from '../common/ErrorBoundaries';
import UserListComponent from './UserList';
import UserFormComponent from './UserForm';
import PermissionsModalComponent from './PermissionsModal';

// Wrap components with error boundaries
export const UserList = (props) => (
  <ListErrorBoundary listName="Usuarios">
    <UserListComponent {...props} />
  </ListErrorBoundary>
);

export const UserForm = (props) => (
  <FormErrorBoundary formName="Usuario">
    <UserFormComponent {...props} />
  </FormErrorBoundary>
);

export const PermissionsModal = PermissionsModalComponent;

// Default export
export default UserList;