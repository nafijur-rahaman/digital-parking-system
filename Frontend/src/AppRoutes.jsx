import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import LiveMapPage from './pages/LiveMapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleContext } from './context/RoleContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  // Prevent flash of login page while rehydrating from localStorage
  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--bg-app)' }}>
      <span className="loader-ring" style={{ width: 40, height: 40 }} />
      <p style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>Loading…</p>
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
    <ToastProvider>
      {/* ToastContainer renders toasts over everything at z-[99999] */}
      <ToastContainer />
      <AuthProvider>
        <ProtectedRoutes />
      </AuthProvider>
    </ToastProvider>
  );
};

export default AppRoutes;
