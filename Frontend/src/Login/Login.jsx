import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link,
} from '@mui/material';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Sample users data
  const users = [
    { email: 'admin@example.com', password: '123', role: 'admin' },
    { email: 'rm@example.com', password: '123', role: 'rm' },
    { email: 'employee@example.com', password: '123', role: 'employee' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (user) => user.email === form.email && user.password === form.password
    );

    if (user) {
      localStorage.setItem('token', 'sampleToken123');
      localStorage.setItem('role', user.role);

      if (user.role === 'admin') navigate('/overview');
      else if (user.role === 'employee') navigate('/employee');
      else if (user.role === 'rm') navigate('/rmD');``
    } else {
      alert('Login failed. Invalid credentials.');
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
              sx={{ mt: 2, backgroundColor: '#941936', '&:hover': { backgroundColor: '#7a0f2b' } }}
            >
              Login
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