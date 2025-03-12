import React, { useState, useEffect } from "react";
import '../Components/LeaveManagement.css';
import Header from "../navBar/Header";

function LeaveManagement() {
  const fetchDataFromDatabase = () => {
    return {
      leaveRequests: [
        { id: 1, empId: '1000', name: 'Athnan', leaveType: 'Sick', startDate: '2025-03-09', endDate: '2025-03-20', status: 'Pending' },
        { id: 2, empId: '1001', name: 'Ayyash', leaveType: 'Vacation', startDate: '2025-03-03', endDate: '2025-03-13', status: 'Approved' },
        { id: 3, empId: '1002', name: 'Thasneem', leaveType: 'Other', startDate: '2025-03-25', endDate: '2025-03-27', status: 'Pending' },
        { id: 4, empId: '1003', name: 'Shihab', leaveType: 'Sick', startDate: '2025-03-13', endDate: '2025-03-15', status: 'Approved' }
      ],
      leaveBalance: [
        { id: 5, empId: '1004', name: 'Kotcha', remainingLeave: 5 },
        { id: 6, empId: '1005', name: 'Rifak', remainingLeave: 8 },
        { id: 7, empId: '1006', name: 'Asrif', remainingLeave: 5 },
        { id: 8, empId: '1007', name: 'Baner', remainingLeave: 5 }
      ]
    };
  };

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [todayLeaveRequests, setTodayLeaveRequests] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");

  // Fetch data when the component mounts
  useEffect(() => {
    const { leaveRequests, leaveBalance } = fetchDataFromDatabase();
    setLeaveRequests(leaveRequests);
    setLeaveBalance(leaveBalance);
    filterTodayLeaveRequests(leaveRequests);
  }, []);

  // Count the number of requests by status
  const countRequestsByStatus = (status) => {
    return leaveRequests.filter(request => request.status === status).length;
  };

  // Handle action on leave request (Approve, Reject)
  const handleRequestAction = (id, action) => {
    setLeaveRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, status: action } : request
      )
    );
  };

  // Filter leave requests based on employee ID
  const filteredLeaveRequests = leaveRequests.filter(request =>
    request.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter employees who are on leave today
  const filterTodayLeaveRequests = (leaveRequests) => {
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const todayRequests = leaveRequests.filter(request =>
      request.startDate <= today && request.endDate >= today
    );
    setTodayLeaveRequests(todayRequests);
  };

  // Filter total request leaves (This function is not fully implemented)
  const filterTotalRequestLeaves = () => {
    return leaveRequests.length;
  };

  return (
    <>
     <Header/>
     
    <div className="leave-management">
     
      {/* Title */}
      <h1>Leave Management System</h1>

      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li><button className="active" onClick={() => setActivePage("dashboard")}>Leave Dashboard</button></li>
          <li><button onClick={() => setActivePage("leaveRequests")}>Leave Request List</button></li>
          <li><button onClick={() => setActivePage("leaveBalance")}>Leave Balance</button></li>
        </ul>
      </nav>

      {/* Content */}
      <div className="content-wrapper">
        {/* Conditionally render pages based on activePage */}
        {activePage === "dashboard" && (
          <>
            <div className="leave-dashboard">
              <h2>Leave Dashboard</h2>
              <div className="dashboard-cards">
                <div className="card approved">
                  <h3>Total Leave Requests</h3>
                  <p>{filterTotalRequestLeaves()}</p>
                </div>
                <div className="card approved">
                  <h3>Approved</h3>
                  <p>{countRequestsByStatus("Approved")}</p>
                </div>
                <div className="card pending">
                  <h3>Pending</h3>
                  <p>{countRequestsByStatus("Pending")}</p>
                </div>
                <div className="card rejected">
                  <h3>Rejected</h3>
                  <p>{countRequestsByStatus("Rejected")}</p>
                </div>
              </div>
            </div>

            {/* Employees on Leave Today */}
            <div className="leave-today">
              <h2>Employees on Leave Today</h2>
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {todayLeaveRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.empId}</td>
                      <td>{request.name}</td>
                      <td>{request.leaveType}</td>
                      <td>{request.startDate}</td>
                      <td>{request.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activePage === "leaveRequests" && (
          <div className="leave-requests-table">
            <h2>Leave Requests</h2>
            
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.empId}</td>
                    <td>{request.name}</td>
                    <td>{request.leaveType}</td>
                    <td>{request.startDate}</td>
                    <td>{request.endDate}</td>
                    <td>{request.status}</td>
                    <td>
                      <button onClick={() => handleRequestAction(request.id, "Approved")} className="approve-btn">
                        Approve
                      </button>
                      <button onClick={() => handleRequestAction(request.id, "Rejected")} className="reject-btn">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activePage === "leaveBalance" && (
          <div className="leave-balance">
            <h2>Leave Balance</h2>
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Leave Type</th>
                  <th>Remaining Leave</th>
                </tr>
              </thead>
              <tbody>
                {leaveBalance.map((balance) => (
                  <tr key={balance.id}>
                    <td>{balance.empId}</td>
                    <td>{balance.name}</td>
                    <td>{balance.leaveType}</td>
                    <td>{balance.remainingLeave}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default LeaveManagement;
