import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/login', {
        username: form.username,
        password: form.password,
      });

      const { token, role } = res.data;
      login(token, role);

      if (role === 'Admin') navigate('/create-software');
      else if (role === 'Manager') navigate('/pending-requests');
      else navigate('/request-access');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  container: {
    width: '100%',
    maxWidth: '450px',
    padding: '40px 50px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  error: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
  },
  button: {
    padding: '14px',
    backgroundColor: '#5d0076',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Login;
