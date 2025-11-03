import React from 'react';
import { Card } from 'antd';
import './LoadingStates.css';

/**
 * Skeleton loading para formularios
 * Muestra campos de formulario mientras carga
 */
const FormSkeleton = ({ fields = 6 }) => {
  return (
    <Card className="form-skeleton-container">
      {/* Título del formulario */}
      <div className="skeleton-form-title shimmer" />
      
      {/* Campos del formulario */}
      {Array.from({ length: fields }).map((_, index) => (
        <div key={`field-${index}`} className="skeleton-form-field">
          <div className="skeleton-label shimmer" />
          <div 
            className="skeleton-input shimmer"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        </div>
      ))}
      
      {/* Botones */}
      <div className="skeleton-form-actions">
        <div className="skeleton-button shimmer" style={{ animationDelay: '0.6s' }} />
        <div className="skeleton-button shimmer" style={{ animationDelay: '0.7s' }} />
      </div>
    </Card>
  );
};

export default FormSkeleton;
