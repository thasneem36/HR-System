import { useState, useEffect, useCallback } from 'react';
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, IconButton, Paper, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { departmentAPI } from '../services/api';

const EMPTY_FORM = { name: '', description: '' };

const DeptDialog = ({ open, onClose, dept, onSaved }) => {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(dept ? { name: dept.name, description: dept.description ?? '' } : EMPTY_FORM); setErrors({}); }, [dept, open]);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (dept) await departmentAPI.update(dept.id, form);
      else      await departmentAPI.create(form);
      onSaved(dept ? 'Department updated' : 'Department created');
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { _: err.response?.data?.message ?? 'Error' });
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dept ? 'Edit Department' : 'Add Department'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors._ && <Alert severity="error" sx={{ mb: 2 }}>{errors._}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Department Name" value={form.name} onChange={set('name')} error={!!errors.name} helperText={errors.name?.[0]} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={set('description')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: '#941936' }}>
            {saving ? 'Saving...' : dept ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Departments = () => {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [dialog, setDialog]     = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState({ open: false, msg: '', sev: 'success' });

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const r = await departmentAPI.getAll(); setRows(r.data ?? []); }
    catch (_) { showToast('Failed to load departments', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try { await departmentAPI.delete(id); showToast('Department deleted'); fetch(); }
    catch (err) { showToast(err.response?.data?.message ?? 'Delete failed', 'error'); }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Departments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#941936' }}
          onClick={() => { setSelected(null); setDialog(true); }}>Add Department</Button>
      </Box>

      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Employees</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>No departments found</TableCell></TableRow>
              ) : rows.map((d) => (
                <TableRow key={d.id} hover>
                  <TableCell fontWeight={600}>{d.name}</TableCell>
                  <TableCell>{d.description ?? '—'}</TableCell>
                  <TableCell>{d.employees_count ?? 0}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => { setSelected(d); setDialog(true); }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(d.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <DeptDialog open={dialog} onClose={() => setDialog(false)} dept={selected} onSaved={(msg) => { showToast(msg); fetch(); }} />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Departments;
