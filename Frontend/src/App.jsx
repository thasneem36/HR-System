import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './components/Layout/MainLayout';
import Login from './Login/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleRoute from './components/Auth/RoleRoute';

import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Departments from './pages/Departments';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Payroll from './pages/Payroll';
import AuditLog from './pages/AuditLog';
import Documents from './pages/Documents';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected — all logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"  element={<Dashboard />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="leaves"     element={<Leaves />} />
              <Route path="profile"    element={<Profile />} />

              {/* HR & Admin only */}
              <Route element={<RoleRoute roles={['super_admin', 'hr_manager']} />}>
                <Route path="employees"   element={<Employees />} />
                <Route path="departments" element={<Departments />} />
                <Route path="jobs"        element={<Jobs />} />
                <Route path="reports"     element={<Reports />} />
                <Route path="settings"    element={<Settings />} />
                <Route path="payroll"     element={<Payroll />} />
                <Route path="audit-log"   element={<AuditLog />} />
              </Route>

              {/* All authenticated users */}
              <Route path="documents" element={<Documents />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
