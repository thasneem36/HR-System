import React, { useState } from "react";
import {
    ManageAccounts,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Settings,
    Logout,
    Notifications,
    Person,
    Dashboard,
} from '@mui/icons-material';

import './Admin.css';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/ICST.png";

function AdminNav() {
    const [manageOpen, setManageOpen] = useState(false);
    const [settingOpen, setSettingOpen] = useState(false);
    const navigate = useNavigate();

    const toggleManage = () => {
        setManageOpen(!manageOpen);
    };

    const toggleSetting = () => {
        setSettingOpen(!settingOpen);
    };

    const handleLogout = () => {
        // Remove token or any user data from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");

        // Redirect to login page
        navigate("/login");
    };

    return (
        <div className="Navbar">
            <nav className="nav">
                <div className="logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="nav-links">
                    <Notifications className="icon notification icon-l icon-t-g" />
                    <div className="account">
                        <Person className="icon icon-l icon-t-g" />
                        <div className="text">
                            <h1>HMM Thasneem</h1>
                            <p>thasneem9mt@gmail.com</p>
                        </div>
                    </div>
                    <div className="dropdown">
                        <KeyboardArrowDown className="icon icon-l" />
                    </div>
                </div>
            </nav>

            <div className="sidebar">
                <ul className="side-m">
                    <li className="sidebar-item">
                        <Dashboard className="icon-m icon-t-g" />
                        <Link to="/overview" className="text dropdown-li">Overview</Link>
                    </li>

                    <li className="sidebar-item" onClick={toggleManage}>
                        <ManageAccounts className="icon-m icon-t-g" />
                        <span className="text">Manage</span>
                        <span className="arrow">
                            {manageOpen ? (
                                <KeyboardArrowUp className="icon-m icon-right" />
                            ) : (
                                <KeyboardArrowDown className="icon-m icon-right" />
                            )}
                        </span>
                    </li>

                    {manageOpen && (
                        <ul className="dropdown">
                            <li className="manage-item">
                                <Link to="/people" className="dropdown-li">People</Link>
                            </li>
                            <li className="manage-item">
                                <Link to="/attendance" className="dropdown-li">Attendance</Link>
                            </li>
                            <li className="manage-item">
                                <Link to="/timeOff" className="dropdown-li">Time-off</Link>
                            </li>
                        </ul>
                    )}

                    <li className="sidebar-item" onClick={toggleSetting}>
                        <Settings className="icon-m icon-t-g" />
                        <span className="text">Settings</span>
                        <span className="arrow">
                            {settingOpen ? (
                                <KeyboardArrowUp className="icon-m icon-right" />
                            ) : (
                                <KeyboardArrowDown className="icon-m icon-right" />
                            )}
                        </span>
                    </li>

                    {settingOpen && (
                        <ul className="dropdown">
                            <li className="manage-item">
                                <Link to="/leaveSettings" className="dropdown-li">Leave Settings</Link>
                            </li>
                            <li className="manage-item">
                                <Link to="/calendar" className="dropdown-li">Calendar</Link>
                            </li>
                        </ul>
                    )}

                    {/* Logout */}
                    <li className="sidebar-item">
                        <Link to="/" onClick={handleLogout} className="dropdown-li">
                            <Logout className="icon-m icon-t-g" />
                            <span className="text">Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default AdminNav;
