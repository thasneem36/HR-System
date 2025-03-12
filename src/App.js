import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Admin/navBar/Header";
import AttendanceDashboard from "./Admin/AttendanceManagement/AttendanceDashboard";
import AttendanceRecords from "./Admin/AttendanceManagement/AttendanceRecords";
import ManualAttendance from "./Admin/AttendanceManagement/ManualAttendance";
import ReportsAnalyticsPage from "./Admin/Report/ReportsAnalyticsPage";
import LeaveManagement from "./Admin/LeaveManagement/LeaveManagement";
import UserRolesPage from "./Admin/UserRoles/UserRolesPage";
import Settings from "./Admin/Settings/Settings";
import Login from "./Admin/Login/Login";
import ProtectedRoute from "./Admin/ProtectedRoute/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/AttendanceDashboard" element={<AttendanceDashboard />} />
          <Route path="/attendance-records" element={<AttendanceRecords />} />
          <Route path="/manual-attendance" element={<ManualAttendance />} />
          <Route path="/ReportsAnalyticsPage" element={<ReportsAnalyticsPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user-roles" element={<UserRolesPage />} />
          <Route path="/Leavemanagement" element={<LeaveManagement />} />
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
