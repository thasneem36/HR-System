import { useState, useEffect, useCallback } from 'react';
import { useHrFeed } from '../hooks/useHrFeed';
import { usePolling } from '../hooks/usePolling';
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress,
  IconButton, InputAdornment, MenuItem, Paper, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import {
  Search as SearchIcon, Refresh as RefreshIcon,
  History as AuditIcon, Clear as ClearIcon,
  Login as LoginIcon, Lock as LockIcon,
  Person as PersonIcon, AccountBalance as PayrollIcon,
  BeachAccess as LeaveIcon, Security as AdminIcon,
} from '@mui/icons-material';
import { auditAPI } from '../services/api';

const BRAND = '#941936';

/* ── Action category config ─────────────────────────────────────────────── */
const ACTION_CONFIG = {
  'auth.login':               { label: 'Login',            color: '#1565c0', bg: '#e3f2fd', icon: <LoginIcon  sx={{ fontSize: 14 }} /> },
  'auth.logout':              { label: 'Logout',           color: '#546e7a', bg: '#eceff1', icon: <LoginIcon  sx={{ fontSize: 14 }} /> },
  'auth.password_changed':    { label: 'Password Changed', color: '#6a1b9a', bg: '#f3e5f5', icon: <LockIcon   sx={{ fontSize: 14 }} /> },
  'auth.admin_password_reset':{ label: 'Admin PW Reset',   color: '#e65100', bg: '#fff3e0', icon: <AdminIcon  sx={{ fontSize: 14 }} /> },
  'employee.created':         { label: 'Employee Created', color: '#2e7d32', bg: '#e8f5e9', icon: <PersonIcon  sx={{ fontSize: 14 }} /> },
  'employee.deleted':         { label: 'Employee Deleted', color: '#c62828', bg: '#ffebee', icon: <PersonIcon  sx={{ fontSize: 14 }} /> },
  'payroll.generated':        { label: 'Payroll Generated',color: '#00838f', bg: '#e0f7fa', icon: <PayrollIcon sx={{ fontSize: 14 }} /> },
  'payroll.approved':         { label: 'Payroll Approved', color: '#1565c0', bg: '#e3f2fd', icon: <PayrollIcon sx={{ fontSize: 14 }} /> },
  'payroll.paid':             { label: 'Payroll Paid',     color: '#2e7d32', bg: '#e8f5e9', icon: <PayrollIcon sx={{ fontSize: 14 }} /> },
  'leave.approved':           { label: 'Leave Approved',   color: '#2e7d32', bg: '#e8f5e9', icon: <LeaveIcon   sx={{ fontSize: 14 }} /> },
  'leave.rejected':           { label: 'Leave Rejected',   color: '#c62828', bg: '#ffebee', icon: <LeaveIcon   sx={{ fontSize: 14 }} /> },
};

const CATEGORY_FILTERS = [
  { value: '',         label: 'All Actions' },
  { value: 'auth',     label: 'Authentication' },
  { value: 'employee', label: 'Employees' },
  { value: 'payroll',  label: 'Payroll' },
  { value: 'leave',    label: 'Leaves' },
];

const ActionChip = ({ action }) => {
  const cfg = ACTION_CONFIG[action];
  if (!cfg) {
    return (
      <Chip label={action} size="small"
        sx={{ bgcolor: '#f5f5f5', color: '#616161', fontSize: 11, fontWeight: 600 }} />
    );
  }
  return (
    <Chip
      icon={<Box sx={{ color: cfg.color, display: 'flex', ml: '6px !important' }}>{cfg.icon}</Box>}
      label={cfg.label}
      size="small"
      sx={{ bgcolor: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700 }}
    />
  );
};

const fmtTime = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

