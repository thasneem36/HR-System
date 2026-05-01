import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHrFeed } from '../hooks/useHrFeed';
import { useUserFeed } from '../hooks/useUserFeed';
import { usePolling } from '../hooks/usePolling';
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, IconButton, MenuItem, Paper, Snackbar,
  Tab, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Tabs, TextField, Tooltip, Typography,
} from '@mui/material';
import {
  Add as AddIcon, Check as ApproveIcon, Close as RejectIcon, Delete as DeleteIcon,
  ChevronLeft as PrevIcon, ChevronRight as NextIcon,
  CalendarMonth as CalIcon, TableRows as ListIcon,
  BeachAccess as LeaveIcon,
} from '@mui/icons-material';
import { leaveAPI, lookupAPI, employeeAPI } from '../services/api';
import { selectCurrentUser, selectIsHR } from '../store/authSlice';

const BRAND = '#941936';
const STATUS_COLOR = { Pending: 'warning', Approved: 'success', Rejected: 'error' };

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const EMPTY_FORM = { employee_id: '', leave_type_id: '', start_date: '', end_date: '', reason: '' };

const EMP_COLORS = [
  '#941936','#1565c0','#2e7d32','#6a1b9a','#00838f',
  '#e65100','#37474f','#c62828','#0277bd','#558b2f',
];
const empColor = (id) => EMP_COLORS[id % EMP_COLORS.length];

