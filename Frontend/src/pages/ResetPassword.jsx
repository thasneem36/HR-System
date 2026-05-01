import { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, CircularProgress, IconButton, InputAdornment,
  TextField, Typography, Alert, Paper,
} from '@mui/material';
import {
  Lock as LockIcon, Visibility, VisibilityOff,
  ArrowBack as BackIcon, CheckCircle as DoneIcon,
} from '@mui/icons-material';
import { authAPI } from '../services/api';

const BRAND      = '#941936';
const BRAND_DARK = '#6b1127';

const ResetPassword = () => {
  const navigate                    = useNavigate();
  const [searchParams]              = useSearchParams();
  const token                       = searchParams.get('token') ?? '';
  const emailParam                  = searchParams.get('email') ?? '';

  const [form, setForm]             = useState({ password: '', password_confirmation: '' });
  const [showPass, setShowPass]     = useState(false);
  const [showConf, setShowConf]     = useState(false);
  const [loading,  setLoading]      = useState(false);
  const [done,     setDone]         = useState(false);
  const [error,    setError]        = useState('');
  const [fieldErr, setFieldErr]     = useState({});

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErr({});

    if (form.password.length < 8) {
      setFieldErr({ password: 'Password must be at least 8 characters.' });
      return;
    }
    if (form.password !== form.password_confirmation) {
      setFieldErr({ password_confirmation: 'Passwords do not match.' });
      return;
    }

    if (!token) { setError('Invalid or missing reset token. Please request a new link.'); return; }

    setLoading(true);
    try {
      await authAPI.resetPassword({
        token,
        email:                 emailParam,
        password:              form.password,
        password_confirmation: form.password_confirmation,
      });
      setDone(true);
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Failed to reset password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Invalid link ── */
  if (!token) {
    return (
      <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 60%, #3d0a16 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Paper elevation={24} sx={{ maxWidth: 420, width: '100%', borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>Invalid or missing reset token.</Alert>
          <Button variant="outlined" component={RouterLink} to="/forgot-password"
            sx={{ textTransform: 'none', color: BRAND, borderColor: BRAND }}>
            Request a new link
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 60%, #3d0a16 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
      }}
    >
      <Paper elevation={24} sx={{ width: '100%', maxWidth: 420, borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ height: 5, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})` }} />

        <Box sx={{ p: 4 }}>
          <Box
            component={RouterLink} to="/login"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5,
              color: BRAND, textDecoration: 'none', fontSize: 13, fontWeight: 600, mb: 3,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <BackIcon sx={{ fontSize: 16 }} /> Back to Login
          </Box>

          {!done ? (
            <>
              <Typography variant="h5" fontWeight={800} gutterBottom>Set New Password</Typography>
              <Typography variant="body2" color="text.secondary" mb={emailParam ? 1.5 : 3}>
                Enter a strong new password for your account.
              </Typography>
              {emailParam && (
                <Typography variant="body2" color={BRAND} fontWeight={600} mb={3}>
                  {emailParam}
                </Typography>
              )}

              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={2.5}>
                  <TextField
                    fullWidth required
                    label="New Password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    error={!!fieldErr.password}
                    helperText={fieldErr.password ?? 'Minimum 8 characters'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: BRAND, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowPass((p) => !p)} edge="end">
                            {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth required
                    label="Confirm New Password"
                    type={showConf ? 'text' : 'password'}
                    value={form.password_confirmation}
                    onChange={set('password_confirmation')}
                    error={!!fieldErr.password_confirmation}
                    helperText={fieldErr.password_confirmation}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: BRAND, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowConf((p) => !p)} edge="end">
                            {showConf ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit" fullWidth variant="contained" size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5, fontWeight: 700, fontSize: 15, textTransform: 'none', borderRadius: 2,
                      background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
                      boxShadow: `0 4px 15px ${BRAND}40`,
                      '&:hover': { background: `linear-gradient(135deg, ${BRAND_DARK}, #3d0a16)` },
                    }}
                  >
                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Reset Password'}
                  </Button>
                </Box>
              </form>
            </>
          ) : (
            /* ── Success ── */
            <Box textAlign="center" py={2}>
              <DoneIcon sx={{ fontSize: 64, color: '#2e7d32', mb: 2 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>Password Reset!</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Your password has been updated successfully. You can now log in with your new password.
              </Typography>
              <Button
                fullWidth variant="contained" size="large"
                onClick={() => navigate('/login')}
                sx={{
                  py: 1.5, fontWeight: 700, textTransform: 'none', borderRadius: 2,
                  background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
                }}
              >
                Go to Login
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
