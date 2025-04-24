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

import Dashboard from './pages/EmployeeRM/Dashboard'
const isLoggedIn = !!localStorage.getItem("authToken");

function App() {

  return (
    <>
      <BrowserRouter>
        {/* <AdminNav /> */}
        {/* <Login /> */}
        <Routes>
        <Route path="/dashboard" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Login />} />
          {/* <Route path='/' element={<Overview />} /> */}
          <Route path='/overview' element={<Overview />} />
          <Route path='/onboard' element={<Onboard />} />
          <Route path='/people' element={<People />} />
          <Route path='/attendance' element={<Attendance />} />
          <Route path='/timeOff' element={<TimeOff />} />
          
          {/* settings route */}
          <Route path='/profile' element={<Profile />} />
          <Route path='/leaveSettings' element={<LeaveSettings />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/inOutTime' element={<InOutTime />} />

          <Route path='/rmD' element={<Dashboard />} />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
