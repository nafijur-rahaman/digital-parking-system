import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import LiveMapPage from './pages/LiveMapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/auth';
import { RoleContext } from './context/RoleContext';

const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <RoleContext.Provider value={{ role: user.role }}>
      <DashboardLayout>
        <Routes>
          {user.role === 'superadmin' ? (
            <>
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="/admin" element={<SuperAdminDashboard />} />
              <Route path="/terminal" element={<LiveMapPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LiveMapPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </DashboardLayout>
    </RoleContext.Provider>
  );
};

const AppRoutes = () => {
  return (
    <AuthProvider>
      <ProtectedRoutes />
    </AuthProvider>
  );
};

export default AppRoutes;
