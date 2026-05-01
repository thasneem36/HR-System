import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box, Button, Card, CardContent,
  TextField, Typography, Alert,
} from '@mui/material';
import { authAPI } from '../services/api';
import { setCredentials } from '../store/authSlice';

const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login(form);
      const { token, user } = res.data;

      dispatch(setCredentials({ token, user }));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f6fa">
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 3, p: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" color="#941936" gutterBottom fontWeight={700}>
            University HR System
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" mb={3}>
            Sign in to your account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2, py: 1.2, backgroundColor: '#941936', '&:hover': { backgroundColor: '#7a0f2b' } }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
