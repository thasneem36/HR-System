import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHrFeed } from '../hooks/useHrFeed';
import { useUserFeed } from '../hooks/useUserFeed';
import { usePolling } from '../hooks/usePolling';
import {
  Alert, Avatar, Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Paper,
  Snackbar, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import {
  Add as AddIcon, AutoAwesome as GenerateIcon, Check as ApproveIcon,
  Close as CloseIcon, Delete as DeleteIcon, Edit as EditIcon,
  Payment as PaidIcon, Visibility as ViewIcon, Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  AccountBalance as PayrollIcon, TrendingUp as GrossIcon,
  AccountBalanceWallet as NetIcon, People as PeopleIcon,
} from '@mui/icons-material';
import { payrollAPI, employeeAPI } from '../services/api';
import { selectIsHR } from '../store/authSlice';
import { generatePayslip } from '../utils/generatePayslip';

const BRAND = '#941936';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const STATUS_COLOR  = { draft: 'default', approved: 'info', paid: 'success' };
const STATUS_LABELS = { draft: 'Draft', approved: 'Approved', paid: 'Paid' };

const fmtLKR = (v) => `LKR ${Number(v ?? 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
const fmtShort = (v) => `LKR ${Number(v ?? 0).toLocaleString()}`;

const now = new Date();

/* ══════════════════════════════════════════════════════════════
   PAYSLIP VIEWER (read-only modal)
   ══════════════════════════════════════════════════════════════ */
const PayslipViewer = ({ open, onClose, payroll }) => {
  if (!payroll) return null;
  const emp = payroll.employee;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header */}
      <Box sx={{ background: `linear-gradient(135deg, ${BRAND} 0%, #6b1127 100%)`, color: '#fff', p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight={800}>PAYSLIP</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {MONTH_NAMES[payroll.month - 1]} {payroll.year}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" sx={{ opacity: 0.7 }}>University HR System</Typography>
            <Box mt={0.5}>
              <Chip
                label={STATUS_LABELS[payroll.status]}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 11,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Employee info */}
        <Box display="flex" alignItems="center" gap={2} mt={2.5}>
          <Avatar
            sx={{
              width: 52, height: 52, fontSize: 20, fontWeight: 700,
              bgcolor: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.5)',
            }}
          >
            {emp?.first_name?.[0]}{emp?.last_name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {emp?.first_name} {emp?.last_name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {emp?.job?.title ?? '—'}  ·  {emp?.department?.name ?? '—'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {/* Earnings */}
        <Typography variant="subtitle2" fontWeight={700} mb={1.5} color={BRAND}>
          Earnings
        </Typography>
        <Table size="small" sx={{ mb: 2 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: 'none', pl: 0, color: 'text.secondary' }}>Basic Salary</TableCell>
              <TableCell align="right" sx={{ border: 'none', fontWeight: 600 }}>
                {fmtLKR(payroll.basic_salary)}
              </TableCell>
            </TableRow>
            {(payroll.allowances ?? []).map((a, i) => (
              <TableRow key={i}>
                <TableCell sx={{ border: 'none', pl: 0, color: 'text.secondary' }}>{a.name}</TableCell>
                <TableCell align="right" sx={{ border: 'none', color: '#2e7d32' }}>
                  + {fmtLKR(a.amount)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 700, pl: 0 }}>Gross Salary</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                {fmtLKR(payroll.gross_salary)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Deductions */}
        {(payroll.deductions ?? []).length > 0 && (
          <>
            <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="error.main">
              Deductions
            </Typography>
            <Table size="small" sx={{ mb: 2 }}>
              <TableBody>
                {payroll.deductions.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ border: 'none', pl: 0, color: 'text.secondary' }}>{d.name}</TableCell>
                    <TableCell align="right" sx={{ border: 'none', color: '#c62828' }}>
                      − {fmtLKR(d.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Net pay */}
        <Box
          sx={{
            p: 2.5, borderRadius: 2,
            background: `linear-gradient(135deg, ${BRAND}12, ${BRAND}06)`,
            border: `1px solid ${BRAND}30`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight={700} color={BRAND}>Net Pay</Typography>
          <Typography variant="h5" fontWeight={800} color={BRAND}>
            {fmtLKR(payroll.net_salary)}
          </Typography>
        </Box>

        {/* Meta */}
        <Box mt={2} display="flex" gap={2} flexWrap="wrap">
          {payroll.paid_at && (
            <Typography variant="caption" color="text.secondary">
              Paid on: {new Date(payroll.paid_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
            </Typography>
          )}
          {payroll.approvedBy && (
            <Typography variant="caption" color="text.secondary">
              Approved by: {payroll.approvedBy.name}
            </Typography>
          )}
          {payroll.notes && (
            <Typography variant="caption" color="text.secondary">
              Notes: {payroll.notes}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>Close</Button>
        <Button
          variant="contained"
          startIcon={<PdfIcon />}
          onClick={() => generatePayslip(payroll)}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: BRAND,
            '&:hover': { bgcolor: '#6b1127' },
          }}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ══════════════════════════════════════════════════════════════
   PAYROLL FORM (create / edit)
   ══════════════════════════════════════════════════════════════ */
const PayrollForm = ({ open, onClose, payroll, employees, onSaved }) => {
  const isEdit = !!payroll;
  const [form, setForm] = useState({
    employee_id: '', month: now.getMonth() + 1, year: now.getFullYear(),
    basic_salary: '', allowances: [], deductions: [], notes: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i);

  useEffect(() => {
    if (payroll) {
      setForm({
        employee_id: payroll.employee_id,
        month:       payroll.month,
        year:        payroll.year,
        basic_salary: payroll.basic_salary,
        allowances:  payroll.allowances ?? [],
        deductions:  payroll.deductions ?? [],
        notes:       payroll.notes ?? '',
      });
    } else {
      setForm({ employee_id: '', month: now.getMonth() + 1, year: now.getFullYear(), basic_salary: '', allowances: [], deductions: [], notes: '' });
    }
    setErrors({});
  }, [payroll, open]);

  // Auto-fill basic salary from employee record
  // Note: e.target.value is a string; em.id is a number — use Number() to compare correctly
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    const emp   = employees.find((em) => em.id === Number(empId));
    setForm((f) => ({ ...f, employee_id: empId, basic_salary: emp?.salary ?? f.basic_salary }));
  };

  const addRow = (type) =>
    setForm((f) => ({ ...f, [type]: [...(f[type] ?? []), { name: '', amount: '' }] }));

  const removeRow = (type, idx) =>
    setForm((f) => ({ ...f, [type]: f[type].filter((_, i) => i !== idx) }));

  const updateRow = (type, idx, field, value) =>
    setForm((f) => ({
      ...f,
      [type]: f[type].map((r, i) => i === idx ? { ...r, [field]: value } : r),
    }));

  // Live net pay preview
  const grossPreview = Number(form.basic_salary || 0) +
    (form.allowances ?? []).reduce((s, a) => s + Number(a.amount || 0), 0);
  const netPreview = grossPreview -
    (form.deductions ?? []).reduce((s, d) => s + Number(d.amount || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        basic_salary: Number(form.basic_salary),
        allowances:   (form.allowances ?? []).filter((a) => a.name && a.amount),
        deductions:   (form.deductions ?? []).filter((d) => d.name && d.amount),
      };
      if (isEdit) await payrollAPI.update(payroll.id, payload);
      else        await payrollAPI.create(payload);
      onSaved(isEdit ? 'Payroll updated' : 'Payroll created');
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { _: err.response?.data?.message ?? 'Error' });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Payroll' : 'New Payroll'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors._ && <Alert severity="error" sx={{ mb: 2 }}>{errors._}</Alert>}
          <Grid container spacing={2}>
            {/* Row 1 — employee / month / year */}
            {!isEdit && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth required select label="Employee" value={form.employee_id}
                  onChange={handleEmployeeChange} error={!!errors.employee_id} helperText={errors.employee_id?.[0]}>
                  {employees.map((e) => (
                    <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {!isEdit && (
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField fullWidth required select label="Month" value={form.month}
                  onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}>
                  {MONTH_NAMES.map((m, i) => <MenuItem key={i+1} value={i+1}>{m}</MenuItem>)}
                </TextField>
              </Grid>
            )}
            {!isEdit && (
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField fullWidth required select label="Year" value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}>
                  {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </TextField>
              </Grid>
            )}

            {/* Basic Salary */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required label="Basic Salary (LKR)" type="number"
                inputProps={{ min: 0, step: '0.01' }} value={form.basic_salary}
                onChange={(e) => setForm((f) => ({ ...f, basic_salary: e.target.value }))}
                error={!!errors.basic_salary} helperText={errors.basic_salary?.[0]} />
            </Grid>

            {/* Live preview */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary">Net Pay Preview</Typography>
                <Typography variant="h6" fontWeight={800} color={BRAND}>{fmtLKR(netPreview)}</Typography>
                <Typography variant="caption" color="text.secondary">Gross: {fmtLKR(grossPreview)}</Typography>
              </Box>
            </Grid>

            {/* Allowances */}
            <Grid size={{ xs: 12 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight={700} color="#2e7d32">Allowances</Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={() => addRow('allowances')}
                  sx={{ textTransform: 'none', color: '#2e7d32' }}>
                  Add
                </Button>
              </Box>
              {(form.allowances ?? []).map((a, i) => (
                <Box key={i} display="flex" gap={1} mb={1} alignItems="center">
                  <TextField size="small" placeholder="Name (e.g. Housing)" value={a.name}
                    onChange={(e) => updateRow('allowances', i, 'name', e.target.value)} sx={{ flex: 2 }} />
                  <TextField size="small" placeholder="Amount" type="number" value={a.amount}
                    onChange={(e) => updateRow('allowances', i, 'amount', e.target.value)}
                    inputProps={{ min: 0 }} sx={{ flex: 1 }} />
                  <IconButton size="small" color="error" onClick={() => removeRow('allowances', i)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {(form.allowances ?? []).length === 0 && (
                <Typography variant="caption" color="text.disabled">No allowances — click Add to create one</Typography>
              )}
            </Grid>

            {/* Deductions */}
            <Grid size={{ xs: 12 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight={700} color="error.main">Deductions</Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={() => addRow('deductions')}
                  sx={{ textTransform: 'none', color: 'error.main' }}>
                  Add
                </Button>
              </Box>
              {(form.deductions ?? []).map((d, i) => (
                <Box key={i} display="flex" gap={1} mb={1} alignItems="center">
                  <TextField size="small" placeholder="Name (e.g. EPF)" value={d.name}
                    onChange={(e) => updateRow('deductions', i, 'name', e.target.value)} sx={{ flex: 2 }} />
                  <TextField size="small" placeholder="Amount" type="number" value={d.amount}
                    onChange={(e) => updateRow('deductions', i, 'amount', e.target.value)}
                    inputProps={{ min: 0 }} sx={{ flex: 1 }} />
                  <IconButton size="small" color="error" onClick={() => removeRow('deductions', i)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {(form.deductions ?? []).length === 0 && (
                <Typography variant="caption" color="text.disabled">No deductions — click Add to create one</Typography>
              )}
            </Grid>

            {/* Notes */}
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={2} label="Notes (optional)" value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}
            sx={{ bgcolor: BRAND, textTransform: 'none', fontWeight: 600 }}>
            {saving ? 'Saving…' : isEdit ? 'Update' : 'Create Payroll'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

/* ══════════════════════════════════════════════════════════════
   GENERATE DIALOG (bulk for a month)
   ══════════════════════════════════════════════════════════════ */
const GenerateDialog = ({ open, onClose, onGenerated }) => {
  const [month,    setMonth]    = useState(now.getMonth() + 1);
  const [year,     setYear]     = useState(now.getFullYear());
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const years = Array.from({ length: 4 }, (_, i) => now.getFullYear() - 1 + i);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await payrollAPI.generate({ month, year });
      setResult(res.data);
      onGenerated();
    } catch (err) {
      setResult({ error: err.response?.data?.message ?? 'Generation failed' });
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={() => { onClose(); setResult(null); }} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <GenerateIcon sx={{ color: BRAND }} />
          Bulk Generate Payrolls
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2.5}>
          Creates draft payrolls for all active employees who have a salary set.
          Existing payrolls for the selected period are skipped.
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 7 }}>
            <TextField fullWidth select label="Month" value={month} onChange={(e) => setMonth(e.target.value)}>
              {MONTH_NAMES.map((m, i) => <MenuItem key={i+1} value={i+1}>{m}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 5 }}>
            <TextField fullWidth select label="Year" value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>

        {result && !result.error && (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
            ✅ {result.created} payrolls created · {result.skipped} skipped (already existed)
          </Alert>
        )}
        {result?.error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{result.error}</Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => { onClose(); setResult(null); }} sx={{ textTransform: 'none' }}>
          {result ? 'Close' : 'Cancel'}
        </Button>
        {!result && (
          <Button variant="contained" onClick={handleGenerate} disabled={loading}
            sx={{ bgcolor: BRAND, textTransform: 'none', fontWeight: 600 }}>
            {loading ? <CircularProgress size={18} color="inherit" /> : 'Generate'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

/* ══════════════════════════════════════════════════════════════
   HR PAYROLL MANAGEMENT PAGE
   ══════════════════════════════════════════════════════════════ */
const HRPayrollPage = ({ employees }) => {
  const [rows,      setRows]      = useState([]);
  const [total,     setTotal]     = useState(0);
  const [summary,   setSummary]   = useState(null);
  const [page,      setPage]      = useState(0);
  const [perPage,   setPerPage]   = useState(20);
  const [loading,   setLoading]   = useState(true);
  const [filters,   setFilters]   = useState({ month: now.getMonth() + 1, year: now.getFullYear(), status: '', employee_id: '' });
  const [formOpen,  setFormOpen]  = useState(false);
  const [genOpen,   setGenOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [toast,     setToast]     = useState({ open: false, msg: '', sev: 'success' });

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, per_page: perPage };
      if (filters.month)       params.month       = filters.month;
      if (filters.year)        params.year        = filters.year;
      if (filters.status)      params.status      = filters.status;
      if (filters.employee_id) params.employee_id = filters.employee_id;

      const [listRes, sumRes] = await Promise.all([
        payrollAPI.getAll(params),
        payrollAPI.summary({ month: filters.month, year: filters.year }),
      ]);
      setRows(listRes.data?.data ?? []);
      setTotal(listRes.data?.total ?? 0);
      setSummary(sumRes.data);
    } catch (_) { showToast('Failed to load payrolls', 'error'); }
    finally { setLoading(false); }
  }, [page, perPage, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  // WebSocket instant + 30 s polling fallback
  useHrFeed({ 'payroll.updated': () => loadData() });
  usePolling(loadData, 30000);

  const handleApprove = async (id) => {
    try { await payrollAPI.approve(id); showToast('Payroll approved'); loadData(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Approve failed', 'error'); }
  };

  const handleMarkPaid = async (id) => {
    try { await payrollAPI.markPaid(id); showToast('Marked as paid'); loadData(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draft payroll?')) return;
    try { await payrollAPI.delete(id); showToast('Payroll deleted'); loadData(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Delete failed', 'error'); }
  };

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <Box>
      {/* Summary cards */}
      {summary && (
        <Grid container spacing={2} mb={3}>
          {[
            { label: 'Total Payrolls', value: summary.total,    icon: <PeopleIcon />,  color: BRAND },
            { label: 'Draft',          value: summary.draft,    icon: <EditIcon />,    color: '#78909c' },
            { label: 'Approved',       value: summary.approved, icon: <ApproveIcon />, color: '#1565c0' },
            { label: 'Paid',           value: summary.paid,     icon: <PaidIcon />,    color: '#2e7d32' },
            { label: 'Total Gross',    value: fmtShort(summary.total_gross), icon: <GrossIcon />, color: '#6a1b9a' },
            { label: 'Total Net',      value: fmtShort(summary.total_net),   icon: <NetIcon />,   color: BRAND },
          ].map((s) => (
            <Grid key={s.label} size={{ xs: 6, sm: 4, md: 2 }}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, borderLeft: `4px solid ${s.color}` }}>
                <Box display="flex" alignItems="center" gap={0.75} mb={0.5}>
                  <Box sx={{ color: s.color, display: 'flex' }}>{s.icon}</Box>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                </Box>
                <Typography variant="h6" fontWeight={800} color={s.color}>{s.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Filter bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
          <TextField select size="small" label="Month" value={filters.month}
            onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))} sx={{ minWidth: 130 }}>
            {MONTH_NAMES.map((m, i) => <MenuItem key={i+1} value={i+1}>{m}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Year" value={filters.year}
            onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))} sx={{ minWidth: 90 }}>
            {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Status" value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} sx={{ minWidth: 110 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
          </TextField>
          <TextField select size="small" label="Employee" value={filters.employee_id}
            onChange={(e) => setFilters((f) => ({ ...f, employee_id: e.target.value }))} sx={{ minWidth: 180 }}>
            <MenuItem value="">All Employees</MenuItem>
            {employees.map((e) => <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</MenuItem>)}
          </TextField>

          <Box flexGrow={1} />

          <Button variant="outlined" size="small" startIcon={<GenerateIcon />}
            onClick={() => setGenOpen(true)}
            sx={{ textTransform: 'none', borderRadius: 2 }}>
            Bulk Generate
          </Button>
          <Button variant="contained" size="small" startIcon={<AddIcon />}
            onClick={() => { setEditTarget(null); setFormOpen(true); }}
            sx={{ bgcolor: BRAND, textTransform: 'none', borderRadius: 2 }}>
            New Payroll
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : (
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Basic</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Gross</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Net Pay</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No payrolls found — use "Bulk Generate" to create them for the selected month
                  </TableCell>
                </TableRow>
              ) : rows.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, background: `linear-gradient(135deg, ${BRAND}, #6b1127)` }}>
                        {p.employee?.first_name?.[0]}{p.employee?.last_name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {p.employee?.first_name} {p.employee?.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {p.employee?.department?.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{MONTH_NAMES[p.month - 1]} {p.year}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{fmtShort(p.basic_salary)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{fmtShort(p.gross_salary)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700} color={BRAND}>
                      {fmtShort(p.net_salary)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={STATUS_LABELS[p.status]} size="small" color={STATUS_COLOR[p.status] ?? 'default'} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Payslip">
                      <IconButton size="small" onClick={() => setViewTarget(p)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                      <IconButton size="small" color="error" onClick={() => generatePayslip(p)}>
                        <PdfIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {p.status === 'draft' && (
                      <>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => { setEditTarget(p); setFormOpen(true); }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton size="small" color="info" onClick={() => handleApprove(p.id)}>
                            <ApproveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {p.status === 'approved' && (
                      <Tooltip title="Mark as Paid">
                        <IconButton size="small" color="success" onClick={() => handleMarkPaid(p.id)}>
                          <PaidIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={perPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setPerPage(+e.target.value); setPage(0); }}
        />
      </TableContainer>

      {/* Dialogs */}
      <PayrollForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        payroll={editTarget}
        employees={employees}
        onSaved={(msg) => { showToast(msg); loadData(); }}
      />
      <GenerateDialog
        open={genOpen}
        onClose={() => setGenOpen(false)}
        onGenerated={loadData}
      />
      <PayslipViewer
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        payroll={viewTarget}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

/* ══════════════════════════════════════════════════════════════
   EMPLOYEE MY PAYSLIPS PAGE
   ══════════════════════════════════════════════════════════════ */
const EmployeePayslipsPage = () => {
  const [rows,      setRows]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [fetchError,setFetchError]= useState(false);
  const [viewTarget, setViewTarget] = useState(null);

  const fetchPayslips = useCallback(() => {
    payrollAPI.myPayslips()
      .then((r) => setRows(r.data ?? []))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPayslips(); }, [fetchPayslips]);

  // WebSocket instant + 30 s polling fallback
  useUserFeed({
    'payroll.approved': () => fetchPayslips(),
    'payroll.paid':     () => fetchPayslips(),
  });
  usePolling(fetchPayslips, 30000);

  return (
    <Box>
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
      ) : fetchError ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>Failed to load payslips. Please refresh the page.</Alert>
      ) : rows.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '2px dashed', borderColor: 'divider', borderRadius: 3 }}>
          <PayrollIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6" color="text.secondary">No payslips available yet</Typography>
          <Typography variant="body2" color="text.disabled">
            Your payslips will appear here once HR approves them
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {rows.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid', borderColor: 'divider', borderRadius: 2,
                  cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' },
                }}
                onClick={() => setViewTarget(p)}
              >
                <Box sx={{ background: `linear-gradient(135deg, ${BRAND}, #6b1127)`, p: 2, color: '#fff' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={700}>
                      {MONTH_NAMES[p.month - 1]} {p.year}
                    </Typography>
                    <Chip label={STATUS_LABELS[p.status]} size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11 }} />
                  </Box>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" color="text.secondary">Basic Salary</Typography>
                    <Typography variant="caption" fontWeight={600}>{fmtShort(p.basic_salary)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" color="text.secondary">Gross</Typography>
                    <Typography variant="caption" fontWeight={600}>{fmtShort(p.gross_salary)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={700} color={BRAND}>Net Pay</Typography>
                    <Typography variant="body2" fontWeight={800} color={BRAND}>{fmtShort(p.net_salary)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Button
                      size="small"
                      startIcon={<PdfIcon />}
                      onClick={(e) => { e.stopPropagation(); generatePayslip(p); }}
                      sx={{ textTransform: 'none', fontSize: 11, color: BRAND, p: '2px 8px' }}
                    >
                      Download PDF
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <PayslipViewer
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        payroll={viewTarget}
      />
    </Box>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN PAYROLL PAGE (role-aware)
   ══════════════════════════════════════════════════════════════ */
const Payroll = () => {
  const isHR    = useSelector(selectIsHR);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (!isHR) return;
    employeeAPI.getAll({ per_page: 500 })
      .then((r) => setEmployees(r.data?.data ?? []))
      .catch(() => {});
  }, [isHR]);

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>
          {isHR ? 'Payroll Management' : 'My Payslips'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isHR
            ? 'Generate, approve and process monthly payrolls for all employees'
            : 'View your approved monthly payslips'}
        </Typography>
      </Box>

      {isHR
        ? <HRPayrollPage employees={employees} />
        : <EmployeePayslipsPage />
      }
    </Box>
  );
};

export default Payroll;
