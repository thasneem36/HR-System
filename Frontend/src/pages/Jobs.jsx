import { useState, useEffect, useCallback } from 'react';
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, IconButton, InputAdornment,
  MenuItem, Paper, Snackbar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { jobAPI, lookupAPI } from '../services/api';

const EMPTY_FORM = { title: '', description: '', department_id: '', min_salary: '', max_salary: '' };

const JobDialog = ({ open, onClose, job, departments, onSaved }) => {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(job ? { title: job.title, description: job.description ?? '', department_id: job.department_id, min_salary: job.min_salary ?? '', max_salary: job.max_salary ?? '' } : EMPTY_FORM);
    setErrors({});
  }, [job, open]);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (job) await jobAPI.update(job.id, form);
      else     await jobAPI.create(form);
      onSaved(job ? 'Job updated' : 'Job created');
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { _: err.response?.data?.message ?? 'Error' });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{job ? 'Edit Job' : 'Add Job'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors._ && <Alert severity="error" sx={{ mb: 2 }}>{errors._}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Job Title" value={form.title} onChange={set('title')} error={!!errors.title} helperText={errors.title?.[0]} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required select label="Department" value={form.department_id} onChange={set('department_id')}>
                {departments.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Min Salary" type="number" value={form.min_salary} onChange={set('min_salary')}
                InputProps={{ startAdornment: <InputAdornment position="start">LKR</InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Max Salary" type="number" value={form.max_salary} onChange={set('max_salary')}
                InputProps={{ startAdornment: <InputAdornment position="start">LKR</InputAdornment> }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={set('description')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: '#941936' }}>
            {saving ? 'Saving...' : job ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Jobs = () => {
  const [rows, setRows]             = useState([]);
  const [departments, setDepts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [dialog, setDialog]         = useState(false);
  const [selected, setSelected]     = useState(null);
  const [toast, setToast]           = useState({ open: false, msg: '', sev: 'success' });

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, deptsRes] = await Promise.all([jobAPI.getAll(), lookupAPI.departments()]);
      setRows(jobsRes.data ?? []);
      setDepts(deptsRes.data ?? []);
    } catch (_) { showToast('Failed to load jobs', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try { await jobAPI.delete(id); showToast('Job deleted'); fetchAll(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Delete failed', 'error'); }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Jobs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#941936' }}
          onClick={() => { setSelected(null); setDialog(true); }}>Add Job</Button>
      </Box>

      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Employees</TableCell>
                <TableCell>Salary Range</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No jobs found</TableCell></TableRow>
              ) : rows.map((j) => (
                <TableRow key={j.id} hover>
                  <TableCell>{j.title}</TableCell>
                  <TableCell>{j.department?.name ?? '—'}</TableCell>
                  <TableCell>{j.employees_count ?? 0}</TableCell>
                  <TableCell>
                    {j.min_salary || j.max_salary
                      ? `LKR ${Number(j.min_salary || 0).toLocaleString()} – ${Number(j.max_salary || 0).toLocaleString()}`
                      : '—'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => { setSelected(j); setDialog(true); }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(j.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <JobDialog open={dialog} onClose={() => setDialog(false)} job={selected} departments={departments}
        onSaved={(msg) => { showToast(msg); fetchAll(); }} />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Jobs;