/* ── Main AuditLog Page ─────────────────────────────────────────────────── */
const AuditLog = () => {
  const [rows,     setRows]     = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [perPage,  setPerPage]  = useState(30);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState({ open: false, msg: '', sev: 'success' });

  // Filters
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [date,     setDate]     = useState('');

  const showToast = (msg, sev = 'error') => setToast({ open: true, msg, sev });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, per_page: perPage };
      if (search)   params.search = search;
      if (category) params.action = category;
      if (date)     params.date   = date;
      const res = await auditAPI.getAll(params);
      setRows(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (_) { showToast('Failed to load audit logs'); }
    finally { setLoading(false); }
  }, [page, perPage, search, category, date]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // WebSocket — instant prepend on page 1
  useHrFeed({
    'audit.log.created': (data) => {
      if (page === 0 && !search && !category && !date) {
        setRows((prev) => [data, ...prev].slice(0, perPage));
        setTotal((n) => n + 1);
      }
    },
    'password.changed': (data) => showToast(`🔑 ${data.name} changed their password`, 'warning'),
  });
  // Polling fallback
  usePolling(fetchLogs, 30000);

  const clearFilters = () => { setSearch(''); setCategory(''); setDate(''); setPage(0); };
  const hasFilters   = search || category || date;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <AuditIcon sx={{ color: BRAND, fontSize: 28 }} />
            <Typography variant="h4" fontWeight={800}>Audit Log</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Complete trail of all system actions — who did what, and when
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchLogs}><RefreshIcon /></IconButton>
        </Tooltip>
      </Box>

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            size="small" placeholder="Search descriptions…" sx={{ minWidth: 240 }}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>,
            }}
          />
          <TextField
            select size="small" label="Category" sx={{ minWidth: 160 }}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(0); }}
          >
            {CATEGORY_FILTERS.map((f) => (
              <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            size="small" type="date" label="Date"
            value={date} onChange={(e) => { setDate(e.target.value); setPage(0); }}
            InputLabelProps={{ shrink: true }} sx={{ width: 170 }}
          />
          {hasFilters && (
            <Button
              size="small" startIcon={<ClearIcon />}
              onClick={clearFilters}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              Clear filters
            </Button>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {total.toLocaleString()} {total === 1 ? 'entry' : 'entries'}
          </Typography>
        </Box>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
        ) : rows.length === 0 ? (
          <Box py={10} textAlign="center">
            <AuditIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={600}>No audit logs found</Typography>
            <Typography variant="body2" color="text.disabled" mt={0.5}>
              {hasFilters ? 'Try adjusting your filters' : 'Actions will appear here as they happen'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa', '& th': { fontWeight: 700, borderBottom: '2px solid #f0f0f0' } }}>
                  <TableCell sx={{ width: 170 }}>Time</TableCell>
                  <TableCell sx={{ width: 200 }}>User</TableCell>
                  <TableCell sx={{ width: 180 }}>Action</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell sx={{ width: 120 }}>Entity</TableCell>
                  <TableCell sx={{ width: 120 }}>IP Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((log) => (
                  <TableRow key={log.id} hover sx={{ '&:hover': { bgcolor: '#fafafa' } }}>

                    {/* Time */}
                    <TableCell>
                      <Typography variant="caption" fontWeight={600} display="block">
                        {new Date(log.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </Typography>
                    </TableCell>

                    {/* User */}
                    <TableCell>
                      {log.user ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: BRAND, fontSize: 11, fontWeight: 700 }}>
                            {log.user.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="caption" fontWeight={600} display="block" noWrap sx={{ maxWidth: 130 }}>
                              {log.user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 130, display: 'block', fontSize: 10 }}>
                              {log.user.email}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.disabled">System</Typography>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <ActionChip action={log.action} />
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 380 }}>
                        {log.description}
                      </Typography>
                    </TableCell>

                    {/* Entity */}
                    <TableCell>
                      {log.entity_type ? (
                        <Box>
                          <Typography variant="caption" fontWeight={600} color={BRAND} display="block">
                            {log.entity_type}
                          </Typography>
                          {log.entity_id && (
                            <Typography variant="caption" color="text.secondary">#{log.entity_id}</Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.disabled">—</Typography>
                      )}
                    </TableCell>

                    {/* IP */}
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {log.ip_address ?? '—'}
                      </Typography>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[15, 30, 60, 100]}
          component="div"
          count={total}
          rowsPerPage={perPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setPerPage(+e.target.value); setPage(0); }}
        />
      </Paper>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditLog;
