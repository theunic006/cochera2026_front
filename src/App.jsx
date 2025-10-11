import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import esES from 'antd/locale/es_ES';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PerfilUsuario from './components/perfil/PerfilUsuario';
import UserList from './components/users/UserList';
import RoleList from './components/roles/RoleList';
import { CompanyList } from './components/companies';
import { ToleranceList } from './components/tolerances';
import { VehicleTypeList } from './components/vehicleTypes';
import { VehicleList } from './components/vehicles';
import { OwnerList } from './components/owners';
import Reportes from './components/Reportes';
import ProtectedRoute from './components/ProtectedRoute';
import RegistroList from './components/registros/RegistroList';
import IngresoList from './components/ingresos/IngresoList';
import SalidasList from './components/salidas/SalidasList';
import { ObservacionesList } from './components/observaciones';
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
        path="/roles" 
        element={
          <ProtectedRoute>
            <RoleList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/registros" 
        element={
          <ProtectedRoute>
            <RegistroList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ingresos" 
        element={
          <ProtectedRoute>
            <IngresoList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/empresas" 
        element={
          <ProtectedRoute>
            <CompanyList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tolerancias" 
        element={
          <ProtectedRoute>
            <ToleranceList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tipos-vehiculo" 
        element={
          <ProtectedRoute>
            <VehicleTypeList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehiculos" 
        element={
          <ProtectedRoute>
            <VehicleList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/propietarios" 
        element={
          <ProtectedRoute>
            <OwnerList />
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
      <Route 
        path="/salidas" 
        element={
          <ProtectedRoute>
            <SalidasList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/observaciones" 
        element={
          <ProtectedRoute>
            <ObservacionesList />
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
            <PerfilUsuario />
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

// Componente que usa los contextos
const AppContent = () => {
  const { antdTheme } = useTheme();

  return (
    <ConfigProvider 
      locale={esES} 
      theme={antdTheme}
      // Configuración específica para React 19
      getPopupContainer={(triggerNode) => {
        if (triggerNode) {
          return triggerNode.parentNode || document.body;
        }
        return document.body;
      }}
    >
      <Router>
        <AppRouter />
      </Router>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
