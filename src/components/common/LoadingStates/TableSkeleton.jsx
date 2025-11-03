import React from 'react';
import { Card } from 'antd';
import './LoadingStates.css';

/**
 * Skeleton loading para tablas
 * Muestra líneas animadas mientras carga la tabla
 */
const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Card className="table-skeleton-container">
      {/* Header de la tabla */}
      <div className="skeleton-table-header">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={`header-${colIndex}`} className="skeleton-cell skeleton-header shimmer" />
        ))}
      </div>
      
      {/* Filas de la tabla */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={`cell-${rowIndex}-${colIndex}`} 
              className="skeleton-cell shimmer"
              style={{ 
                animationDelay: `${(rowIndex * 0.1) + (colIndex * 0.05)}s` 
              }}
            />
          ))}
        </div>
      ))}
    </Card>
  );
};

export default TableSkeleton;
