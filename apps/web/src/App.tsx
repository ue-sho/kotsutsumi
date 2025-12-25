import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { DashboardPage } from './pages/Dashboard';
import { WorkLogsPage } from './pages/WorkLogs';
import { WorkLogDetailPage } from './pages/WorkLogDetail';
import { WorkLogFormPage } from './pages/WorkLogForm';
import { CalendarPage } from './pages/Calendar';
import { StatisticsPage } from './pages/Statistics';
import { SettingsPage } from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="work-logs" element={<WorkLogsPage />} />
        <Route path="work-logs/new" element={<WorkLogFormPage />} />
        <Route path="work-logs/:id" element={<WorkLogDetailPage />} />
        <Route path="work-logs/:id/edit" element={<WorkLogFormPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
