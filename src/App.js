import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import components
import AdminDashboard from './Admin/Pages/AdminDashboard'; // Correct import
import AttendanceDashboard from "./Admin/Pages/AttendanceDashboard";
import AttendanceRecords from "./Admin/Components/AttendanceRecords";
import ManualAttendance from "./Admin/Components/ManualAttendance";
import ReportsAnalyticsPage from "./Admin/Pages/ReportsAnalyticsPage";
import LeaveManagement from "./Admin/Pages/LeaveManagement";
import UserRolesPage from "./Admin/Pages/UserRolesPermissions";
import ManageEmployees from "./Admin/Pages/ManageEmployees";
import Login from "./Login/Login";
import ProtectedRoute from "./Admin/Components/ProtectedRoute/ProtectedRoute";

import RMpage from './RM/Pages/RMpage';
import StafPage from './Staf/Pages/StafPage';

// Styles
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Admindashboard" element={<AdminDashboard />} />
          <Route path="/AttendanceDashboard" element={<AttendanceDashboard />} />
          <Route path="/attendance-records" element={<AttendanceRecords />} />
          <Route path="/manual-attendance" element={<ManualAttendance />} />
          <Route path="/ReportsAnalyticsPage" element={<ReportsAnalyticsPage />} />
          <Route path="/UserRolesPage" element={<UserRolesPage />} />
          <Route path="/Leavemanagement" element={<LeaveManagement />} />
          <Route path="/ManageEmployees" element={<ManageEmployees />} />


          <Route path="/RMpage" element={<RMpage />} />
          <Route path="/StafPage" element={<StafPage />} />
        </Route>

        {/* Public Route */}
        <Route path="/Login" element={<Login />} />

        {/* Default route if the user is not authenticated */}
        <Route path="*" element={<Navigate to="/Login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;