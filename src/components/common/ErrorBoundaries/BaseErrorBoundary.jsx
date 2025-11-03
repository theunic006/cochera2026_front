import React from 'react';
import { Result, Button, Card, Typography, Space } from 'antd';
import { 
  WarningOutlined, 
  ReloadOutlined, 
  HomeOutlined,
  BugOutlined 
} from '@ant-design/icons';
import './ErrorBoundaries.css';

const { Paragraph, Text } = Typography;

/**
 * Error Boundary Base
 * Maneja errores de React y muestra UI amigable
 */
class BaseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error
    console.error('🚨 Error Boundary capturó un error:', error, errorInfo);
    
    // Actualizar estado
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Enviar a servicio de logging (Sentry, LogRocket, etc.)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log adicional para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.group('📋 Error Details');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      const { 
        title = '¡Ups! Algo salió mal',
        subtitle = 'Ocurrió un error inesperado',
        showDetails = process.env.NODE_ENV === 'development',
        showHomeButton = true,
        showResetButton = true,
        customAction
      } = this.props;

      // Si hay muchos errores, mostrar mensaje diferente
      if (this.state.errorCount > 3) {
        return (
          <Card className="error-boundary-container">
            <Result
              status="500"
              icon={<BugOutlined />}
              title="Error Crítico"
              subTitle="La aplicación ha encontrado múltiples errores. Por favor, recarga la página."
              extra={[
                <Button 
                  key="reload" 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={() => window.location.reload()}
                >
                  Recargar Página
                </Button>
              ]}
            />
          </Card>
        );
      }

      return (
        <Card className="error-boundary-container">
          <Result
            status="warning"
            icon={<WarningOutlined />}
            title={title}
            subTitle={subtitle}
            extra={[
              showResetButton && (
                <Button 
                  key="reset" 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={this.handleReset}
                >
                  Intentar de Nuevo
                </Button>
              ),
              showHomeButton && (
                <Button 
                  key="home" 
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                >
                  Ir al Inicio
                </Button>
              ),
              customAction
            ].filter(Boolean)}
          >
            {showDetails && this.state.error && (
              <Card 
                type="inner" 
                title="Detalles del Error (Solo Desarrollo)"
                className="error-details-card"
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Error: </Text>
                    <Paragraph code copyable>
                      {this.state.error.toString()}
                    </Paragraph>
                  </div>
                  
                  {this.state.errorInfo && (
                    <div>
                      <Text strong>Component Stack: </Text>
                      <Paragraph 
                        code 
                        copyable
                        style={{ 
                          maxHeight: '200px', 
                          overflow: 'auto',
                          fontSize: '12px'
                        }}
                      >
                        {this.state.errorInfo.componentStack}
                      </Paragraph>
                    </div>
                  )}
                </Space>
              </Card>
            )}
          </Result>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default BaseErrorBoundary;
