import React from "react";
import { BarChart, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import Header from "../navBar/Header";
import { Bar } from "react-chartjs-2"; // Changed from Line to Bar
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registering necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // Added BarElement

// Card Component with inline styles
const Card = ({ children, style }) => (
  <div
    style={{
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      ...style,
    }}
  >
    {children}
  </div>
);

// AttendanceDashboard Component with inline styles
const AttendanceDashboard = () => {
  // Data for the attendance trends chart
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], // Example months
    datasets: [
      {
        label: "Attendance Trends",
        data: [95, 90, 85, 88, 92, 94, 93], // Example attendance data
        backgroundColor: "rgba(0, 123, 255, 0.6)", // Blue color for bars
        borderColor: "#007bff", // Border color for bars
        borderWidth: 1, // Border width for bars
      },
    ],
  };

  // Options for the chart (customized for better styling)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      title: {
        display: true,
        text: "Monthly Attendance Trend",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#1d1d1d", // Dark gray color for title
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff", // White background for tooltip
        titleColor: "#1d1d1d", // Dark gray for tooltip title
        bodyColor: "#555555", // Gray for tooltip body
        borderColor: "#e0e0e0", // Light gray border
        borderWidth: 1,
      },
      legend: {
        display: true,
        position: "top", // Position legend at the top
        labels: {
          color: "#1d1d1d", // Dark gray for legend text
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
          color: "#555555", // Gray for axis title
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          color: "#555555", // Gray for axis ticks
        },
      },
      y: {
        title: {
          display: true,
          text: "Attendance Percentage",
          color: "#555555", // Gray for axis title
          font: {
            size: 14,
            weight: "bold",
          },
        },
        beginAtZero: true,
        max: 100,
        grid: {
          color: "#e0e0e0", // Light gray for grid lines
        },
        ticks: {
          color: "#555555", // Gray for axis ticks
        },
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        position: "relative",
      }}
    >
      {/* Main Content */}
      <div
        style={{
          marginLeft: "320px",
          padding: "20px",
          width: "calc(100% - 320px)",
        }}
      >
        {/* Header Section */}
        <header style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1d1d1d" }}>
            Attendance Dashboard
          </h1>
          <p style={{ fontSize: "1rem", color: "#555555" }}>
            Overview of employee attendance
          </p>
        </header>

        {/* Metrics Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Total Employees Card */}
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "1rem", color: "#555555" }}>
                  Total Employees
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#1d1d1d",
                  }}
                >
                  150
                </p>
              </div>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#007bff",
                }}
              >
                <Users style={{ width: "24px", height: "24px", color: "#ffffff" }} />
              </div>
            </div>
          </Card>

          {/* Present Today Card */}
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "1rem", color: "#555555" }}>
                  Present Today
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#1d1d1d",
                  }}
                >
                  120
                </p>
              </div>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#28a745",
                }}
              >
                <CheckCircle
                  style={{ width: "24px", height: "24px", color: "#ffffff" }}
                />
              </div>
            </div>
          </Card>

          {/* Absent Today Card */}
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "1rem", color: "#555555" }}>
                  Absent Today
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#1d1d1d",
                  }}
                >
                  30
                </p>
              </div>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#ffc107",
                }}
              >
                <XCircle
                  style={{ width: "24px", height: "24px", color: "#ffffff" }}
                />
              </div>
            </div>
          </Card>

          {/* Late Arrivals Card */}
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "1rem", color: "#555555" }}>
                  Late Arrivals
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#1d1d1d",
                  }}
                >
                  10
                </p>
              </div>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#6f42c1",
                }}
              >
                <Clock style={{ width: "24px", height: "24px", color: "#ffffff" }} />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts and Activity Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Attendance Trends Card */}
          <Card
            style={{
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#1d1d1d",
                }}
              >
                Attendance Trends
              </h2>
              <select
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div
              style={{
                height: "300px", // Increased height for better visibility
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f9fafb",
                borderRadius: "10px",
                color: "#555555",
              }}
            >
              <Bar data={chartData} options={chartOptions} /> {/* Changed from Line to Bar */}
            </div>
          </Card>

          {/* Recent Activity Card */}
          <Card
            style={{
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#1d1d1d",
                marginBottom: "20px",
              }}
            >
              Recent Activity
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <Header />
              {/* Activity Items */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;