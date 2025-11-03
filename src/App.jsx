import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
// ✅ FASE 3: Path aliases para imports más limpios
import { useAuth, useAuthStore, selectLoading } from '@stores/authStore';
import { useTheme, useThemeStore, selectAntdTheme } from '@stores/themeStore';
import { BaseErrorBoundary } from '@components/common/ErrorBoundaries';
import ProtectedRoute from '@components/ProtectedRoute';
import { DashboardSkeleton, TableSkeleton, FormSkeleton } from '@components/common/LoadingStates';
import { preloadMultipleRoutes } from '@utils/preloadRoutes';

import "./App.css";

// ✅ OPTIMIZACIÓN: Definir funciones de importación para preload
const importLogin = () => import('./features/auth').then(m => ({ default: m.Login }));
const importRegister = () => import('./features/auth').then(m => ({ default: m.Register }));
const importDashboard = () => import('./features/dashboard').then(m => ({ default: m.Dashboard }));
const importPerfilUsuario = () => import('./features/perfil').then(m => ({ default: m.PerfilUsuario }));
const importUserList = () => import('./features/usuarios').then(m => ({ default: m.UserList }));
const importRoleList = () => import('./features/roles').then(m => ({ default: m.RoleList }));
const importCompanyList = () => import('./features/empresas').then(m => ({ default: m.CompanyList }));
// ✅ MIGRADO A FEATURES: Tolerancias ahora usa arquitectura modular
const importToleranceList = () => import('./features/configuracion/tolerancias').then(m => ({ default: m.ToleranceList }));
const importVehicleTypeList = () => import('./features/vehicleTypes').then(m => ({ default: m.VehicleTypeListSimple }));
const importVehicleList = () => import('./features/vehiculos').then(m => ({ default: m.VehicleListSimple }));
const importOwnerList = () => import('./features/propietarios').then(m => ({ default: m.OwnerList }));
const importReportes = () => import('./features/reportes').then(m => ({ default: m.Reportes }));
const importRegistroList = () => import('./features/registros').then(m => ({ default: m.RegistroList }));
const importIngresoList = () => import('./features/ingresos').then(m => ({ default: m.IngresoList }));
const importIngresoMobile = () => import('./features/ingresos').then(m => ({ default: m.IngresoMobile }));
const importSalidasList = () => import('./features/salidas').then(m => ({ default: m.SalidasList }));
const importObservacionesList = () => import('./features/observaciones').then(m => ({ default: m.ObservacionesList }));

// ✅ OPTIMIZACIÓN: Lazy loading con funciones reutilizables
const Login = lazy(importLogin);
const Register = lazy(importRegister);
const Dashboard = lazy(importDashboard);
const PerfilUsuario = lazy(importPerfilUsuario);
const UserList = lazy(importUserList);
const RoleList = lazy(importRoleList);
const CompanyList = lazy(importCompanyList);
const ToleranceList = lazy(importToleranceList);
const VehicleTypeList = lazy(importVehicleTypeList);
const VehicleList = lazy(importVehicleList);
const OwnerList = lazy(importOwnerList);
const Reportes = lazy(importReportes);
const RegistroList = lazy(importRegistroList);
const IngresoList = lazy(importIngresoList);
const IngresoMobile = lazy(importIngresoMobile);
const SalidasList = lazy(importSalidasList);
const ObservacionesList = lazy(importObservacionesList);

// Componente para manejar la redirección inicial
const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  // ✅ ZUSTAND: Selector optimizado para evitar re-renders innecesarios
  const loading = useAuthStore(selectLoading);

  // ✅ OPTIMIZACIÓN: Precargar rutas críticas después del login
  useEffect(() => {
    if (isAuthenticated()) {
      // Precargar las rutas más usadas en segundo plano
      const criticalRoutes = [
        { importFunction: importDashboard, routeName: 'Dashboard' },
        { importFunction: importIngresoList, routeName: 'IngresoList' },
        { importFunction: importUserList, routeName: 'UserList' },
        { importFunction: importVehicleList, routeName: 'VehicleList' },
      ];

      // Esperar 1 segundo después del login para no bloquear
      setTimeout(() => {
        console.log('🚀 Precargando rutas críticas...');
        preloadMultipleRoutes(criticalRoutes)
          .then(() => console.log('✅ Rutas críticas precargadas'))
          .catch(err => console.error('❌ Error precargando rutas:', err));
      }, 1000);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        padding: '24px'
      }}>
        <DashboardSkeleton />
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          Cargando aplicación...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : (
            <Suspense fallback={<FormSkeleton fields={3} />}>
              <Login />
            </Suspense>
          )
        } 
      />

      <Route 
        path="/register" 
        element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : (
            <Suspense fallback={<FormSkeleton fields={8} />}>
              <Register />
            </Suspense>
          )
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<DashboardSkeleton />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/usuarios" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={10} columns={5} />}>
              <UserList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/roles" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={8} columns={4} />}>
              <RoleList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/registros" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={15} columns={6} />}>
              <RegistroList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ingresos" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={12} columns={7} />}>
              <IngresoList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ingresos-mobile" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={8} columns={4} />}>
              <IngresoMobile />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/empresas" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={8} columns={4} />}>
              <CompanyList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tolerancias" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={6} columns={3} />}>
              <ToleranceList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tipos-vehiculo" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={8} columns={4} />}>
              <VehicleTypeList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vehiculos" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={12} columns={6} />}>
              <VehicleList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/propietarios" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={10} columns={5} />}>
              <OwnerList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reportes" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<DashboardSkeleton />}>
              <Reportes />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/salidas" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={12} columns={6} />}>
              <SalidasList />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/observaciones" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<TableSkeleton rows={10} columns={5} />}>
              <ObservacionesList />
            </Suspense>
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
            <Suspense fallback={<FormSkeleton fields={6} />}>
              <PerfilUsuario />
            </Suspense>
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

// Componente principal con stores de Zustand
const AppContent = () => {
  // ✅ ZUSTAND: Inicializar auth store al montar la aplicación
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  // ✅ ZUSTAND: Obtener tema usando selector optimizado (evita renders infinitos)
  const antdTheme = useThemeStore(selectAntdTheme);

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
    <BaseErrorBoundary
      title="Error en la aplicación"
      subtitle="Ha ocurrido un error inesperado"
      showHomeButton={false}
      showResetButton={true}
    >
      {/* ✅ ZUSTAND: Ya no necesitamos Providers - stores son globales */}
      <AppContent />
    </BaseErrorBoundary>
  );
}

export default App;
