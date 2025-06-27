import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import { authAPI } from '../services/api';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    nic: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(form);
      // After successful registration, redirect to login
      navigate('/login', { state: { message: 'Registration successful. Please login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            Create Your Account
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleRegister} noValidate>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
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
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            />
            <TextField
              label="NIC"
              fullWidth
              margin="normal"
              required
              value={form.nic}
              onChange={(e) => setForm({ ...form, nic: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              margin="normal"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2, backgroundColor: '#941936', '&:hover': { backgroundColor: '#7a0f2b' } }}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?
            </Typography>
            <MuiLink component={Link} to="/login" underline="hover" sx={{ color: '#941936', fontWeight: 'bold' }}>
              Back to Login
            </MuiLink>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
