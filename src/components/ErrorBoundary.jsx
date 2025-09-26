import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Ha ocurrido un error"
          subTitle="La aplicación ha encontrado un error inesperado. Por favor, recarga la página."
          extra={
            <Button 
              type="primary" 
              onClick={() => window.location.reload()}
            >
              Recargar Página
            </Button>
          }
        >
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div style={{ 
              textAlign: 'left', 
              backgroundColor: '#f5f5f5', 
              padding: '16px', 
              borderRadius: '4px',
              marginTop: '16px',
              overflow: 'auto'
            }}>
              <h4>Detalles del error (solo en desarrollo):</h4>
              <pre style={{ fontSize: '12px' }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </Result>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;