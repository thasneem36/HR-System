import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  Activity, 
  Wifi, 
  BarChart3, 
  PieChart, 
  UserX  
} from 'lucide-react';
import Header from '../navBar/Header';
import '../Components/Css/AdminDashboard.css';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock data for demonstration
const metrics = {
  totalEmployees: 156,
  presentToday: 142,
  pendingLeaves: 8,
  PayrollSummary: 145000
};

const recentActivities = [
  { user: "John Doe", action: "Logged in", time: "2 minutes ago" },
  { user: "Jane Smith", action: "Updated profile", time: "15 minutes ago" },
  { user: "Mike Johnson", action: "Requested leave", time: "1 hour ago" },
  { user: "Sarah Wilson", action: "Clocked in", time: "2 hours ago" },
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

function AdminDashboard() {
  const [attendanceFilter, setAttendanceFilter] = useState('Last 7 days');
  const [leaveFilter, setLeaveFilter] = useState('Last 7 days');

  // Example data for Attendance Chart
  const getAttendanceData = (filter) => {
    switch (filter) {
      case 'Last 7 days':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Present',
              data: [120, 130, 125, 140, 135, 110, 100],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Absent',
              data: [10, 15, 20, 10, 5, 25, 30],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        };
      case 'Last 30 days':
        return {
          labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
          datasets: [
            {
              label: 'Present',
              data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 150)),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Absent',
              data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30)),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        };
      case 'Last 90 days':
        return {
          labels: Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`),
          datasets: [
            {
              label: 'Present',
              data: Array.from({ length: 90 }, () => Math.floor(Math.random() * 150)),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Absent',
              data: Array.from({ length: 90 }, () => Math.floor(Math.random() * 30)),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        };
      default:
        return {
          labels: [],
          datasets: [],
        };
    }
  };

  // Example data for Leave Trend Chart
  const getLeaveData = (filter) => {
    switch (filter) {
      case 'Last 7 days':
        return {
          labels: ['Approved', 'Pending', 'Rejected'],
          datasets: [
            {
              label: 'Leaves',
              data: [20, 8, 5],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(229, 0, 50, 0.6)',
              ],
            },
          ],
        };
      case 'Last 30 days':
        return {
          labels: ['Approved', 'Pending', 'Rejected'],
          datasets: [
            {
              label: 'Leaves',
              data: [50, 20, 10],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(229, 0, 50, 0.6)',
              ],
            },
          ],
        };
      case 'Last 90 days':
        return {
          labels: ['Approved', 'Pending', 'Rejected'],
          datasets: [
            {
              label: 'Leaves',
              data: [100, 40, 20],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(229, 0, 50, 0.6)',
              ],
            },
          ],
        };
      default:
        return {
          labels: [],
          datasets: [],
        };
    }
  };

  const attendanceData = getAttendanceData(attendanceFilter);
  const leaveData = getLeaveData(leaveFilter);

  return (
    <div className="dashboard-container">
      <Header />
      
      {/* Main Content */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
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
            value={metrics.totalEmployees - metrics.presentToday}
            color="bg-red-500"
          />
          <MetricCard 
            icon={Calendar} 
            title="Pending Leaves" 
            value={metrics.pendingLeaves}
            color="bg-yellow-500"
          />
          <MetricCard 
            icon={DollarSign} 
            title="Payroll Summary" 
            value={`$${metrics.PayrollSummary}`}
            color="bg-purple-500"
          />
        </div>

        {/* Charts and Activity Section */}
        <div className="charts-activity-grid">
          {/* Attendance Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">Attendance Trends</h2>
              <select 
                className="chart-select"
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value)}
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="chart-placeholder">
              <Bar 
                data={attendanceData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          {/* Leave Trend Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">Leave Trends</h2>
              <select 
                className="chart-select"
                value={leaveFilter}
                onChange={(e) => setLeaveFilter(e.target.value)}
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="chart-placeholder">
              <Pie 
                data={leaveData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-container">
            <h2 className="activity-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <Activity className="w-4 h-4 text-gray-600" />
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
                <Wifi className="w-4 h-4 text-green-600" />
              </div>
              <span className="status-text">All systems operational</span>
            </div>
            <div className="status-item">
              <div className="status-icon">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <span className="status-text">Biometric devices connected (4/4)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;