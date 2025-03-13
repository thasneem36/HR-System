import React, { useState } from "react";
import "./Css/Attendance.css";
import { Link } from "react-router-dom";
import Header from "../navBar/Header";


function ManualAttendance() {
    // State to store form data
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        date: "",
        checkin: "",
        checkout: "",
        hours: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Attendance Data:", formData);
        alert("Attendance Added Successfully!");
        setFormData({ id: "", name: "", date: "", checkin: "", checkout: "", hours: "" }); // Reset form
    };

    return (
        <div className="AMPdashboard">
            <Header />
                    <h2>Manual Attendance Entry</h2>
            <header className="attendanceHeader">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Attendance Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/attendance-records">Attendance Records</Link>
                        </li>
                        <li className="active">
                            <Link to="/manual-attendance">Manual Attendance Entry</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <main>
                <div className="container"> 
                    <form id="attendanceForm" onSubmit={handleSubmit}>
                        <label htmlFor="id">ID:</label>
                        <input
                            type="number"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="checkin">Check-In Time:</label>
                        <input
                            type="time"
                            id="checkin"
                            name="checkin"
                            value={formData.checkin}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="checkout">Check-Out Time:</label>
                        <input
                            type="time"
                            id="checkout"
                            name="checkout"
                            value={formData.checkout}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="hours">Working Hours:</label>
                        <input
                            type="number"
                            id="hours"
                            name="hours"
                            value={formData.hours}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">Add Attendance</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ManualAttendance;
