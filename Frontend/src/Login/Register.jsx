import { useState } from 'react';
import axios from '../axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/register', form);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'employee') navigate('/employee');
      else if (user.role === 'rm') navigate('/rm');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#f5f6fa' }}>
      <div className="card shadow p-4 border-0" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 className="text-center mb-4" style={{ color: '#941936' }}>Create Your Account</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-muted">Role</label>
            <select
              className="form-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="admin">HR (Admin)</option>
              <option value="employee">Employee</option>
              <option value="rm">RM</option>
            </select>
          </div>

          <button type="submit" className="btn text-white w-100" style={{ backgroundColor: '#941936' }}>
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-1 text-muted">Already have an account?</p>
          <Link to="/" className="fw-bold text-decoration-none" style={{ color: '#941936' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
