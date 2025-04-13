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

import { Link } from "react-router-dom"; // Corrected import for Link

import Logo from "../assets/ICST.png"; // Correct image path

function AdminNav() {
    const [manageOpen, setManageOpen] = useState(false);
    const [settingOpen, setSettingOpen] = useState(false);

    const toggleManage = () => {
        setManageOpen(!manageOpen);
    };
    const toggleSetting = () => {
        setSettingOpen(!settingOpen);
    };

    return (
        <>
            <div className="Navbar">
                <div>
                    <nav className="nav">
                        <div className="logo">
                            <img src={Logo} alt="Logo" />
                        </div>
                        <div className="nav-links">
                            <Notifications className="icon notification icon-l icon-t-g " />
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
                </div>
                <div className="sidebar">
                    <ul className="side-m">
                        {/* Overview section */}
                        <li className="sidebar-item">
                            <Dashboard className="icon-m icon-t-g" />
                            <Link to="/" className="text dropdown-li">Overview</Link>
                        </li>

                        {/* Manage dropdown */}
                        <li className="sidebar-item" onClick={toggleManage}>
                            <ManageAccounts className="icon-m icon-t-g" />
                            <span className="text">Manage</span>

                            {manageOpen ? (
                                <span className="arrow">
                                    <KeyboardArrowUp className="icon-m icon-right" />
                                </span>
                            ) : (
                                <span className="arrow">
                                    <KeyboardArrowDown className="icon-m icon-right" />
                                </span>
                            )}
                        </li>

                        {manageOpen && (
                            <ul className="dropdown">
                                <li className="manage-item">
                                    <Link to="/onboard" className="dropdown-li">Onboard</Link>
                                </li>
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

                        {/* Settings and Logout */}
                        <li className="sidebar-item" onClick={toggleSetting}>
                            <Settings className="icon-m icon-t-g" />
                            <span className="text">Settings</span>
                            {settingOpen ? (
                                <span>
                                    <KeyboardArrowUp className="icon-m icon-right" />
                                </span>
                            ) : (
                                <span>
                                    <KeyboardArrowDown className="icon-m icon-right" />
                                </span>
                            )}
                        </li>
                        {settingOpen && (
                            <ul className="dropdown">
                                <li className="manage-item">
                                    <Link to="/profile" className="dropdown-li">Profile</Link>
                                </li>
                                <li className="manage-item">
                                    <Link to="/leaveSettings" className="dropdown-li">Leave Settings</Link>
                                </li>
                                <li className="manage-item">
                                    <Link to="/calendar" className="dropdown-li">Calendar</Link>
                                </li>
                                <li className="manage-item">
                                    <Link to="/inOutTime" className="dropdown-li">In Out Time</Link>
                                </li>
                            </ul>
                        )}

                        <li className="sidebar-item">
                            <Logout className="icon-m icon-t-g" />
                            <Link to='/' className="text dropdown-li">Logout</Link>
                            {/* <span className="text">Logout</span> */}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default AdminNav;
