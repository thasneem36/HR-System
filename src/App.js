// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Header from "./Admin/navBar/Header";
// import Login from './Login/Login';
// import AttendanceDashboard from "./Admin/Pages/AttendanceDashboard";
// import AttendanceRecords from "./Admin/Components/AttendanceRecords";
// import ManualAttendance from "./Admin/Components/ManualAttendance";
// import ReportsAnalyticsPage from "./Admin/Pages/ReportsAnalyticsPage";
// import "./App.css";
// import LeaveManagement from './Admin/Pages/LeaveManagement'

// function App() {
//     return (
//         // <UserRolesPage />
//         <BrowserRouter>
//             {/* <Login /> */}
//             {/* <Header /> */}
//             <Routes>
//                 <Route path="/" element={<Login />} />
//                 {/* <Route path="/" element={<AttendanceDashboard />} /> */}
//                 <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
//                 <Route path="/attendance-records" element={<AttendanceRecords />} />
//                 <Route path="/manual-attendance" element={<ManualAttendance />} />
//                 <Route path="/ReportsAnalyticsPage" element={<ReportsAnalyticsPage />} />
//                 <Route path="/LeaveManagement" element={<LeaveManagement />} />


//             </Routes>
//         </BrowserRouter>
//     );
// }

// export default App;


import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Admin/navBar/Header";

import AdminDashborad from './Admin/Pages/AdminDashboard'
import AttendanceDashboard from "./Admin/Pages/AttendanceDashboard";
import AttendanceRecords from "./Admin/Components/AttendanceRecords";
import ManualAttendance from "./Admin/Components/ManualAttendance";
import ReportsAnalyticsPage from "./Admin/Pages/ReportsAnalyticsPage";
import LeaveManagement from "./Admin/Pages/LeaveManagement";
import UserRolesPage from "./Admin/Pages/UserRolesPermissions";
// import Settings from "./Admin/Settings/Settings";
import Login from "./Login/Login";
import ProtectedRoute from "./Admin/Components/ProtectedRoute/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
            <Route path="/AdminDashborad" element={<AdminDashborad />} />
          <Route path="/AttendanceDashboard" element={<AttendanceDashboard />} />
          <Route path="/attendance-records" element={<AttendanceRecords />} />
          <Route path="/manual-attendance" element={<ManualAttendance />} />
          <Route path="/ReportsAnalyticsPage" element={<ReportsAnalyticsPage />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/UserRolesPage" element={<UserRolesPage />} />
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
