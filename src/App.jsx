import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import esES from 'antd/locale/es_ES';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserList from './components/users/UserList';
import Vehiculos from './components/Vehiculos';
import Reportes from './components/Reportes';
import ProtectedRoute from './components/ProtectedRoute';
import "./App.css";

// Componente para manejar la redirección inicial
const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Spin size="large" />
        <div>Cargando aplicación...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/usuarios" 
        element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehiculos" 
        element={
          <ProtectedRoute>
            <Vehiculos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reportes" 
        element={
          <ProtectedRoute>
            <Reportes />
          </ProtectedRoute>
        } 
      />
      {/* Rutas adicionales placeholder */}
      <Route 
        path="/pagos" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/seguridad" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/configuracion" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
};

// Componente principal de la aplicación
const AppContent = () => {
  const { antdTheme } = useTheme();

  return (
    <ConfigProvider locale={esES} theme={antdTheme}>
      <AuthProvider>
        <Router>
          <AppRouter />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
