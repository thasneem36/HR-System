import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Chip, CircularProgress,
  Grid, Paper, Skeleton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import {
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  CalendarToday as LeaveIcon,
  Business as BusinessIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { dashboardAPI, leaveAPI } from '../services/api';
import { selectCurrentUser } from '../store/authSlice';
import { useHrFeed } from '../hooks/useHrFeed';
import { useUserFeed } from '../hooks/useUserFeed';
import { usePolling } from '../hooks/usePolling';

const BRAND = '#941936';
const COLORS = ['#941936', '#1565c0', '#2e7d32', '#e65100', '#6a1b9a', '#00838f'];

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
          <Typography variant="h4" fontWeight={700}>{value ?? '—'}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
        <Box sx={{ bgcolor: `${color}18`, borderRadius: 2, p: 1 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const STATUS_COLOR = { Pending: 'warning', Approved: 'success', Rejected: 'error' };

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);

  const [stats, setStats]           = useState(null);
  const [pending, setPending]       = useState([]);
  const [attChart, setAttChart]     = useState([]);
  const [leaveChart, setLeaveChart] = useState([]);
  const [deptChart, setDeptChart]   = useState([]);
  const [loading, setLoading]       = useState(true);

  const load = useCallback(async () => {
    try {
      const [statsRes, pendingRes, attRes, leaveRes, empRes] = await Promise.all([
        dashboardAPI.stats(),
        leaveAPI.pending(),
        dashboardAPI.attendanceSummary(),
        dashboardAPI.leaveSummary(),
        dashboardAPI.employeeSummary(),
      ]);

        setStats(statsRes.data);
        setPending(pendingRes.data?.slice(0, 5) ?? []);

        // Attendance trend — last 7 days
        setAttChart(
          (attRes.data ?? []).map((d) => ({
            date: d.date?.slice(5),   // "MM-DD"
            Present: d.present,
            Absent:  d.absent,
            Late:    d.late,
          }))
        );

        // Leave by type — pie data
        const byType = leaveRes.data?.by_type ?? {};
        setLeaveChart(Object.entries(byType).map(([name, value]) => ({ name, value })));

        // Employees by department — bar data
        setDeptChart(
          (empRes.data?.by_department ?? []).map((d) => ({
            name:  d.name?.length > 12 ? d.name.slice(0, 12) + '…' : d.name,
            count: d.employees_count,
          }))
        );
      } catch (_) {}
      finally { setLoading(false); }
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Real-time: any HR-feed event refreshes dashboard stats
  useHrFeed({
    'leave.requested':  load,
    'leave.updated':    load,
    'employee.updated': load,
    'attendance.updated': load,
    'payroll.updated':  load,
  });

  // Real-time: employee's own leave status changes refresh their view
  useUserFeed({
    'leave.status.updated': load,
  });

  // Polling fallback every 30 s
  usePolling(load, 30000);

  if (loading) return (
    <Box>
      <Skeleton variant="text" width={240} height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" width={300} height={24} sx={{ mb: 3 }} />
      <Grid container spacing={3} mb={4}>
        {[...Array(5)].map((_, i) => (
          <Grid key={i} item xs={12} sm={6} md={3}>
            <Skeleton variant="rounded" height={100} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}><Skeleton variant="rounded" height={290} /></Grid>
        <Grid item xs={12} md={4}><Skeleton variant="rounded" height={290} /></Grid>
        <Grid item xs={12}><Skeleton variant="rounded" height={260} /></Grid>
      </Grid>
      <Skeleton variant="rounded" height={200} />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        Welcome back, {user?.name?.split(' ')[0]}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Here's what's happening today.
      </Typography>

      {/* Stat cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Employees"  value={stats?.total_employees}   color={BRAND}    icon={<PeopleIcon sx={{ color: BRAND }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Employees" value={stats?.active_employees}  color="#2e7d32"  icon={<ActiveIcon sx={{ color: '#2e7d32' }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Present Today"    value={stats?.present_today}     color="#1565c0"  icon={<EventNoteIcon sx={{ color: '#1565c0' }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="On Leave Today"   value={stats?.on_leave_today}    color="#e65100"  icon={<LeaveIcon sx={{ color: '#e65100' }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Departments"      value={stats?.total_departments} color="#6a1b9a"  icon={<BusinessIcon sx={{ color: '#6a1b9a' }} />} />
        </Grid>
      </Grid>

      {/* Charts row */}
      <Grid container spacing={3} mb={4}>
        {/* Attendance trend - last 7 days */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Attendance Trend (Last 7 Days)</Typography>
            {attChart.length === 0 ? (
              <Typography color="text.secondary" py={4} textAlign="center">No attendance data</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={attChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Present" stroke="#2e7d32" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="Absent"  stroke="#c62828" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="Late"    stroke="#e65100" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Leave by type - pie */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Leaves This Month (by Type)</Typography>
            {leaveChart.length === 0 ? (
              <Typography color="text.secondary" py={4} textAlign="center">No leave data</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={leaveChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {leaveChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Employees by department - bar */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Employees by Department</Typography>
            {deptChart.length === 0 ? (
              <Typography color="text.secondary" py={4} textAlign="center">No department data</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deptChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill={BRAND} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Pending leave requests */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>Pending Leave Requests</Typography>
        {pending.length === 0 ? (
          <Typography color="text.secondary">No pending leave requests.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pending.map((leave) => (
                  <TableRow key={leave.id} hover>
                    <TableCell>{leave.employee?.first_name} {leave.employee?.last_name}</TableCell>
                    <TableCell>{leave.leave_type?.name}</TableCell>
                    <TableCell>{leave.start_date}</TableCell>
                    <TableCell>{leave.end_date}</TableCell>
                    <TableCell>{leave.total_days}</TableCell>
                    <TableCell>
                      <Chip label={leave.leave_status?.name} size="small"
                        color={STATUS_COLOR[leave.leave_status?.name] ?? 'default'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
