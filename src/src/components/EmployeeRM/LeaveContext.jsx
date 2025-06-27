import React, { createContext, useContext, useState } from 'react';

const LeaveContext = createContext();

export const useLeaveContext = () => useContext(LeaveContext);

export const LeaveProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const addLeaveRequest = (request) => {
    setLeaveRequests(prev => [...prev, request]);
    setNotifications(prev => [
      ...prev,
      {
        message: 'Leave Request Applied',
        timestamp: new Date().toLocaleString()
      }
    ]);
  };

  return (
    <LeaveContext.Provider value={{ leaveRequests, notifications, addLeaveRequest }}>
      {children}
    </LeaveContext.Provider>
  );
};
