import { useState, useEffect, useCallback } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, Grid, IconButton, Paper, Snackbar, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { leaveTypeAPI, holidayAPI } from '../services/api';

const BRAND = '#941936';

// ─── Leave Types Tab ──────────────────────────────────────────────────────────
const EMPTY_LT = { name: '', description: '', default_days: '' };

const LeaveTypeDialog = ({ open, onClose, leaveType, onSaved }) => {
  const [form, setForm]     = useState(EMPTY_LT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(leaveType ? { name: leaveType.name, description: leaveType.description ?? '', default_days: leaveType.default_days } : EMPTY_LT);
    setErrors({});
  }, [leaveType, open]);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (leaveType) await leaveTypeAPI.update(leaveType.id, form);
      else           await leaveTypeAPI.create(form);
      onSaved(leaveType ? 'Leave type updated' : 'Leave type created');
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { _: err.response?.data?.message ?? 'Error' });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{leaveType ? 'Edit Leave Type' : 'Add Leave Type'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors._ && <Alert severity="error" sx={{ mb: 2 }}>{errors._}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Name" value={form.name} onChange={set('name')}
                error={!!errors.name} helperText={errors.name?.[0]} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Default Days" type="number" inputProps={{ min: 1 }}
                value={form.default_days} onChange={set('default_days')}
                error={!!errors.default_days} helperText={errors.default_days?.[0]} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Description (optional)"
                value={form.description} onChange={set('description')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: BRAND }}>
            {saving ? 'Saving…' : leaveType ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const LeaveTypesTab = () => {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [dialog, setDialog]     = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState({ open: false, msg: '', sev: 'success' });

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try { const r = await leaveTypeAPI.getAll(); setRows(r.data ?? []); }
    catch (_) { showToast('Failed to load leave types', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leave type?')) return;
    try { await leaveTypeAPI.delete(id); showToast('Leave type deleted'); fetchAll(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Delete failed', 'error'); }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>Leave Types</Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="small" sx={{ bgcolor: BRAND }}
          onClick={() => { setSelected(null); setDialog(true); }}>Add Leave Type</Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : (
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Default Days</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Used In</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No leave types found</TableCell></TableRow>
              ) : rows.map((lt) => (
                <TableRow key={lt.id} hover>
                  <TableCell fontWeight={500}>{lt.name}</TableCell>
                  <TableCell>{lt.default_days} days</TableCell>
                  <TableCell>{lt.description ?? '—'}</TableCell>
                  <TableCell><Chip label={`${lt.leaves_count ?? 0} requests`} size="small" /></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => { setSelected(lt); setDialog(true); }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(lt.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <LeaveTypeDialog open={dialog} onClose={() => setDialog(false)} leaveType={selected}
        onSaved={(msg) => { showToast(msg); fetchAll(); }} />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

// ─── Holidays Tab ─────────────────────────────────────────────────────────────
const EMPTY_HOL = { title: '', date: '', description: '' };

const HolidayDialog = ({ open, onClose, holiday, onSaved }) => {
  const [form, setForm]     = useState(EMPTY_HOL);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(holiday ? { title: holiday.title, date: holiday.date, description: holiday.description ?? '' } : EMPTY_HOL);
    setErrors({});
  }, [holiday, open]);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (holiday) await holidayAPI.update(holiday.id, form);
      else         await holidayAPI.create(form);
      onSaved(holiday ? 'Holiday updated' : 'Holiday added');
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { _: err.response?.data?.message ?? 'Error' });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{holiday ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors._ && <Alert severity="error" sx={{ mb: 2 }}>{errors._}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Title" value={form.title} onChange={set('title')}
                error={!!errors.title} helperText={errors.title?.[0]} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Date" type="date" value={form.date} onChange={set('date')}
                InputLabelProps={{ shrink: true }} error={!!errors.date} helperText={errors.date?.[0]} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Description (optional)"
                value={form.description} onChange={set('description')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: BRAND }}>
            {saving ? 'Saving…' : holiday ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const HolidaysTab = () => {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [dialog, setDialog]     = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState({ open: false, msg: '', sev: 'success' });

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try { const r = await holidayAPI.getAll(); setRows(r.data ?? []); }
    catch (_) { showToast('Failed to load holidays', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this holiday?')) return;
    try { await holidayAPI.delete(id); showToast('Holiday deleted'); fetchAll(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Delete failed', 'error'); }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>Public Holidays</Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="small" sx={{ bgcolor: BRAND }}
          onClick={() => { setSelected(null); setDialog(true); }}>Add Holiday</Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : (
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>No holidays found</TableCell></TableRow>
              ) : rows.map((h) => (
                <TableRow key={h.id} hover>
                  <TableCell fontWeight={500}>{h.title}</TableCell>
                  <TableCell>{h.date}</TableCell>
                  <TableCell>{h.description ?? '—'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => { setSelected(h); setDialog(true); }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(h.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <HolidayDialog open={dialog} onClose={() => setDialog(false)} holiday={selected}
        onSaved={(msg) => { showToast(msg); fetchAll(); }} />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

// ─── Main Settings Page ───────────────────────────────────────────────────────
const Settings = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Settings</Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}
          TabIndicatorProps={{ style: { backgroundColor: BRAND } }}>
          <Tab label="Leave Types" sx={{ '&.Mui-selected': { color: BRAND } }} />
          <Tab label="Holidays"    sx={{ '&.Mui-selected': { color: BRAND } }} />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {tab === 0 && <LeaveTypesTab />}
        {tab === 1 && <HolidaysTab />}
      </Paper>
    </Box>
  );
};

export default Settings;
