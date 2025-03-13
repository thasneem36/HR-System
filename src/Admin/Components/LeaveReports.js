import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Table, DatePicker, Input, Select, Row, Col, Statistic } from "antd";
import moment from "moment";
import ExportButtons from "./ExportButtons";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const { RangePicker } = DatePicker;
const { Option } = Select;

const LeaveReports = () => {
  const [dateRange, setDateRange] = useState([moment().startOf("month"), moment().endOf("month")]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

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

  const leaveTrendsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Leaves Taken",
        data: [10, 15, 8, 12, 9, 14],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const columns = [
    { title: "Employee", dataIndex: "employee", key: "employee" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Leaves Taken", dataIndex: "leaves", key: "leaves", sorter: (a, b) => a.leaves - b.leaves },
  ];

  const dataSource = [
    { employee: "John", department: "HR", leaves: 12 },
    { employee: "Alice", department: "IT", leaves: 8 },
    { employee: "Bob", department: "Finance", leaves: 5 },
    { employee: "Eve", department: "Admin", leaves: 15 },
  ];

  const filteredData = dataSource.filter(
    (item) =>
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (departmentFilter === "All" || item.department === departmentFilter)
  );

  const totalLeaves = filteredData.reduce((sum, item) => sum + item.leaves, 0);
  const averageLeaves = (totalLeaves / filteredData.length).toFixed(2);

  return (
    <div>
      <h2>Leave Reports</h2>

      {/* Filters */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={8}>
          <Input
            placeholder="Search Employee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            value={departmentFilter}
            onChange={(value) => setDepartmentFilter(value)}
            style={{ width: "100%" }}
          >
            <Option value="All">All Departments</Option>
            <Option value="HR">HR</Option>
            <Option value="IT">IT</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Admin">Admin</Option>
          </Select>
        </Col>
      </Row>

      {/* Summary Section */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Statistic title="Total Leaves Taken" value={totalLeaves} />
        </Col>
        <Col span={8}>
          <Statistic title="Average Leaves per Employee" value={averageLeaves} />
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <h3>Leave Trends by Department</h3>
          <Pie data={leaveData} />
        </Col>
        <Col span={12}>
          <h3>Monthly Leave Trends</h3>
          <Bar data={leaveTrendsData} />
        </Col>
      </Row>

      {/* Table */}
      <h3>Most Leaves Taken</h3>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />

      {/* Export Buttons */}
      <ExportButtons dataSource={filteredData} columns={columns} reportType="leave" />    </div>
  );
};

export default LeaveReports;