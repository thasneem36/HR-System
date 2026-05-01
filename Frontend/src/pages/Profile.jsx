import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert, Avatar, Box, Button, Card, CardContent, Chip,
  Divider, Grid, Paper, Snackbar, TextField, Typography,
} from '@mui/material';
import { selectCurrentUser } from '../store/authSlice';
import { authAPI } from '../services/api';

const BRAND = '#941936';

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  hr_manager:  'HR Manager',
  employee:    'Employee',
};

const InfoRow = ({ label, value }) => (
  <Box display="flex" gap={2} py={0.5}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 160 }}>{label}</Typography>
    <Typography variant="body2" fontWeight={500}>{value ?? '—'}</Typography>
  </Box>
);

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const emp  = user?.employee;

  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [pwError, setPwError]   = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [toast, setToast]       = useState({ open: false, msg: '', sev: 'success' });

  const showToast = (msg, sev = 'success') => setToast({ open: true, msg, sev });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError('New passwords do not match');
      return;
    }
    setPwError('');
    setPwSaving(true);
    try {
      await authAPI.changePassword({
        current_password:      pwForm.current_password,
        new_password:          pwForm.new_password,
        new_password_confirmation: pwForm.confirm_password,
      });
      showToast('Password changed successfully');
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPwError(err.response?.data?.message ?? 'Failed to change password');
    } finally { setPwSaving(false); }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>My Profile</Typography>

      <Grid container spacing={3}>
        {/* Avatar card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{ width: 96, height: 96, bgcolor: BRAND, fontSize: 36, mx: 'auto', mb: 2 }}>
                {user?.name?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Chip label={ROLE_LABELS[user?.role] ?? user?.role} size="small" sx={{ mt: 1.5, bgcolor: `${BRAND}18`, color: BRAND }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Info + password */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Account Information</Typography>
            <InfoRow label="Full Name" value={user?.name} />
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Role" value={ROLE_LABELS[user?.role] ?? user?.role} />
            {emp && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" mb={1}>Employee Details</Typography>
                <InfoRow label="Employee ID" value={emp?.id} />
                <InfoRow label="Phone" value={emp?.phone} />
                <InfoRow label="NIC" value={emp?.nic} />
                <InfoRow label="Department" value={emp?.department?.name} />
                <InfoRow label="Job Title" value={emp?.job?.title} />
                <InfoRow label="Hire Date" value={emp?.hire_date} />
                <InfoRow label="Status" value={emp?.status} />
                <InfoRow label="Address" value={emp?.address} />
              </>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Change Password</Typography>
            <form onSubmit={handleChangePassword}>
              {pwError && <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth required type="password" label="Current Password"
                    value={pwForm.current_password} onChange={(e) => setPwForm((f) => ({ ...f, current_password: e.target.value }))} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required type="password" label="New Password"
                    value={pwForm.new_password} onChange={(e) => setPwForm((f) => ({ ...f, new_password: e.target.value }))} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required type="password" label="Confirm New Password"
                    value={pwForm.confirm_password} onChange={(e) => setPwForm((f) => ({ ...f, confirm_password: e.target.value }))} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" disabled={pwSaving} sx={{ bgcolor: BRAND }}>
                    {pwSaving ? 'Updating...' : 'Change Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert severity={toast.sev} onClose={() => setToast((t) => ({ ...t, open: false }))}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
