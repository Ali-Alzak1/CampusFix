import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import ReportDetailPage from './pages/ReportDetailPage.jsx';
import NewReportPage from './pages/NewReportPage.jsx';
import StaffPage from './pages/StaffPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Spinner from './components/ui/Spinner.jsx';
import { useAuth } from './auth/AuthContext.jsx';

export default function App() {
  const { currentUser, authReady, isStaff } = useAuth();

  if (!authReady) return <Spinner label="Starting session" />;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={currentUser ? <AppLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<DashboardPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/new" element={<NewReportPage />} />
        <Route path="reports/:id" element={<ReportDetailPage />} />
        <Route path="staff" element={isStaff ? <StaffPage /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
