import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/api';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'Employee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/auth/signup', form);
      alert('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
        <h2 className="auth-headline">Join Your<br />Organization.</h2>
        <p className="auth-sub">
          Create your account to request software access through your organization's secure portal.
        </p>
        <div className="auth-features">
          {[
            'Employees can request software access',
            'Managers review and approve requests',
            'Admins manage the software catalog',
            'All activity is logged and auditable',
          ].map(f => (
            <div key={f} className="auth-feature-item">
              <div className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-panel-right">
        <h1 className="auth-form-title">Create account</h1>
        <p className="auth-form-desc">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-field">
            <label>Username</label>
            <input
              className="form-input"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
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
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Role</label>
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
