import React from 'react';
import { Row, Col } from 'antd';
import CardSkeleton from './CardSkeleton';
import './LoadingStates.css';

/**
 * Skeleton loading para Dashboard
 * Muestra estructura completa del dashboard
 */
const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton-container">
      {/* Header del Dashboard */}
      <div className="skeleton-dashboard-header">
        <div className="skeleton-dashboard-title shimmer" />
        <div className="skeleton-dashboard-subtitle shimmer" />
      </div>
      
      {/* Tarjetas de estadísticas */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Col xs={24} sm={12} lg={6} key={`stat-${index}`}>
            <div className="skeleton-stat-card">
              <div className="skeleton-stat-icon shimmer" style={{ animationDelay: `${index * 0.1}s` }} />
              <div className="skeleton-stat-value shimmer" style={{ animationDelay: `${index * 0.1 + 0.1}s` }} />
              <div className="skeleton-stat-label shimmer" style={{ animationDelay: `${index * 0.1 + 0.2}s` }} />
            </div>
          </Col>
        ))}
      </Row>
      
      {/* Gráficos y contenido adicional */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <CardSkeleton lines={5} />
        </Col>
        <Col xs={24} md={12}>
          <CardSkeleton lines={5} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardSkeleton;
