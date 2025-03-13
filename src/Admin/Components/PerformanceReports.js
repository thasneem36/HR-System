import React, { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Table, DatePicker, Input, Select, Row, Col, Statistic } from "antd";
import moment from "moment";
import ExportButtons from "./ExportButtons";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const { RangePicker } = DatePicker;
const { Option } = Select;

const PerformanceReports = () => {
  const [dateRange, setDateRange] = useState([moment().startOf("month"), moment().endOf("month")]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const performanceData = {
    labels: ["HR", "IT", "Finance", "Admin"],
    datasets: [
      {
        label: "Performance by Department",
        data: [85, 92, 88, 90],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const performanceTrendsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Performance Rating",
        data: [80, 85, 88, 90, 87, 92],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const columns = [
    { title: "Employee", dataIndex: "employee", key: "employee" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Performance Rating", dataIndex: "performance", key: "performance", sorter: (a, b) => a.performance - b.performance },
  ];

  const dataSource = [
    { employee: "John", department: "HR", performance: 85 },
    { employee: "Alice", department: "IT", performance: 92 },
    { employee: "Bob", department: "Finance", performance: 88 },
    { employee: "Eve", department: "Admin", performance: 90 },
  ];

  const filteredData = dataSource.filter(
    (item) =>
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (departmentFilter === "All" || item.department === departmentFilter)
  );

  const totalPerformance = filteredData.reduce((sum, item) => sum + item.performance, 0);
  const averagePerformance = (totalPerformance / filteredData.length).toFixed(2);

  return (
    <div>
      <h2>Performance Reports</h2>

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
          <Statistic title="Total Performance Rating" value={totalPerformance} />
        </Col>
        <Col span={8}>
          <Statistic title="Average Performance Rating" value={averagePerformance} />
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <h3>Performance by Department</h3>
          <Pie data={performanceData} />
        </Col>
        <Col span={12}>
          <h3>Monthly Performance Trends</h3>
          <Bar data={performanceTrendsData} />
        </Col>
      </Row>

      {/* Table */}
      <h3>Employee Performance</h3>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />

      {/* Export Buttons */}
      {/* Export Buttons */}
      <ExportButtons dataSource={filteredData} columns={columns} reportType="performance" />
    </div>
  );
};

export default PerformanceReports;