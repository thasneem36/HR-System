import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css';

function NotificationsPage() {
  const navigate = useNavigate();
  const notifications = [
    {
      id: 1,
      message: "Your leave request has been approved",
      timestamp: "2024-03-20 10:30 AM",
      type: "success"
    },
    {
      id: 2,
      message: "New leave policy update available",
      timestamp: "2024-03-19 02:15 PM",
      type: "info"
    },
    {
      id: 3,
      message: "Your leave request is pending approval",
      timestamp: "2024-03-18 09:45 AM",
      type: "warning"
    }
  ];

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
          Back
        </button>
        <h1>Notifications</h1>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <i className="fas fa-bell-slash"></i>
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{notification.timestamp}</span>
              </div>
              <div className="notification-icon">
                {notification.type === 'success' && <i className="fas fa-check-circle"></i>}
                {notification.type === 'info' && <i className="fas fa-info-circle"></i>}
                {notification.type === 'warning' && <i className="fas fa-exclamation-circle"></i>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsPage; 