// <<<<<<< Athnan
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material';
// import CssBaseline from '@mui/material/CssBaseline';
// import theme from './theme';

// // Components
// import MainLayout from './components/Layout/MainLayout';
// import Login from './Login/Login';
// import Register from './components/Auth/Register';
// import ProtectedRoute from './components/Auth/ProtectedRoute';
// =======
// import './App.css'
// import AdminNav from './navbars/AdminNav'
// import Onboard from './pages/Admin/Manage/Onboard'
// import People from './pages/Admin/Manage/People'
// import Overview from './pages/Admin/Overview'
// import Attendance from './pages/Admin/Manage/Attendance'
// import TimeOff from './pages/Admin/Manage/TimeOff'
// import { Navigate } from "react-router-dom";
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Profile from './pages/Admin/Settings/Profile'
// import LeaveSettings from './pages/Admin/Settings/LeaveSettings'
// import Calendar from './pages/Admin/Settings/Calendar'
// import InOutTime from './pages/Admin/Settings/InOutTime'
// import Login from './Login/Login'
// import LeaveRequestForm from './components/EmployeeRM/LeaveRequestForm'
// >>>>>>> main

// Pages
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Departments from './pages/Departments';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<Navigate to="employees" replace />} />
              <Route path="employees" element={<Employees />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="leaves" element={<Leaves />} />
              <Route path="departments" element={<Departments />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
