import { Navigate } from 'react-router-dom';
// ✅ FASE 3: Path aliases + Zustand
import { useAuth } from '@stores/authStore';
import { DashboardSkeleton } from './common/LoadingStates';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '24px'
      }}>
        <DashboardSkeleton />
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;