import React, { useState, useEffect } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import LeaveRequestForm from '../../components/EmployeeRM/LeaveRequestForm';
import Profile from '../../components/EmployeeRM/Profile';
import Logo from '../../assets/ICST.png';
import profilePic from '../../assets/profile.jpg';
import { useLeaveContext } from '../../components/EmployeeRM/LeaveContext';
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const {
    leaveRequests = [],
    notifications = [],
    successMessage,
    setSuccessMessage,
    addLeaveRequest
  } = useLeaveContext() || {};

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCloseModal = () => {
    setActiveComponent(null);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/');
  };

  const leaveStats = {
    total: 10,
    balance: 2,
    accepted: 5,
    rejected: 4,
    pending: 3
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <div className="top-right">
          <NotificationsIcon 
            className="notification-icon"
            onClick={() => setShowNotifications(true)}
          />
          <div 
            className="profile-section"
            onClick={() => setActiveComponent('profile')}
          >
            <AccountCircle className="profile-icon" />
          </div>
          <button 
            className="logout-button"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogoutIcon className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <hr className="divider" />

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="profile-container">
        <div className="profile-info">
          <p><strong>ID:</strong> 123456</p>
          <p><strong>Name:</strong> Thasneem</p>
          <p><strong>Department:</strong> Dev Team</p>
        </div>
        <div className="profile-image-container">
          <img
            src={profilePic}
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>

      {/* Leave Summary */}
      <div className="leave-summary">
        <button
          className="request-leave-btn"
          onClick={() => navigate('/request-leave')}
        >
          Request Leave
        </button>
        <div className="stats-container">
          {[['total leaves', leaveStats.total],
            ['Balance', leaveStats.balance],
            ['Accepted', leaveStats.accepted],
            ['Rejected', leaveStats.rejected],
            ['pending', leaveStats.pending]
          ].map(([label, value]) => (
            <div key={label} className="stat-card">
              <p className="stat-label">{label}</p>
              <p className="stat-value">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leave Table */}
      <h2 className="section-title">Recent Leave</h2>
      <div className="table-container">
        <table className="leave-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Type</th>
              <th>No. of leave days</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests && leaveRequests.length > 0
              ? leaveRequests.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.startDate}</td>
                  <td>{row.endDate}</td>
                  <td>{row.leaveType}</td>
                  <td>
                    {Math.ceil(
                      (new Date(row.endDate) - new Date(row.startDate)) /
                      (1000 * 60 * 60 * 24)
                    ) + 1}
                  </td>
                  <td>
                    <span className={`status ${row.reportingManagerStatus?.toLowerCase()}`}>
                      {row.reportingManagerStatus || 'Pending'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="no-data">No recent leave requests</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Conditional Components */}
      <div className="modal-container">
        {activeComponent === 'requestLeave' && (
          <div className="modal leave-request-modal">
            <div className="modal-content">
              <LeaveRequestForm onClose={() => setActiveComponent(null)} />
            </div>
          </div>
        )}
        <Profile 
          open={activeComponent === 'profile'} 
          onClose={handleCloseModal} 
        />
      </div>

      {/* Notification Modal */}
      {showNotifications && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h3>Notifications</h3>
            {notifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              notifications.map((note, index) => (
                <div key={index} className="notification-item">
                  <p>{note.message}</p>
                  <p className="notification-time">{note.timestamp}</p>
                </div>
              ))
            )}
            <button 
              className="close-btn"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
