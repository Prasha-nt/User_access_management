import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', form);
      const { token, role } = res.data;
      login(token, role);
      if (role === 'Admin') navigate('/create-software');
      else if (role === 'Manager') navigate('/pending-requests');
      else navigate('/request-access');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="auth-brand-mark">
          <div className="auth-brand-icon-wrap">🔐</div>
          <span className="auth-brand-label">StaffSecure</span>
        </div>
        <h2 className="auth-headline">Manage Access.<br />Stay Secure.</h2>
        <p className="auth-sub">
          A centralized platform to manage software access requests across your organization.
        </p>
        <div className="auth-features">
          {[
            'Role-based access control',
            'Manager approval workflow',
            'Real-time request tracking',
            'Audit-ready request history',
          ].map(f => (
            <div key={f} className="auth-feature-item">
              <div className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-panel-right">
        <h1 className="auth-form-title">Welcome back</h1>
        <p className="auth-form-desc">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one</Link>
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-field">
            <label>Username</label>
            <input
              className="form-input"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
