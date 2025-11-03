import React from 'react';
import { Card } from 'antd';
import './LoadingStates.css';

/**
 * Skeleton loading para tarjetas
 * Usado en Dashboard y vistas de grid
 */
const CardSkeleton = ({ hasImage = false, lines = 3 }) => {
  return (
    <Card className="card-skeleton-container">
      {/* Imagen opcional */}
      {hasImage && (
        <div className="skeleton-card-image shimmer" />
      )}
      
      {/* Título */}
      <div className="skeleton-card-title shimmer" />
      
      {/* Líneas de contenido */}
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={`line-${index}`} 
          className="skeleton-card-line shimmer"
          style={{ 
            width: index === lines - 1 ? '60%' : '100%',
            animationDelay: `${index * 0.1}s` 
          }}
        />
      ))}
      
      {/* Footer con acciones */}
      <div className="skeleton-card-footer">
        <div className="skeleton-card-action shimmer" />
        <div className="skeleton-card-action shimmer" style={{ animationDelay: '0.2s' }} />
      </div>
    </Card>
  );
};

export default CardSkeleton;
