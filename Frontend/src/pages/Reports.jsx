import { useState, useEffect, useCallback } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, MenuItem, Paper, Tab, Tabs, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { reportAPI, lookupAPI, employeeAPI } from '../services/api';

const BRAND = '#941936';
const STATUS_COLOR = { Approved: 'success', Pending: 'warning', Rejected: 'error' };
const ATT_STATUS_COLOR = { present: 'success', absent: 'error', late: 'warning', half_day: 'info' };

const SummaryCard = ({ label, value, color }) => (
  <Card sx={{ borderLeft: `4px solid ${color}` }}>
    <CardContent sx={{ py: '12px !important' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700}>{value}</Typography>
    </CardContent>
  </Card>
);

const downloadCSV = (rows, filename) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => `"${r[h] ?? ''}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ─── Attendance Report Tab ────────────────────────────────────────────────────
const AttendanceReport = ({ employees }) => {
  const now = new Date();
  const [filters, setFilters] = useState({
    employee_id: '',
    month: now.getMonth() + 1,
    year:  now.getFullYear(),
  });
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (f) => (e) => setFilters((p) => ({ ...p, [f]: e.target.value }));

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { month: filters.month, year: filters.year };
      if (filters.employee_id) params.employee_id = filters.employee_id;
      const res = await reportAPI.attendance(params);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to load report');
    } finally { setLoading(false); }
  }, [filters]);

  const handleExport = () => {
    if (!data?.records?.length) return;
    const rows = data.records.map((r) => ({
      Employee:   `${r.employee?.first_name ?? ''} ${r.employee?.last_name ?? ''}`.trim(),
      Date:       r.date,
      'Check In': r.check_in ?? '',
      'Check Out':r.check_out ?? '',
      Status:     r.status,
      Notes:      r.notes ?? '',
    }));
    downloadCSV(rows, `attendance-${filters.year}-${String(filters.month).padStart(2, '0')}.csv`);
  };

  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const years  = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>Filter Attendance</Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={4}>
            <TextField fullWidth select label="Employee (optional)" value={filters.employee_id} onChange={set('employee_id')}>
              <MenuItem value="">All Employees</MenuItem>
              {employees.map((e) => <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth select label="Month" value={filters.month} onChange={set('month')}>
              {months.map((m, i) => <MenuItem key={i+1} value={i+1}>{m}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField fullWidth select label="Year" value={filters.year} onChange={set('year')}>
              {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box display="flex" gap={1}>
              <Button fullWidth variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}
                sx={{ bgcolor: BRAND }} disabled={loading}>
                {loading ? 'Loading…' : 'Generate'}
              </Button>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}
                disabled={!data?.records?.length}>CSV</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>}

      {data && !loading && (
        <>
          {/* Summary */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} sm={3}><SummaryCard label="Total Records" value={data.total}    color={BRAND} /></Grid>
            <Grid item xs={6} sm={3}><SummaryCard label="Present"       value={data.present}  color="#2e7d32" /></Grid>
            <Grid item xs={6} sm={3}><SummaryCard label="Absent"        value={data.absent}   color="#c62828" /></Grid>
            <Grid item xs={6} sm={3}><SummaryCard label="Late"          value={data.late}     color="#e65100" /></Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.records.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No records found</TableCell></TableRow>
                ) : data.records.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.employee?.first_name} {r.employee?.last_name}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.check_in ?? '—'}</TableCell>
                    <TableCell>{r.check_out ?? '—'}</TableCell>
                    <TableCell>
                      <Chip label={r.status} size="small" color={ATT_STATUS_COLOR[r.status] ?? 'default'} />
                    </TableCell>
                    <TableCell>{r.notes ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

// ─── Leave Report Tab ─────────────────────────────────────────────────────────
const LeaveReport = ({ employees, leaveTypes }) => {
  const now = new Date();
  const [filters, setFilters] = useState({
    employee_id:    '',
    leave_type_id:  '',
    status:         '',
    start_date:     `${now.getFullYear()}-01-01`,
    end_date:       now.toISOString().split('T')[0],
  });
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (f) => (e) => setFilters((p) => ({ ...p, [f]: e.target.value }));

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.employee_id)   params.employee_id   = filters.employee_id;
      if (filters.leave_type_id) params.leave_type_id = filters.leave_type_id;
      if (filters.status)        params.status        = filters.status;
      if (filters.start_date)    params.start_date    = filters.start_date;
      if (filters.end_date)      params.end_date      = filters.end_date;
      const res = await reportAPI.leave(params);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to load report');
    } finally { setLoading(false); }
  }, [filters]);

  const handleExport = () => {
    if (!data?.records?.length) return;
    const rows = data.records.map((r) => ({
      Employee:   `${r.employee?.first_name ?? ''} ${r.employee?.last_name ?? ''}`.trim(),
      'Leave Type': r.leave_type?.name ?? '',
      'Start Date': r.start_date,
      'End Date':   r.end_date,
      Days:         r.total_days,
      Status:       r.leave_status?.name ?? '',
      Reason:       r.reason ?? '',
    }));
    downloadCSV(rows, `leave-report-${filters.start_date}-to-${filters.end_date}.csv`);
  };

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>Filter Leave Requests</Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={4}>
            <TextField fullWidth select label="Employee (optional)" value={filters.employee_id} onChange={set('employee_id')}>
              <MenuItem value="">All Employees</MenuItem>
              {employees.map((e) => <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth select label="Leave Type (optional)" value={filters.leave_type_id} onChange={set('leave_type_id')}>
              <MenuItem value="">All Types</MenuItem>
              {leaveTypes.map((lt) => <MenuItem key={lt.id} value={lt.id}>{lt.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField fullWidth select label="Status" value={filters.status} onChange={set('status')}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth label="From" type="date" value={filters.start_date} onChange={set('start_date')} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth label="To" type="date" value={filters.end_date} onChange={set('end_date')} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box display="flex" gap={1}>
              <Button fullWidth variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}
                sx={{ bgcolor: BRAND }} disabled={loading}>
                {loading ? 'Loading…' : 'Generate'}
              </Button>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}
                disabled={!data?.records?.length}>CSV</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>}

      {data && !loading && (
        <>
          {/* Summary */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} sm={2}><SummaryCard label="Total"       value={data.summary?.total}      color={BRAND} /></Grid>
            <Grid item xs={6} sm={2}><SummaryCard label="Approved"    value={data.summary?.approved}   color="#2e7d32" /></Grid>
            <Grid item xs={6} sm={2}><SummaryCard label="Pending"     value={data.summary?.pending}    color="#e65100" /></Grid>
            <Grid item xs={6} sm={2}><SummaryCard label="Rejected"    value={data.summary?.rejected}   color="#c62828" /></Grid>
            <Grid item xs={6} sm={4}><SummaryCard label="Total Days"  value={data.summary?.total_days} color="#1565c0" /></Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {/* Table */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.records.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No records found</TableCell></TableRow>
                ) : data.records.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.employee?.first_name} {r.employee?.last_name}</TableCell>
                    <TableCell>{r.leave_type?.name}</TableCell>
                    <TableCell>{r.start_date}</TableCell>
                    <TableCell>{r.end_date}</TableCell>
                    <TableCell>{r.total_days}</TableCell>
                    <TableCell sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.reason ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Chip label={r.leave_status?.name} size="small"
                        color={STATUS_COLOR[r.leave_status?.name] ?? 'default'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

// ─── Main Reports Page ────────────────────────────────────────────────────────
const Reports = () => {
  const [tab, setTab]             = useState(0);
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    Promise.all([
      employeeAPI.getAll({ per_page: 500 }),
      lookupAPI.leaveTypes(),
    ]).then(([empRes, ltRes]) => {
      setEmployees(empRes.data?.data ?? []);
      setLeaveTypes(ltRes.data ?? []);
    }).catch(() => {});
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Reports</Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}
          TabIndicatorProps={{ style: { backgroundColor: BRAND } }}>
          <Tab label="Attendance Report" sx={{ '&.Mui-selected': { color: BRAND } }} />
          <Tab label="Leave Report"      sx={{ '&.Mui-selected': { color: BRAND } }} />
        </Tabs>
      </Paper>

      {tab === 0 && <AttendanceReport employees={employees} />}
      {tab === 1 && <LeaveReport employees={employees} leaveTypes={leaveTypes} />}
    </Box>
  );
};

export default Reports;
