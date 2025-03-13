// import React, { useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// import { Card, CardContent } from '../Components/ui/card';
// import { Button } from "../Components/ui/button";
// import Header from "../navBar/Header";
// import { Link } from "react-router-dom";

// const initialEmployees = [
//     { name: "IT", attendance: 94.74, total: 50 },
//     { name: "Sales", attendance: 85.26, total: 40 },
//     { name: "HR", attendance: 82, total: 30 },
//     { name: "Marketing", attendance: 81.33, total: 35 },
//     { name: "Admin", attendance: 81.19, total: 25 },
//     { name: "Customer Support", attendance: 80.10, total: 45 },
//     { name: "Accounting", attendance: 63.54, total: 20 },
// ];

// export default function AttendanceDashboard() {
//     const [employees, setEmployees] = useState(initialEmployees);
//     const totalEmployees = employees.reduce((acc, dept) => acc + dept.total, 0);
//     const totalPresent = employees.reduce((acc, dept) => acc + Math.round((dept.attendance / 100) * dept.total), 0);
//     const totalAbsent = totalEmployees - totalPresent;
//     const totalLeave = Math.round(totalEmployees * 0.1); // Example leave calculation

//     return (
//         <div>
//             <Header />
//             <div className="main-container">
//                 <h1>Attendance Dashboard</h1>
//                 <header className="attendanceHeader">
//                     <nav>
//                         <ul>
//                             <li className="active">
//                                 <Link to="/attendance-dashboard">Attendance Dashboard</Link>
//                             </li>
//                             <li>
//                                 <Link to="/attendance-records">Attendance Records</Link>
//                             </li>
//                             <li>
//                                 <Link to="/manual-attendance">Manual Attendance Entry</Link>
//                             </li>
//                         </ul>
//                     </nav>
//                 </header>
//                 <main>
//                     <div className="p-6 space-y-6">
//                         {/* Summary Cards */}
//                         <div className="cards grid grid-cols-2 md:grid-cols-4 gap-4">
//                             <Card><CardContent>Total Employees: {totalEmployees}</CardContent></Card>
//                             <Card><CardContent>Present: {totalPresent}</CardContent></Card>
//                             <Card><CardContent>Absent: {totalAbsent}</CardContent></Card>
//                             <Card><CardContent>On Leave: {totalLeave}</CardContent></Card>
//                         </div>

//                         {/* Bar Chart */}
//                         <ResponsiveContainer width="100%" height={400}>
//                             <BarChart data={employees} layout="vertical" margin={{ left: 50 }}>
//                                 <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
//                                 <YAxis dataKey="name" type="category" width={120} />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="attendance" fill="#e91e63" barSize={20} />
//                             </BarChart>
//                         </ResponsiveContainer>

//                         {/* Check-in/Check-out Buttons */}
//                         <div className="flex gap-4">
//                             <Button className="bg-green-500 text-white">Check In</Button>
//                             <Button className="bg-red-500 text-white">Check Out</Button>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// }




import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import Header from "../navBar/Header";
import { Link } from "react-router-dom";
import { Users, CheckCircle, XCircle, Calendar } from "lucide-react"; // Import Lucide icons

const initialEmployees = [
  { name: "IT", attendance: 94.74, total: 50 },
  { name: "Sales", attendance: 85.26, total: 40 },
  { name: "HR", attendance: 82, total: 30 },
  { name: "Marketing", attendance: 81.33, total: 35 },
  { name: "Admin", attendance: 81.19, total: 25 },
  { name: "Customer Support", attendance: 80.1, total: 45 },
  { name: "Accounting", attendance: 63.54, total: 20 },
];

export default function AttendanceDashboard() {
  const [employees, setEmployees] = useState(initialEmployees);
  const totalEmployees = employees.reduce((acc, dept) => acc + dept.total, 0);
  const totalPresent = employees.reduce((acc, dept) => acc + Math.round((dept.attendance / 100) * dept.total), 0);
  const totalAbsent = totalEmployees - totalPresent;
  const totalLeave = Math.round(totalEmployees * 0.1); // Example leave calculation

  return (
    <div>
      <Header />
      <div className="main-container">
        <h1>Attendance Dashboard</h1>
        <header className="attendanceHeader">
          <nav>
            <ul>
              <li className="active">
                <Link to="/attendance-dashboard">Attendance Dashboard</Link>
              </li>
              <li>
                <Link to="/attendance-records">Attendance Records</Link>
              </li>
              <li>
                <Link to="/manual-attendance">Manual Attendance Entry</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <div className="p-6 space-y-6">
            {/* Summary Cards with Lucide Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="card flex flex-col items-center gap-2">
                  <span className="text-lg font-semibold">Total Employees</span>
                  <span className="text-2xl font-bold">{totalEmployees}</span>
                  <Users className="w-8 h-8 text-blue-500" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="card flex flex-col items-center gap-2">
                  <span className="text-lg font-semibold">Present</span>
                  <span className="text-2xl font-bold">{totalPresent}</span>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="card flex flex-col items-center gap-2">
                  <span className="text-lg font-semibold">Absent</span>
                  <span className="text-2xl font-bold">{totalAbsent}</span>
                  <XCircle className="w-8 h-8 text-red-500" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="card flex flex-col items-center gap-2">
                  <span className="text-lg font-semibold">On Leave</span>
                  <span className="text-2xl font-bold">{totalLeave}</span>
                  <Calendar className="w-8 h-8 text-purple-500" />
                </CardContent>
              </Card>
            </div>

            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={employees} layout="vertical" margin={{ left: 50 }}>
                <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#e91e63" barSize={20} />
              </BarChart>
            </ResponsiveContainer>

            {/* Check-in/Check-out Buttons */}
            <div className="flex gap-4">
              <Button className="bg-green-500 text-white">Check In</Button>
              <Button className="bg-red-500 text-white">Check Out</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
