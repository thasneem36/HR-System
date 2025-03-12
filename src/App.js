import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Admin/navBar/Header";
import Login from './Login/Login';
import AttendanceDashboard from "./Admin/Pages/AttendanceDashboard";
import AttendanceRecords from "./Admin/Components/AttendanceRecords";
import ManualAttendance from "./Admin/Components/ManualAttendance";
import ReportsAnalyticsPage from "./Admin/Pages/ReportsAnalyticsPage";
import "./App.css";
import LeaveManagement from './Admin/Pages/LeaveManagement'

function App() {
    return (
        // <UserRolesPage />
        <BrowserRouter>
            {/* <Login /> */}
            {/* <Header /> */}
            <Routes>
                <Route path="/" element={<Login />} />
                {/* <Route path="/" element={<AttendanceDashboard />} /> */}
                <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
                <Route path="/attendance-records" element={<AttendanceRecords />} />
                <Route path="/manual-attendance" element={<ManualAttendance />} />
                <Route path="/ReportsAnalyticsPage" element={<ReportsAnalyticsPage />} />
                <Route path="/LeaveManagement" element={<LeaveManagement />} />


            </Routes>
        </BrowserRouter>
    );
}

export default App;