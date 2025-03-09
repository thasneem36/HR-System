import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Table } from "antd";

ChartJS.register(ArcElement, Tooltip, Legend);

const leaveData = {
  labels: ["HR", "IT", "Finance", "Admin"],
  datasets: [
    {
      label: "Leaves by Department",
      data: [12, 19, 8, 15],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
    },
  ],
};

const columns = [
  { title: "Employee", dataIndex: "employee", key: "employee" },
  { title: "Department", dataIndex: "department", key: "department" },
  { title: "Leaves Taken", dataIndex: "leaves", key: "leaves" },
];

const dataSource = [
  { employee: "John", department: "HR", leaves: 12 },
  { employee: "Alice", department: "IT", leaves: 8 },
  { employee: "Bob", department: "Finance", leaves: 5 },
  { employee: "Eve", department: "Admin", leaves: 15 },
];

const LeaveReports = () => {
  return (
    <div>
      <h2>Leave Trends by Department</h2>
      <Pie data={leaveData} />
      <h2>Most Leaves Taken</h2>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default LeaveReports;