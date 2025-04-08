import './App.css'
import AdminNav from './navbars/AdminNav'
import Onboard from './pages/Admin/Manage/Onboard'
import People from './pages/Admin/Manage/People'
import Overview from './pages/Admin/Overview'
import Attendance from './pages/Admin/Manage/Attendance'
import TimeOff from './pages/Admin/Manage/TimeOff'

import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {

  return (
    <>
      <BrowserRouter>
        <AdminNav />
        <Routes>
          <Route path='/' element={<Overview />} />
          <Route path='/overview' element={<Overview />} />
          <Route path='/onboard' element={<Onboard />} />
          <Route path='/people' element={<People />} />
          <Route path='/attendance' element={<Attendance />} />
          <Route path='/timeOff' element={<TimeOff />} />
          
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
