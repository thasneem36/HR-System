import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const performanceData = {
  labels: ["John", "Alice", "Bob", "Eve"],
  datasets: [
    {
      label: "Performance Ratings",
      data: [4.5, 3.8, 4.2, 4.0],
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderColor: "rgba(153, 102, 255, 1)",
    },
  ],
};

const PerformanceReports = () => {
  return (
    <div>
      <h2>Employee Performance Ratings</h2>
      <Bar data={performanceData} />
    </div>
  );
};

export default PerformanceReports;