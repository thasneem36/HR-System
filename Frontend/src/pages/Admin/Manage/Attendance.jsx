import React, { useState } from "react";
import '../../AdminStyles/AttendanceTable.css';
import AdminNav from '../../../navbars/AdminNav';


// Optional: Helper function to convert 24h time to AM/PM format
const formatAMPM = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? "PM" : "AM";
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
};

const AttendanceTable = () => {
  const initialData = [
    {
      date: "2025-03-19",
      empId: 1,
      name: "Thasneem",
      department: "IT",
      checkIn: "09:30",
      checkOut: "10:30",
    },
    {
      date: "2025-03-20",
      empId: 2,
      name: "Ameen",
      department: "HR",
      checkIn: "09:15",
      checkOut: "17:00",
    },
    {
      date: "2025-03-21",
      empId: 1,
      name: "Thasneem",
      department: "IT",
      checkIn: "09:10",
      checkOut: "17:15",
    },
  ];

  const [attendanceData, setAttendanceData] = useState(initialData);
  const [filterId, setFilterId] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCheckIn, setFilterCheckIn] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState("");

  const handleFilter = () => {
    const filtered = initialData.filter((entry) => {
      const matchesId = filterId ? entry.empId.toString() === filterId : true;
      const matchesMonth = filterMonth ? entry.date.startsWith(filterMonth) : true;
      const matchesDate = filterDate ? entry.date === filterDate : true;
      const matchesCheckIn = filterCheckIn ? entry.checkIn >= filterCheckIn : true;
      const matchesCheckOut = filterCheckOut ? entry.checkOut <= filterCheckOut : true;

      return (
        matchesId &&
        matchesMonth &&
        matchesDate &&
        matchesCheckIn &&
        matchesCheckOut
      );
    });

    setAttendanceData(filtered);
  };

  const handleTimeChange = (index, field, value) => {
    const updatedData = [...attendanceData];
    updatedData[index][field] = value;
    setAttendanceData(updatedData);
  };

  return (
      <>
        <AdminNav/>
      <div className="attendance-container">
      <h1 className="attendance-title">Attendance</h1>

      <div className="attendance-filters">
        <input
          className="filter-input"
          type="text"
          placeholder="Emp ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
        />

      

        <input
          className="filter-input"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

     

        <button className="filter-button" onClick={handleFilter}>
          Apply Filter
        </button>
      </div>

      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Check-in Time</th>
              <th>Check-out Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.empId}</td>
                  <td>{entry.name}</td>
                  <td>{entry.department}</td>
                  <td>
                    <input
                      type="time"
                      value={entry.checkIn}
                      onChange={(e) =>
                        handleTimeChange(index, "checkIn", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={entry.checkOut}
                      onChange={(e) =>
                        handleTimeChange(index, "checkOut", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No records found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button className="pagination-button" disabled>
            ←
          </button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button" disabled>
            →
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AttendanceTable;
