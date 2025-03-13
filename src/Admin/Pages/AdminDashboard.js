import React from "react";
import { Users, Calendar, UserCheck, UserX, BarChart3, PieChart } from "lucide-react";
import Header from "../navBar/Header";
import "../Components/Css/AdminDashboard.css";

// Mock data for demonstration
const metrics = {
  totalEmployees: 156,
  presentToday: 142,
  absentToday: 14,
  pendingLeaves: 8,
};

const recentActivities = [
  { user: "John Doe", action: "Clocked in", time: "2 minutes ago" },
  { user: "Jane Smith", action: "Updated profile", time: "15 minutes ago" },
  { user: "Mike Johnson", action: "Requested leave", time: "1 hour ago" },
  { user: "Sarah Wilson", action: "Clocked out", time: "2 hours ago" },
];

function MetricCard({ icon: Icon, title, value, color }) {
  return (
    <div className="metric-card">
      <div className="metric-content">
        <div>
          <p className="metric-text">{title}</p>
          <p className="metric-value">{value}</p>
        </div>
        <div className={`metric-icon ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function AttendanceDashboard() {
  return (
    <div className="dashboard-container">
      <Header />

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Attendance Dashboard</h1>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <MetricCard
            icon={Users}
            title="Total Employees"
            value={metrics.totalEmployees}
            color="bg-blue-500"
          />
          <MetricCard
            icon={UserCheck}
            title="Present Today"
            value={metrics.presentToday}
            color="bg-green-500"
          />
          <MetricCard
            icon={UserX}
            title="Absent Today"
            value={metrics.absentToday}
            color="bg-red-500"
          />
          <MetricCard
            icon={Calendar}
            title="Pending Leaves"
            value={metrics.pendingLeaves}
            color="bg-yellow-500"
          />
        </div>

        {/* Charts and Activity Section */}
        <div className="charts-activity-grid">
          {/* Attendance Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">Attendance Trends</h2>
              <select className="chart-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="chart-placeholder">
              <BarChart3 className="w-12 h-12 text-gray-300" />
              <p className="text-gray-400 ml-2">Attendance chart will be displayed here</p>
            </div>
          </div>

          {/* Leave Trend Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">Leave Trends</h2>
              <select className="chart-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="chart-placeholder">
              <PieChart className="w-12 h-12 text-gray-300" />
              <p className="text-gray-400 ml-2">Leave trend chart will be displayed here</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-container">
            <h2 className="activity-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="activity-user">{activity.user}</p>
                    <p className="activity-details">{activity.action} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="status-container">
          <h2 className="status-title">System Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-icon">
                <PieChart className="w-4 h-4 text-green-600" />
              </div>
              <span className="status-text">All systems operational</span>
            </div>
            <div className="status-item">
              <div className="status-icon">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
              <span className="status-text">Biometric devices connected (4/4)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceDashboard;
