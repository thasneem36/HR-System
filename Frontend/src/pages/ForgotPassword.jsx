import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, CircularProgress, InputAdornment,
  TextField, Typography, Alert, Paper,
} from '@mui/material';
import { Email as EmailIcon, ArrowBack as BackIcon, CheckCircle as DoneIcon } from '@mui/icons-material';
import { authAPI } from '../services/api';

const BRAND      = '#941936';
const BRAND_DARK = '#6b1127';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 60%, #3d0a16 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <Box sx={{ height: 5, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})` }} />

        <Box sx={{ p: 4 }}>
          {/* Back link */}
          <Box
            component={RouterLink}
            to="/login"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5,
              color: BRAND, textDecoration: 'none', fontSize: 13, fontWeight: 600, mb: 3,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <BackIcon sx={{ fontSize: 16 }} /> Back to Login
          </Box>

          {!sent ? (
            <>
              {/* Title */}
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Forgot Password?
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Enter your university login email and we'll send you a link to reset your password.
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="University Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="firstname.lastname@university.lk"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: BRAND, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: 15,
                    textTransform: 'none',
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
                    boxShadow: `0 4px 15px ${BRAND}40`,
                    '&:hover': { background: `linear-gradient(135deg, ${BRAND_DARK}, #3d0a16)` },
                  }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            /* ── Success state ── */
            <Box textAlign="center" py={2}>
              <DoneIcon sx={{ fontSize: 64, color: '#2e7d32', mb: 2 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Reset Link Sent!
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                A password reset link has been sent to:
              </Typography>
              <Typography variant="body2" fontWeight={700} color={BRAND} mb={2}>
                {email}
              </Typography>
              {import.meta.env.DEV && (
                <Alert severity="info" sx={{ borderRadius: 2, textAlign: 'left', mb: 3 }}>
                  <strong>Dev only:</strong> Reset link is in{' '}
                  <code>storage/logs/laravel.log</code> — search <em>"Reset Password"</em>.
                </Alert>
              )}
              <Button
                fullWidth variant="outlined"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none', fontWeight: 600, borderColor: BRAND, color: BRAND }}
              >
                Back to Login
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
