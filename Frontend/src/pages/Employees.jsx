import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, IconButton, InputAdornment,
  MenuItem, Paper, Snackbar, Table, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow,
  TextField, Tooltip, Typography,
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { employeeAPI, lookupAPI } from '../services/api';
import { selectIsHR } from '../store/authSlice';

const EMPTY_FORM = {
  first_name: '', last_name: '', email: '', phone: '', nic: '',
  date_of_birth: '', hire_date: '', department_id: '', job_id: '',
  employee_type_id: '', role_id: '', salary: '', status: 'active',
  address: '', emergency_contact_name: '', emergency_contact_phone: '',
};

const STATUS_COLOR = { active: 'success', inactive: 'default', on_leave: 'warning', terminated: 'error' };

const EmployeeDialog = ({ open, onClose, employee, refs, onSaved }) => {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(employee ? { ...EMPTY_FORM, ...employee, date_of_birth: employee.date_of_birth ?? '', hire_date: employee.hire_date ?? '' } : EMPTY_FORM);
    setErrors({});
  }, [employee, open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.first_name.trim())       e.first_name    = ['First name is required'];
    if (!form.last_name.trim())        e.last_name     = ['Last name is required'];
    if (!form.email.trim())            e.email         = ['Email is required'];
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = ['Enter a valid email address'];
    if (!form.phone.trim())            e.phone         = ['Phone is required'];
    if (!form.nic.trim())              e.nic           = ['NIC is required'];
    if (!form.hire_date)               e.hire_date     = ['Hire date is required'];
    if (!form.department_id)           e.department_id = ['Department is required'];
    if (!form.job_id)                  e.job_id        = ['Job is required'];
    if (!form.employee_type_id)        e.employee_type_id = ['Employee type is required'];
    if (form.date_of_birth && form.hire_date && form.date_of_birth >= form.hire_date)
      e.hire_date = ['Hire date must be after date of birth'];
    if (form.salary && Number(form.salary) < 0) e.salary = ['Salary cannot be negative'];
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length) { setErrors(clientErrors); return; }
    setSaving(true);
    try {
      if (employee) {
        await employeeAPI.update(employee.id, form);
      } else {
        await employeeAPI.create(form);
      }
      onSaved(employee ? 'Employee updated' : 'Employee added');
      onClose();
    } catch (err) {
      const errs = err.response?.data?.errors ?? {};
      setErrors(errs);
      if (!Object.keys(errs).length) setErrors({ _: err.response?.data?.message ?? 'Error saving employee' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors._ && <Alert severity="error" sx={{ mb: 2 }}>{errors._}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="First Name" value={form.first_name} onChange={set('first_name')} error={!!errors.first_name} helperText={errors.first_name?.[0]} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Last Name" value={form.last_name} onChange={set('last_name')} error={!!errors.last_name} helperText={errors.last_name?.[0]} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Email" type="email" value={form.email} onChange={set('email')} error={!!errors.email} helperText={errors.email?.[0]} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Phone" value={form.phone} onChange={set('phone')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="NIC" value={form.nic} onChange={set('nic')} error={!!errors.nic} helperText={errors.nic?.[0]} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date of Birth" type="date" value={form.date_of_birth} onChange={set('date_of_birth')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Hire Date" type="date" value={form.hire_date} onChange={set('hire_date')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required select label="Department" value={form.department_id} onChange={set('department_id')}>
                {refs.departments.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required select label="Job" value={form.job_id} onChange={set('job_id')}>
                {refs.jobs.filter((j) => !form.department_id || j.department_id === form.department_id).map((j) => <MenuItem key={j.id} value={j.id}>{j.title}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required select label="Employee Type" value={form.employee_type_id} onChange={set('employee_type_id')}>
                {refs.employeeTypes.map((t) => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required select label="Role" value={form.role_id} onChange={set('role_id')}>
                {refs.userRoles.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Salary" type="number" value={form.salary} onChange={set('salary')} InputProps={{ startAdornment: <InputAdornment position="start">LKR</InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Status" value={form.status} onChange={set('status')}>
                {['active', 'inactive', 'on_leave', 'terminated'].map((s) => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" value={form.address} onChange={set('address')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Emergency Contact Name" value={form.emergency_contact_name} onChange={set('emergency_contact_name')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Emergency Contact Phone" value={form.emergency_contact_phone} onChange={set('emergency_contact_phone')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: '#941936' }}>
            {saving ? 'Saving...' : employee ? 'Update' : 'Add Employee'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Employees = () => {
  const isHR = useSelector(selectIsHR);
  const [rows, setRows]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(0);
  const [perPage, setPerPage]   = useState(10);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [dialogOpen, setDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState({ open: false, msg: '', sev: 'success' });
  const [refs, setRefs]         = useState({ departments: [], jobs: [], employeeTypes: [], userRoles: [] });

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  const fetchRefs = useCallback(async () => {
    const [d, j, et, ur] = await Promise.all([
      lookupAPI.departments(), lookupAPI.jobs(),
      lookupAPI.employeeTypes(), lookupAPI.userRoles(),
    ]);
    setRefs({ departments: d.data ?? [], jobs: j.data ?? [], employeeTypes: et.data ?? [], userRoles: ur.data ?? [] });
  }, []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await employeeAPI.getAll({ page: page + 1, per_page: perPage, search: search || undefined });
      setRows(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (_) { showToast('Failed to load employees', 'error'); }
    finally { setLoading(false); }
  }, [page, perPage, search]);

  useEffect(() => { fetchRefs(); }, [fetchRefs]);
  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await employeeAPI.delete(id);
      showToast('Employee deleted');
      fetchEmployees();
    } catch (err) { showToast(err.response?.data?.message ?? 'Delete failed', 'error'); }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Employees</Typography>
        {isHR && (
          <Button variant="contained" startIcon={<AddIcon />}
            sx={{ bgcolor: '#941936' }} onClick={() => { setSelected(null); setDialog(true); }}>
            Add Employee
          </Button>
        )}
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          placeholder="Search by name, email or NIC…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          size="small" sx={{ width: 320 }}
        />
      </Paper>

      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Job</TableCell>
                <TableCell>Status</TableCell>
                {isHR && <TableCell align="center">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No employees found</TableCell></TableRow>
              ) : rows.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.full_name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.department?.name ?? '—'}</TableCell>
                  <TableCell>{emp.job?.title ?? '—'}</TableCell>
                  <TableCell>
                    <Chip label={emp.status} size="small" color={STATUS_COLOR[emp.status] ?? 'default'} />
                  </TableCell>
                  {isHR && (
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => { setSelected(emp); setDialog(true); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(emp.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={perPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setPerPage(+e.target.value); setPage(0); }}
        />
      </TableContainer>

      <EmployeeDialog open={dialogOpen} onClose={() => setDialog(false)} employee={selected} refs={refs} onSaved={(msg) => { showToast(msg); fetchEmployees(); }} />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Employees;
