import { useState } from 'react';
import axios from '../axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', form);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'employee') navigate('/employee');
      else if (user.role === 'rm') navigate('/rm');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#f5f6fa' }}>
      <div className="card shadow p-4 border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4" style={{ color: '#941936' }}>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#941936' }}>
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-1 text-muted">Don't have an account?</p>
          <Link to="/register" className="fw-bold text-decoration-none" style={{ color: '#941936' }}>
            Go to Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
