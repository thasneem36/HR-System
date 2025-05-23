import React, { createContext, useContext, useState } from 'react';

const LeaveContext = createContext();

export const useLeaveContext = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeaveContext must be used within a LeaveProvider');
  }
  return context;
};

export const LeaveProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const addLeaveRequest = (newRequest) => {
    setLeaveRequests(prev => [...prev, newRequest]);
    setSuccessMessage('Leave request submitted successfully!');
    
    // Add notification
    setNotifications(prev => [{
      message: `New leave request submitted for ${newRequest.startDate} to ${newRequest.endDate}`,
      timestamp: new Date().toLocaleString()
    }, ...prev]);
  };

  const value = {
    leaveRequests,
    notifications,
    successMessage,
    setSuccessMessage,
    addLeaveRequest
  };

  return (
    <LeaveContext.Provider value={value}>
      {children}
    </LeaveContext.Provider>
  );
};
