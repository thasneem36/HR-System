import React from "react";
import { Link } from "react-router-dom";
import "../Components/Attendance.css";

import Header from "../navBar/Header";

function AttendanceDashboard() {
    return (
        <div className="AMPdashboard">
        <Header />
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
            <main className="container-table">
                <div className="row">
                    <table>
                        <th>
                            <td>ID</td>
                            <td>Name</td>
                            <td>123</td>
                        </th>
                        <tr>
                            <td>1</td>
                            <td>mt</td>
                            <td>1</td>
                            
                        </tr>
                    </table>
                </div>
                <div className="row"></div>
                <div className="row"></div>
            </main>
        </div>
    );
}

export default AttendanceDashboard;