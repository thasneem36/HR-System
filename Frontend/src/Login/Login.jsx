import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { authAPI } from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.login(form);
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      // Store user data if needed
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect to employees page
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f6fa"
    >
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 3, p: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" color="#941936" gutterBottom>
            Welcome Back
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
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
              sx={{ mt: 2, backgroundColor: '#941936', '&:hover': { backgroundColor: '#7a0f2b' } }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?
            </Typography>
            <Link component={RouterLink} to="/register" underline="hover" sx={{ color: '#941936', fontWeight: 'bold' }}>
              Go to Register
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 