import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import LiveMapPage from './pages/LiveMapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleContext } from './context/RoleContext';

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  // Prevent flash of login page while rehydrating from localStorage
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin" />
    </div>
  );

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
