import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, IconButton, MenuItem, Paper, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, LoginOutlined, LogoutOutlined } from '@mui/icons-material';
import { attendanceAPI, lookupAPI } from '../services/api';
import { selectCurrentUser, selectIsHR } from '../store/authSlice';
import { useHrFeed } from '../hooks/useHrFeed';
import { useUserFeed } from '../hooks/useUserFeed';
import { usePolling } from '../hooks/usePolling';

const STATUS_COLOR = { present: 'success', absent: 'error', late: 'warning', half_day: 'info' };

const EMPTY_FORM = { employee_id: '', date: new Date().toISOString().split('T')[0], check_in: '', check_out: '', status: 'present', notes: '' };

const AttendanceDialog = ({ open, onClose, record, employees, onSaved }) => {
  const [form, setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(record ? { ...EMPTY_FORM, ...record, date: record.date ?? EMPTY_FORM.date } : EMPTY_FORM);
    setErrors({});
  }, [record, open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (record) await attendanceAPI.update(record.id, form);
      else        await attendanceAPI.create(form);
      onSaved(record ? 'Attendance updated' : 'Attendance recorded');
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { _: err.response?.data?.message ?? 'Error' });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{record ? 'Edit Attendance' : 'Record Attendance'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors._ && <Alert severity="error" sx={{ mb: 2 }}>{errors._}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth required select label="Employee" value={form.employee_id} onChange={set('employee_id')}>
                {employees.map((e) => <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Date" type="date" value={form.date} onChange={set('date')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required select label="Status" value={form.status} onChange={set('status')}>
                {['present', 'absent', 'late', 'half_day'].map((s) => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Check In" type="time" value={form.check_in} onChange={set('check_in')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Check Out" type="time" value={form.check_out} onChange={set('check_out')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Notes" value={form.notes} onChange={set('notes')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: '#941936' }}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const calcHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '—';
  const [h1, m1] = checkIn.split(':').map(Number);
  const [h2, m2] = checkOut.split(':').map(Number);
  const mins = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (mins <= 0) return '—';
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const Attendance = () => {
  const isHR   = useSelector(selectIsHR);
  const user   = useSelector(selectCurrentUser);
  const [rows, setRows]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(0);
  const [perPage, setPerPage]   = useState(15);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [dialog, setDialog]     = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState({ open: false, msg: '', sev: 'success' });
  const [checkingIn, setCheckingIn] = useState(false);

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  const fetchEmployees = useCallback(async () => {
    try { const r = await lookupAPI.departments(); setEmployees(r.data ?? []); } catch (_) {}
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await attendanceAPI.getAll({ page: page + 1, per_page: perPage });
      setRows(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (_) { showToast('Failed to load attendance', 'error'); }
    finally { setLoading(false); }
  }, [page, perPage]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  // Real-time: HR sees all check-ins live; employee sees own updates
  useHrFeed({ 'attendance.updated': fetchAttendance });
  useUserFeed({ 'attendance.updated': fetchAttendance });
  usePolling(fetchAttendance, 30000);

  // Fetch actual employees for dropdown (not departments)
  const [empList, setEmpList] = useState([]);
  useEffect(() => {
    import('../services/api').then(({ employeeAPI: eAPI }) => {
      eAPI.getAll({ per_page: 500 }).then((r) => setEmpList(r.data?.data ?? []));
    });
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await attendanceAPI.checkIn({ employee_id: user?.employee_id });
      showToast('Checked in successfully');
      fetchAttendance();
    } catch (err) { showToast(err.response?.data?.message ?? 'Check-in failed', 'error'); }
    finally { setCheckingIn(false); }
  };

  const handleCheckOut = async () => {
    setCheckingIn(true);
    try {
      await attendanceAPI.checkOut({ employee_id: user?.employee_id });
      showToast('Checked out successfully');
      fetchAttendance();
    } catch (err) { showToast(err.response?.data?.message ?? 'Check-out failed', 'error'); }
    finally { setCheckingIn(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try { await attendanceAPI.delete(id); showToast('Record deleted'); fetchAttendance(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Delete failed', 'error'); }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={1}>
        <Typography variant="h5" fontWeight={700}>Attendance</Typography>
        <Box display="flex" gap={1}>
          {user?.employee_id && (
            <>
              <Button variant="outlined" startIcon={<LoginOutlined />} onClick={handleCheckIn} disabled={checkingIn}>Check In</Button>
              <Button variant="outlined" startIcon={<LogoutOutlined />} onClick={handleCheckOut} disabled={checkingIn} color="warning">Check Out</Button>
            </>
          )}
          {isHR && (
            <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#941936' }}
              onClick={() => { setSelected(null); setDialog(true); }}>Record</Button>
          )}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Status</TableCell>
                {isHR && <TableCell align="center">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No records found</TableCell></TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.employee?.first_name} {r.employee?.last_name}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.check_in ?? '—'}</TableCell>
                  <TableCell>{r.check_out ?? '—'}</TableCell>
                  <TableCell>{calcHours(r.check_in, r.check_out)}</TableCell>
                  <TableCell><Chip label={r.status} size="small" color={STATUS_COLOR[r.status] ?? 'default'} /></TableCell>
                  {isHR && (
                    <TableCell align="center">
                      <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => { setSelected(r); setDialog(true); }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(r.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination rowsPerPageOptions={[15, 30, 60]} component="div" count={total} rowsPerPage={perPage} page={page}
          onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setPerPage(+e.target.value); setPage(0); }} />
      </TableContainer>

      <AttendanceDialog open={dialog} onClose={() => setDialog(false)} record={selected} employees={empList}
        onSaved={(msg) => { showToast(msg); fetchAttendance(); }} />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Attendance;