/* ── Leave Request Dialog ───────────────────────────────────────────────── */
const LeaveDialog = ({ open, onClose, leave, employees, leaveTypes, onSaved }) => {
  const user = useSelector(selectCurrentUser);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    if (leave) {
      setForm({ employee_id: leave.employee_id, leave_type_id: leave.leave_type_id, start_date: leave.start_date, end_date: leave.end_date, reason: leave.reason ?? '' });
    } else {
      setForm({ ...EMPTY_FORM, employee_id: user?.employee_id ?? '' });
    }
    setErrors({});
    setBalances([]);
  }, [leave, open, user]);

  useEffect(() => {
    const empId = form.employee_id;
    if (!empId) { setBalances([]); return; }
    employeeAPI.getLeaveBalance(empId)
      .then((r) => setBalances(r.data ?? []))
      .catch(() => setBalances([]));
  }, [form.employee_id]);

  const selectedBalance = balances.find((b) => b.leave_type_id === Number(form.leave_type_id));
  const requestedDays   = form.start_date && form.end_date
    ? Math.max(0, Math.round((new Date(form.end_date) - new Date(form.start_date)) / 86400000) + 1)
    : 0;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.employee_id)   e.employee_id   = ['Employee is required'];
    if (!form.leave_type_id) e.leave_type_id = ['Leave type is required'];
    if (!form.start_date)    e.start_date    = ['Start date is required'];
    if (!form.end_date)      e.end_date      = ['End date is required'];
    else if (form.start_date && form.end_date < form.start_date)
      e.end_date = ['End date must be on or after start date'];
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length) { setErrors(clientErrors); return; }
    setSaving(true);
    try {
      if (leave) await leaveAPI.update(leave.id, form);
      else        await leaveAPI.create(form);
      onSaved(leave ? 'Leave updated' : 'Leave request submitted');
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { _: err.response?.data?.message ?? 'Error' });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{leave ? 'Edit Leave Request' : 'New Leave Request'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors._ && <Alert severity="error" sx={{ mb: 2 }}>{errors._}</Alert>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth required select label="Employee" value={form.employee_id} onChange={set('employee_id')}
                error={!!errors.employee_id} helperText={errors.employee_id?.[0]}>
                {employees.map((e) => <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth required select label="Leave Type" value={form.leave_type_id} onChange={set('leave_type_id')}
                error={!!errors.leave_type_id} helperText={errors.leave_type_id?.[0]}>
                {leaveTypes.map((lt) => <MenuItem key={lt.id} value={lt.id}>{lt.name}</MenuItem>)}
              </TextField>
              {selectedBalance && (
                <Box sx={{ mt: 1, p: 1.5, borderRadius: 1.5, bgcolor: selectedBalance.remaining_days < requestedDays ? '#fff3e0' : '#e8f5e9', border: '1px solid', borderColor: selectedBalance.remaining_days < requestedDays ? '#ffb74d' : '#81c784' }}>
                  <Typography variant="caption" fontWeight={600} color={selectedBalance.remaining_days < requestedDays ? 'warning.dark' : 'success.dark'}>
                    {selectedBalance.remaining_days < requestedDays
                      ? `⚠️ Insufficient balance — only ${selectedBalance.remaining_days} day(s) remaining`
                      : `✅ ${selectedBalance.remaining_days} day(s) available (${selectedBalance.used_days} used of ${selectedBalance.total_days} total)`}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Start Date" type="date" value={form.start_date} onChange={set('start_date')} InputLabelProps={{ shrink: true }} error={!!errors.start_date} helperText={errors.start_date?.[0]} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="End Date" type="date" value={form.end_date} onChange={set('end_date')} InputLabelProps={{ shrink: true }} error={!!errors.end_date} helperText={errors.end_date?.[0]} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={3} label="Reason" value={form.reason} onChange={set('reason')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: BRAND }}>
            {saving ? 'Submitting...' : leave ? 'Update' : 'Submit Request'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

/* ── Reject Dialog ──────────────────────────────────────────────────────── */
const RejectDialog = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setSaving(true);
    await onConfirm(reason);
    setSaving(false);
    setReason('');
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reject Leave</DialogTitle>
      <DialogContent>
        <TextField fullWidth required multiline rows={3} label="Rejection Reason" value={reason} onChange={(e) => setReason(e.target.value)} sx={{ mt: 1 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleConfirm} disabled={saving || !reason.trim()}>
          {saving ? 'Rejecting...' : 'Reject'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ── Day Detail Dialog ──────────────────────────────────────────────────── */
const DayDetailDialog = ({ open, onClose, date, leaves }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>
      <Box display="flex" alignItems="center" gap={1}>
        <LeaveIcon sx={{ color: BRAND }} />
        {date ? new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
      </Box>
    </DialogTitle>
    <DialogContent>
      {leaves.length === 0 ? (
        <Typography color="text.secondary" variant="body2">No leaves on this day</Typography>
      ) : leaves.map((l) => {
        const name = `${l.employee?.first_name ?? ''} ${l.employee?.last_name ?? ''}`.trim();
        const statusName = l.leave_status?.name ?? l.leaveStatus?.name ?? '—';
        return (
          <Box key={l.id} display="flex" alignItems="center" gap={1.5} mb={1.5}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: empColor(l.employee_id), fontSize: 13, fontWeight: 700 }}>
              {l.employee?.first_name?.[0]}{l.employee?.last_name?.[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="body2" fontWeight={600}>{name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {l.leave_type?.name ?? l.leaveType?.name} · {fmt(l.start_date)} – {fmt(l.end_date)} ({l.total_days}d)
              </Typography>
            </Box>
            <Chip label={statusName} size="small" color={STATUS_COLOR[statusName] ?? 'default'} />
          </Box>
        );
      })}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

/* ── Leave Calendar ─────────────────────────────────────────────────────── */
const LeaveCalendar = ({ allLeaves }) => {
  const now = new Date();
  const [viewYear,      setViewYear]      = useState(now.getFullYear());
  const [viewMonth,     setViewMonth]     = useState(now.getMonth());
  const [detailDay,     setDetailDay]     = useState(null);
  const [statusFilter,  setStatusFilter]  = useState('Approved');

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const leaveMap = {};
  const filtered = allLeaves.filter((l) => {
    const sn = l.leave_status?.name ?? l.leaveStatus?.name;
    return !statusFilter || sn === statusFilter;
  });

  filtered.forEach((leave) => {
    if (!leave.start_date || !leave.end_date) return;
    const start = new Date(leave.start_date + 'T00:00:00');
    const end   = new Date(leave.end_date   + 'T00:00:00');
    const cur   = new Date(start);
    while (cur <= end) {
      const key = cur.toISOString().split('T')[0];
      if (!leaveMap[key]) leaveMap[key] = [];
      leaveMap[key].push(leave);
      cur.setDate(cur.getDate() + 1);
    }
  });

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr    = now.toISOString().split('T')[0];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    cells.push(`${viewYear}-${mm}-${dd}`);
  }

  const detailLeaves = detailDay ? (leaveMap[detailDay] ?? []) : [];

  const visibleEmployees = [];
  const seenIds = new Set();
  filtered.forEach((l) => {
    if (!seenIds.has(l.employee_id)) {
      seenIds.add(l.employee_id);
      visibleEmployees.push(l);
    }
  });

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={prevMonth}><PrevIcon /></IconButton>
          <Typography variant="h6" fontWeight={700} sx={{ minWidth: 180, textAlign: 'center' }}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Typography>
          <IconButton size="small" onClick={nextMonth}><NextIcon /></IconButton>
          <Button size="small" variant="outlined" sx={{ textTransform: 'none', ml: 1 }}
            onClick={() => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); }}>
            Today
          </Button>
        </Box>
        <TextField select size="small" label="Status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </TextField>
      </Box>

      {visibleEmployees.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {visibleEmployees.map((l) => {
            const name = `${l.employee?.first_name ?? ''} ${l.employee?.last_name ?? ''}`.trim();
            return (
              <Chip
                key={l.employee_id}
                avatar={<Avatar sx={{ bgcolor: empColor(l.employee_id) + ' !important', fontSize: 10, fontWeight: 700 }}>{l.employee?.first_name?.[0]}{l.employee?.last_name?.[0]}</Avatar>}
                label={name}
                size="small"
                variant="outlined"
                sx={{ fontSize: 11 }}
              />
            );
          })}
        </Box>
      )}

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" sx={{ bgcolor: BRAND }}>
          {WEEKDAYS.map((d) => (
            <Box key={d} sx={{ py: 1, textAlign: 'center' }}>
              <Typography variant="caption" fontWeight={700} color="#fff">{d}</Typography>
            </Box>
          ))}
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          {cells.map((dateStr, idx) => {
            if (!dateStr) {
              return <Box key={`blank-${idx}`} sx={{ minHeight: 80, borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa' }} />;
            }
            const dayLeaves = leaveMap[dateStr] ?? [];
            const isToday   = dateStr === todayStr;
            const dayNum    = parseInt(dateStr.split('-')[2], 10);
            const isWeekend = [0, 6].includes(new Date(dateStr + 'T00:00:00').getDay());

            return (
              <Box
                key={dateStr}
                onClick={() => dayLeaves.length > 0 && setDetailDay(dateStr)}
                sx={{
                  minHeight: 80, p: 0.75,
                  borderRight: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0',
                  bgcolor: isWeekend ? '#fafafa' : '#fff',
                  cursor: dayLeaves.length > 0 ? 'pointer' : 'default',
                  '&:hover': dayLeaves.length > 0 ? { bgcolor: '#fff8f9' } : {},
                }}
              >
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5, bgcolor: isToday ? BRAND : 'transparent' }}>
                  <Typography variant="caption" fontWeight={isToday ? 800 : 500} color={isToday ? '#fff' : isWeekend ? 'text.disabled' : 'text.primary'}>
                    {dayNum}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={0.3}>
                  {dayLeaves.slice(0, 3).map((l) => (
                    <Box key={l.id} sx={{ bgcolor: empColor(l.employee_id), borderRadius: 0.5, px: 0.5, py: 0.2, overflow: 'hidden' }}>
                      <Typography variant="caption" sx={{ color: '#fff', fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3, display: 'block' }}>
                        {l.employee?.first_name ?? ''}
                      </Typography>
                    </Box>
                  ))}
                  {dayLeaves.length > 3 && (
                    <Typography variant="caption" sx={{ fontSize: 9, color: 'text.secondary', pl: 0.5 }}>
                      +{dayLeaves.length - 3} more
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
        {filtered.length} leave request{filtered.length !== 1 ? 's' : ''} in {MONTH_NAMES[viewMonth]} {viewYear}
        {statusFilter ? ` · ${statusFilter}` : ''}
      </Typography>

      <DayDetailDialog open={!!detailDay} onClose={() => setDetailDay(null)} date={detailDay} leaves={detailLeaves} />
    </Box>
  );
};

/* ── Main Leaves Page ───────────────────────────────────────────────────── */
const Leaves = () => {
  const isHR   = useSelector(selectIsHR);
  const [tab, setTab]               = useState(0);
  const [rows, setRows]             = useState([]);
  const [allLeaves, setAllLeaves]   = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(0);
  const [perPage, setPerPage]       = useState(15);
  const [employees, setEmployees]   = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [dialog, setDialog]         = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [toast, setToast]           = useState({ open: false, msg: '', sev: 'success' });

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  const fetchRefs = useCallback(async () => {
    try {
      const [lt, empRes] = await Promise.all([lookupAPI.leaveTypes(), employeeAPI.getAll({ per_page: 500 })]);
      setLeaveTypes(lt.data ?? []);
      setEmployees(empRes.data?.data ?? []);
    } catch (_) {}
  }, []);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const [paged, all] = await Promise.all([
        leaveAPI.getAll({ page: page + 1, per_page: perPage }),
        leaveAPI.getAll({ per_page: 500 }),
      ]);
      setRows(paged.data?.data ?? []);
      setTotal(paged.data?.total ?? 0);
      setAllLeaves(all.data?.data ?? []);
    } catch (_) { showToast('Failed to load leaves', 'error'); }
    finally { setLoading(false); }
  }, [page, perPage]);

  useEffect(() => { fetchRefs(); }, [fetchRefs]);
  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  useHrFeed({ 'leave.requested': () => fetchLeaves() });
  useUserFeed({ 'leave.status.updated': () => fetchLeaves() });
  usePolling(fetchLeaves, 30000);

  const handleApprove = async (leave) => {
    try { await leaveAPI.approve(leave.id); showToast('Leave approved'); fetchLeaves(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Approve failed', 'error'); }
  };

  const handleReject = async (reason) => {
    try {
      await leaveAPI.reject(selected.id, { rejection_reason: reason });
      showToast('Leave rejected');
      setRejectDialog(false);
      setSelected(null);
      fetchLeaves();
    } catch (err) { showToast(err.response?.data?.message ?? 'Reject failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this leave request?')) return;
    try { await leaveAPI.delete(id); showToast('Leave request cancelled'); fetchLeaves(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Delete failed', 'error'); }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Leave Requests</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: BRAND }}
          onClick={() => { setSelected(null); setDialog(true); }}>
          New Request
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 1 }}
          TabIndicatorProps={{ style: { backgroundColor: BRAND } }}>
          <Tab icon={<ListIcon fontSize="small" />} iconPosition="start" label="List"
            sx={{ textTransform: 'none', fontWeight: 600, minHeight: 48, '&.Mui-selected': { color: BRAND } }} />
          <Tab icon={<CalIcon fontSize="small" />} iconPosition="start" label="Calendar"
            sx={{ textTransform: 'none', fontWeight: 600, minHeight: 48, '&.Mui-selected': { color: BRAND } }} />
        </Tabs>

        <Box sx={{ p: tab === 1 ? 2 : 0 }}>
          {tab === 0 && (
            <TableContainer>
              {loading ? (
                <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
              ) : (
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      {isHR && <TableCell>Employee</TableCell>}
                      <TableCell>Leave Type</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell>Days</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow><TableCell colSpan={isHR ? 8 : 7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No leave requests found</TableCell></TableRow>
                    ) : rows.map((leave) => {
                      const statusName = leave.leave_status?.name ?? leave.leaveStatus?.name;
                      const isPending  = statusName === 'Pending';
                      return (
                        <TableRow key={leave.id} hover>
                          {isHR && <TableCell>{leave.employee?.first_name} {leave.employee?.last_name}</TableCell>}
                          <TableCell>{leave.leave_type?.name ?? leave.leaveType?.name}</TableCell>
                          <TableCell>{fmt(leave.start_date)}</TableCell>
                          <TableCell>{fmt(leave.end_date)}</TableCell>
                          <TableCell>{leave.total_days}</TableCell>
                          <TableCell sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {leave.reason ?? '—'}
                          </TableCell>
                          <TableCell>
                            <Chip label={statusName ?? '—'} size="small" color={STATUS_COLOR[statusName] ?? 'default'} />
                          </TableCell>
                          <TableCell align="center">
                            {isHR && isPending && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton size="small" color="success" onClick={() => handleApprove(leave)}><ApproveIcon fontSize="small" /></IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton size="small" color="error" onClick={() => { setSelected(leave); setRejectDialog(true); }}><RejectIcon fontSize="small" /></IconButton>
                                </Tooltip>
                              </>
                            )}
                            {isPending && (
                              <Tooltip title="Cancel">
                                <IconButton size="small" color="error" onClick={() => handleDelete(leave.id)}><DeleteIcon fontSize="small" /></IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
              <TablePagination rowsPerPageOptions={[15, 30, 60]} component="div" count={total} rowsPerPage={perPage} page={page}
                onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setPerPage(+e.target.value); setPage(0); }} />
            </TableContainer>
          )}

          {tab === 1 && (
            loading
              ? <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
              : <LeaveCalendar allLeaves={allLeaves} />
          )}
        </Box>
      </Paper>

      <LeaveDialog open={dialog} onClose={() => setDialog(false)} leave={selected} employees={employees} leaveTypes={leaveTypes}
        onSaved={(msg) => { showToast(msg); fetchLeaves(); }} />
      <RejectDialog open={rejectDialog} onClose={() => { setRejectDialog(false); setSelected(null); }} onConfirm={handleReject} />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Leaves;
