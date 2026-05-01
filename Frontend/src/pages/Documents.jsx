import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, IconButton, LinearProgress, MenuItem,
  Paper, Snackbar, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import {
  Upload as UploadIcon, Download as DownloadIcon, Delete as DeleteIcon,
  Edit as EditIcon, Description as DocIcon, Warning as WarnIcon,
  ErrorOutline as ExpiredIcon, CheckCircle as OkIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { documentAPI, employeeAPI } from '../services/api';
import { selectCurrentUser, selectIsHR } from '../store/authSlice';
import { useHrFeed } from '../hooks/useHrFeed';
import { useUserFeed } from '../hooks/useUserFeed';
import { usePolling } from '../hooks/usePolling';

const BRAND = '#941936';

const CATEGORIES = [
  { value: 'contract',    label: 'Contract' },
  { value: 'id_document', label: 'ID Document' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'medical',     label: 'Medical' },
  { value: 'other',       label: 'Other' },
];

const CAT_COLOR = {
  contract:    '#1565c0',
  id_document: '#6a1b9a',
  certificate: '#2e7d32',
  medical:     '#e65100',
  other:       '#546e7a',
};

const fmt   = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtSz = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

/* ── Expiry badge ────────────────────────────────────────────────────── */
const ExpiryBadge = ({ doc }) => {
  if (!doc.expiry_date) return <Typography variant="caption" color="text.disabled">No expiry</Typography>;
  const days = doc.days_until_expiry;
  if (doc.is_expired)  return <Chip icon={<ExpiredIcon />} label="Expired"       size="small" color="error" />;
  if (days <= 7)       return <Chip icon={<WarnIcon />}    label={`${days}d left`} size="small" color="error" variant="outlined" />;
  if (days <= 30)      return <Chip icon={<WarnIcon />}    label={`${days}d left`} size="small" color="warning" variant="outlined" />;
  return <Chip icon={<OkIcon />} label={fmt(doc.expiry_date)} size="small" color="success" variant="outlined" />;
};

/* ── Upload / Edit Dialog ─────────────────────────────────────────────── */
const DocDialog = ({ open, onClose, employeeId, docToEdit, onSaved }) => {
  const [form,     setForm]     = useState({ title: '', category: 'other', expiry_date: '', notes: '' });
  const [file,     setFile]     = useState(null);
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (docToEdit) {
      setForm({
        title:       docToEdit.title,
        category:    docToEdit.category,
        expiry_date: docToEdit.expiry_date ?? '',
        notes:       docToEdit.notes ?? '',
      });
    } else {
      setForm({ title: '', category: 'other', expiry_date: '', notes: '' });
    }
    setFile(null);
    setErrors({});
    setProgress(0);
  }, [docToEdit, open]);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProgress(0);
    try {
      if (docToEdit) {
        await documentAPI.update(docToEdit.id, form);
        onSaved('Document updated');
      } else {
        const fd = new FormData();
        fd.append('file',        file);
        fd.append('title',       form.title);
        fd.append('category',    form.category);
        if (form.expiry_date) fd.append('expiry_date', form.expiry_date);
        if (form.notes)       fd.append('notes',       form.notes);
        await documentAPI.upload(employeeId, fd, (pct) => setProgress(pct));
        onSaved('Document uploaded');
      }
      onClose();
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { _: err.response?.data?.message ?? 'Error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{docToEdit ? 'Edit Document' : 'Upload Document'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors._ && <Alert severity="error" sx={{ mb: 2 }}>{errors._}</Alert>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth required label="Title" value={form.title} onChange={set('title')}
                error={!!errors.title} helperText={errors.title?.[0]} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required select label="Category" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Expiry Date (optional)" type="date" value={form.expiry_date}
                onChange={set('expiry_date')} InputLabelProps={{ shrink: true }}
                error={!!errors.expiry_date} helperText={errors.expiry_date?.[0]} />
            </Grid>

            {/* File picker — only shown on upload */}
            {!docToEdit && (
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<UploadIcon />}
                  sx={{ py: 1.5, borderStyle: 'dashed', color: file ? '#2e7d32' : 'inherit', borderColor: file ? '#2e7d32' : 'inherit' }}
                >
                  {file ? file.name : 'Choose File (PDF, JPG, PNG, DOC, XLS — max 10 MB)'}
                  <input hidden type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(e) => setFile(e.target.files[0] ?? null)} />
                </Button>
                {errors.file && <Alert severity="error" sx={{ mt: 1 }}>{errors.file[0]}</Alert>}
                {saving && progress > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 1, '& .MuiLinearProgress-bar': { bgcolor: BRAND } }} />
                    <Typography variant="caption" color="text.secondary">{progress}% uploaded</Typography>
                  </Box>
                )}
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={2} label="Notes (optional)" value={form.notes} onChange={set('notes')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving || (!docToEdit && !file)} sx={{ bgcolor: BRAND }}>
            {saving ? (docToEdit ? 'Saving…' : 'Uploading…') : (docToEdit ? 'Save Changes' : 'Upload')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

/* ── Main Page ────────────────────────────────────────────────────────── */
const Documents = () => {
  const isHR   = useSelector(selectIsHR);
  const user   = useSelector(selectCurrentUser);

  const [employees,   setEmployees]   = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [rows,        setRows]        = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [dialog,      setDialog]      = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);
  const [catFilter,   setCatFilter]   = useState('');
  const [expiryFilter,setExpiryFilter]= useState('');
  const [alertSending,setAlertSending]= useState(false);
  const [toast,       setToast]       = useState({ open: false, msg: '', sev: 'success' });

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  // For employees, pre-select their own record
  useEffect(() => {
    if (!isHR && user?.employee_id) {
      setSelectedEmp(user.employee_id);
    }
  }, [isHR, user]);

  // HR: load employee list for selector
  useEffect(() => {
    if (!isHR) return;
    employeeAPI.getAll({ per_page: 500 })
      .then((r) => {
        const list = r.data?.data ?? [];
        setEmployees(list);
        if (list.length > 0) setSelectedEmp(list[0].id);
      })
      .catch(() => {});
  }, [isHR]);

  const fetchDocs = useCallback(async () => {
    if (!selectedEmp) return;
    setLoading(true);
    try {
      const params = {};
      if (catFilter)    params.category      = catFilter;
      if (expiryFilter) params.expiry_status = expiryFilter;
      const r = await documentAPI.list(selectedEmp, params);
      setRows(r.data ?? []);
    } catch (_) { showToast('Failed to load documents', 'error'); }
    finally { setLoading(false); }
  }, [selectedEmp, catFilter, expiryFilter]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  // Real-time: refresh when a document is uploaded/deleted for the selected employee
  useHrFeed({ 'document.updated': fetchDocs });
  useUserFeed({ 'document.updated': fetchDocs });
  usePolling(fetchDocs, 60000);

  const handleDownload = async (doc) => {
    try {
      const res = await documentAPI.download(doc.id);
      const url = URL.createObjectURL(new Blob([res.data], { type: doc.mime_type }));
      const a   = document.createElement('a');
      a.href = url; a.download = doc.file_name; a.click();
      URL.revokeObjectURL(url);
    } catch (_) { showToast('Download failed', 'error'); }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      await documentAPI.delete(doc.id);
      showToast('Document deleted');
      fetchDocs();
    } catch (err) { showToast(err.response?.data?.message ?? 'Delete failed', 'error'); }
  };

  const handleSendAlerts = async () => {
    setAlertSending(true);
    try {
      const r = await documentAPI.sendExpiryAlerts({ days: 30 });
      showToast(`Expiry alerts sent to ${r.data?.emails_sent ?? 0} employee(s)`);
    } catch (_) { showToast('Failed to send alerts', 'error'); }
    finally { setAlertSending(false); }
  };

  // Summary chips
  const expiredCount      = rows.filter((d) => d.is_expired).length;
  const expiringSoonCount = rows.filter((d) => !d.is_expired && d.days_until_expiry !== null && d.days_until_expiry <= 30).length;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Documents</Typography>
          <Typography variant="body2" color="text.secondary">
            Store and manage employee documents — contracts, IDs, certificates and more
          </Typography>
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap">
          {isHR && (
            <Button variant="outlined" size="small" startIcon={alertSending ? <CircularProgress size={14} /> : <SendIcon />}
              disabled={alertSending} onClick={handleSendAlerts}
              sx={{ textTransform: 'none', borderColor: '#e65100', color: '#e65100' }}>
              Send Expiry Alerts
            </Button>
          )}
          <Button variant="contained" startIcon={<UploadIcon />} sx={{ bgcolor: BRAND, textTransform: 'none' }}
            onClick={() => { setEditTarget(null); setDialog(true); }}
            disabled={!selectedEmp}>
            Upload Document
          </Button>
        </Box>
      </Box>

      {/* Controls Row */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
        {/* Employee picker — HR only */}
        {isHR && (
          <TextField select size="small" label="Employee" value={selectedEmp}
            onChange={(e) => setSelectedEmp(e.target.value)} sx={{ minWidth: 240 }}>
            {employees.map((e) => (
              <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name}</MenuItem>
            ))}
          </TextField>
        )}

        <TextField select size="small" label="Category" value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">All Categories</MenuItem>
          {CATEGORIES.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
        </TextField>

        <TextField select size="small" label="Expiry" value={expiryFilter}
          onChange={(e) => setExpiryFilter(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="expiring_soon">Expiring in 30 days</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
        </TextField>

        {/* Summary chips */}
        {expiredCount > 0 && (
          <Chip icon={<ExpiredIcon />} label={`${expiredCount} Expired`} color="error" size="small" />
        )}
        {expiringSoonCount > 0 && (
          <Chip icon={<WarnIcon />} label={`${expiringSoonCount} Expiring Soon`} color="warning" size="small" />
        )}
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Document</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>File</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Uploaded By</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Expiry</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <DocIcon sx={{ fontSize: 48, color: 'text.disabled', display: 'block', mx: 'auto', mb: 1 }} />
                    <Typography color="text.secondary">No documents found</Typography>
                    <Typography variant="caption" color="text.disabled">
                      Upload the first document using the button above
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : rows.map((doc) => (
                <TableRow key={doc.id} hover sx={{ bgcolor: doc.is_expired ? '#fff8f8' : 'inherit' }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DocIcon sx={{ color: CAT_COLOR[doc.category] ?? '#546e7a', fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={600}>{doc.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={CATEGORIES.find((c) => c.value === doc.category)?.label ?? doc.category}
                      size="small"
                      sx={{ bgcolor: `${CAT_COLOR[doc.category]}15`, color: CAT_COLOR[doc.category], fontWeight: 600, fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.file_name}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">{fmtSz(doc.file_size)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{doc.uploaded_by?.name ?? '—'}</Typography>
                    <Typography variant="caption" color="text.disabled">{fmt(doc.created_at)}</Typography>
                  </TableCell>
                  <TableCell><ExpiryBadge doc={doc} /></TableCell>
                  <TableCell sx={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" color="text.secondary">{doc.notes ?? '—'}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Download">
                      <IconButton size="small" color="primary" onClick={() => handleDownload(doc)}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit details">
                      <IconButton size="small" onClick={() => { setEditTarget(doc); setDialog(true); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {isHR && (
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(doc)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <DocDialog
        open={dialog}
        onClose={() => setDialog(false)}
        employeeId={selectedEmp}
        docToEdit={editTarget}
        onSaved={(msg) => { showToast(msg); fetchDocs(); }}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Documents;
