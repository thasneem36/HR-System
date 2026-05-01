import React, { useState } from "react";
import "../../AdminStyles/HolidayCalendar.css";
import AdminNav from "../../../navbars/AdminNav";

const HolidayCalendar = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [holidayName, setHolidayName] = useState("");
  const [holidays, setHolidays] = useState([
    {
      id: 1,
      name: "Avurudu",
      start: "11/4/2025",
      end: "15/4/2025",
      description: "Avurudu",
      total: 4,
    },
  ]);

  const handleAddHoliday = () => {
    if (startDate && endDate && holidayName) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const newHoliday = {
        id: holidays.length + 1,
        name: holidayName,
        start: startDate,
        end: endDate,
        description: holidayName,
        total: totalDays,
      };

      setHolidays([...holidays, newHoliday]);
      setStartDate("");
      setEndDate("");
      setHolidayName("");
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <>
    <AdminNav/>
    <div className="calendar-container">
      <h2 className="calendar-title">Holiday Calendar</h2>

      <div className="calendar-form">
        <div className="calendar-field">
          <label className="calendar-label">Start Date</label>
          <input
            type="date"
            className="calendar-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="calendar-field">
          <label className="calendar-label">End Date</label>
          <input
            type="date"
            className="calendar-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="calendar-field">
          <label className="calendar-label">Holiday Name</label>
          <input
            type="text"
            className="calendar-input"
            placeholder="Holiday Name"
            value={holidayName}
            onChange={(e) => setHolidayName(e.target.value)}
          />
        </div>

        <button className="calendar-add-btn" onClick={handleAddHoliday}>
          + Add
        </button>
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Description</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday) => (
            <tr key={holiday.id}>
              <td>{holiday.id}</td>
              <td>{holiday.name}</td>
              <td>{holiday.start}</td>
              <td>{holiday.end}</td>
              <td>{holiday.description}</td>
              <td>{holiday.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default HolidayCalendar;
