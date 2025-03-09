import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const attendanceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Attendance Trends",
      data: [85, 90, 88, 92, 89, 95],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
  ],
};

const AttendanceReports = () => {
  return (
    <div>
      <h2>Monthly Attendance Trends</h2>
      <Line data={attendanceData} />
    </div>
  );
};

export default AttendanceReports;