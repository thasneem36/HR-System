import React from "react";
import { Link } from "react-router-dom";
import ICSTlogo from "../../img/IcstLogo.png";
import "./Header.css";

function Header() {
    return (
        <header className="header">
            <nav>
                <div className="heroSection">
                    <img src={ICSTlogo} alt="ICST Logo" />
                    <p>HR System</p>
                </div>
                <div className="navLinks">
                    <ul>
                        <li>
                            <Link to="/AdminDashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/ManageEmployees">Manage Employees</Link></li>
                        <li>
                            <Link to="/AttendanceDashboard">Attendance Management</Link>
                        </li>
                        <li><Link to="/LeaveManagement">Leave Management</Link></li>
                        <li>Payroll Management</li>
                        <li><Link to="/UserRolesPage">User Roles</Link></li>
                        <li>
                            <Link to="/ReportsAnalyticsPage">Reports & Analytics</Link>
                        </li>
                        <li><Link to="/">Settings</Link></li>
                    </ul>
                </div>
                <div className="logout">
                    <a ><Link to="/Login">Logout</Link></a>
                </div>
            </nav>
        </header>
    );
}

export default Header;