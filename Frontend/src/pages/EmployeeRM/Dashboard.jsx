import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveRequestForm from '../../components/EmployeeRM/LeaveRequestForm';
import LeaveRequestsPage from '../../components/EmployeeRM/LeaveRequestsPage';
import Profile from '../../components/EmployeeRM/Profile';
import Logo from '../../assets/ICST.png';
import profilePic from '../../assets/profile.jpg';
import { useLeaveContext } from '../../components/EmployeeRM/LeaveContext';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const {
    leaveRequests = [],
    notifications = [],
    successMessage,
    setSuccessMessage
  } = useLeaveContext() || {};

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const leaveStats = {
    total: 10,
    balance: 2,
    accepted: 5,
    rejected: 4,
    pending: 3
  };

  useEffect(() => {
    document.title = "Leave Management";
  }, []);

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <div className="top-bar-right">
          <div className="notifications-icon" onClick={() => setShowNotifications(true)}>
            <i className="fas fa-bell"></i>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>
          <div className="profile-section" onClick={() => setActiveComponent('profile')}>
            <i className="fas fa-user-circle"></i>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
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

      {/* Profile Info */}
      <div className="profile-info">
        <div className="profile-details">
          <p><strong>ID:</strong> 123456</p>
          <p><strong>Name:</strong> Thasneem</p>
          <p><strong>Department:</strong> Dev Team</p>
        </div>
        <div className="profile-image-container">
          <img src={profilePic} alt="Profile" className="profile-image" />
        </div>
      </div>

      {/* Leave Summary & Request Button */}
      <div className="summary-container">
        <button
          className="request-leave-button"
          onClick={() => setActiveComponent('requestLeave')}
        >
          Request Leave
        </button>

        <div className="stats-container">
          {[
            ['Total Leaves', leaveStats.total],
            ['Balance', leaveStats.balance],
            ['Accepted', leaveStats.accepted],
            ['Rejected', leaveStats.rejected],
            ['Pending', leaveStats.pending]
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
            {leaveRequests && leaveRequests.length > 0 ? (
              leaveRequests
                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                .map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.name}</td>
                    <td>{row.startDate}</td>
                    <td>{row.endDate}</td>
                    <td>{row.leaveType}</td>
                    <td>
                      {Math.ceil(
                        (new Date(row.endDate) - new Date(row.startDate)) / (1000 * 60 * 60 * 24)
                      ) + 1}
                    </td>
                    <td>
                      <span className={`status ${row.reportingManagerStatus?.toLowerCase() || 'pending'}`}>
                        {row.reportingManagerStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No recent leave requests</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Leave Details Button */}
      <div className="view-leave-button-container">
        <button
          className="view-leave-button"
          onClick={() => setActiveComponent('viewLeaveRequests')}
        >
          View Leave Requests
        </button>
      </div>

      {/* Modals for Forms & Pages */}
      <div className="modal-container">
        {activeComponent === 'requestLeave' && (
          <div className="modal-overlay">
            <div className="modal-content leave-request-modal">
              <LeaveRequestForm onClose={() => setActiveComponent(null)} />
            </div>
          </div>
        )}

        {activeComponent === 'viewLeaveRequests' && (
          <LeaveRequestsPage
            leaveRequests={leaveRequests}
            onClose={() => setActiveComponent(null)}
          />
        )}

        {activeComponent === 'profile' && (
          <Profile open={true} onClose={() => setActiveComponent(null)} />
        )}
      </div>

      {/* Notification Modal */}
      {showNotifications && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Notifications</h3>
            {notifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              notifications.map((note, index) => (
                <div key={index} className="notification-item">
                  <p>{note.message}</p>
                  <small>{note.timestamp}</small>
                </div>
              ))
            )}
            <button
              className="close-button"
              onClick={() => setShowNotifications(false)}
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
