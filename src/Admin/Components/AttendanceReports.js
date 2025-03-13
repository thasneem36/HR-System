import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Table, DatePicker, Input, Select, Row, Col, Statistic } from "antd";
import moment from "moment";
import ExportButtons from "./ExportButtons";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const { RangePicker } = DatePicker;
const { Option } = Select;

const AttendanceReports = () => {
  const [dateRange, setDateRange] = useState([moment().startOf("month"), moment().endOf("month")]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const attendanceData = {
    labels: ["HR", "IT", "Finance", "Admin"],
    datasets: [
      {
        label: "Attendance Rate (%)",
        data: [85, 90, 78, 88],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const attendanceTrendsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Attendance Rate",
        data: [90, 85, 88, 92, 87, 89],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const columns = [
    { title: "Employee", dataIndex: "employee", key: "employee" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Attendance (%)", dataIndex: "attendance", key: "attendance", sorter: (a, b) => a.attendance - b.attendance },
  ];

  const dataSource = [
    { employee: "John", department: "HR", attendance: 90 },
    { employee: "Alice", department: "IT", attendance: 85 },
    { employee: "Bob", department: "Finance", attendance: 78 },
    { employee: "Eve", department: "Admin", attendance: 88 },
  ];

  const filteredData = dataSource.filter(
    (item) =>
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (departmentFilter === "All" || item.department === departmentFilter)
  );

  return (
    <div>
      <h2>Attendance Reports</h2>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <RangePicker value={dateRange} onChange={(dates) => setDateRange(dates)} style={{ width: "100%" }} />
        </Col>
        <Col span={8}>
          <Input placeholder="Search Employee" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </Col>
        <Col span={8}>
          <Select value={departmentFilter} onChange={(value) => setDepartmentFilter(value)} style={{ width: "100%" }}>
            <Option value="All">All Departments</Option>
            <Option value="HR">HR</Option>
            <Option value="IT">IT</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Admin">Admin</Option>
          </Select>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <h3>Attendance by Department</h3>
          <Pie data={attendanceData} />
        </Col>
        <Col span={12}>
          <h3>Monthly Attendance Trends</h3>
          <Bar data={attendanceTrendsData} />
        </Col>
      </Row>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />
      {/* Export Buttons */}
      <ExportButtons dataSource={filteredData} columns={columns} reportType="attendance" />
    </div>
  );
};

export default AttendanceReports;
