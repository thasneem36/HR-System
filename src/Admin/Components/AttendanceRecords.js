import React from "react";
import './Attendance.css';
import { Link } from "react-router-dom";
import Header from "../navBar/Header";

function AttendanceRecords() {
    return (
        <div className="AMPdashboard">
            <Header />
        <h1>Attendance Records</h1>
            <header className="attendanceHeader">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Attendance Dashboard</Link>
                        </li>
                        <li className="active">
                            <Link to="/attendance-records">Attendance Records</Link>
                        </li>
                        <li>
                            <Link to="/manual-attendance">Manual Attendance Entry</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                <div>
                    <table className="recodeTable">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Check IN</th>
                            <th>Check Out</th>
                            <th>Working Hours</th>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>xxxxxxxxxx</td>
                            <td>3/10/2025</td>
                            <td>7:10</td>
                            <td>2:50</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>xxxxxxxxxx</td>
                            <td>3/10/2025</td>
                            <td>7:10</td>
                            <td>2:50</td>
                            <td>10</td>
                        </tr>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default AttendanceRecords;