import './App.css'
import AdminNav from './navbars/AdminNav'
import Onboard from './pages/Admin/Manage/Onboard'
import People from './pages/Admin/Manage/People'
import Overview from './pages/Admin/Overview'
import Attendance from './pages/Admin/Manage/Attendance'
import TimeOff from './pages/Admin/Manage/TimeOff'
import { Navigate } from "react-router-dom";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Profile from './pages/Admin/Settings/Profile'
import LeaveSettings from './pages/Admin/Settings/LeaveSettings'
import Calendar from './pages/Admin/Settings/Calendar'
import InOutTime from './pages/Admin/Settings/InOutTime'
import Login from './Login/Login'
import LeaveRequestForm from './components/EmployeeRM/LeaveRequestForm'

const isLoggedIn = !!localStorage.getItem('authToken');

function App() {
  return (
    <LeaveProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={isLoggedIn ? <Overview /> : <Navigate to="/" />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/people" element={<People />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/timeOff" element={<TimeOff />} />

          {/* Settings */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaveSettings" element={<LeaveSettings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/inOutTime" element={<InOutTime />} />

          {/* RM Employee Dashboard */}
          <Route path="/rmdashboard" element={<Dashboard />} />

          {/*Employee Dashboard*/}
          <Route path='/employeedashboard' element={<EmployeeDashboard/>}/>

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/request-leave" element={<LeaveRequestPage />} />
        </Routes>
      </BrowserRouter>
    </LeaveProvider>
  );
}

export default App;
