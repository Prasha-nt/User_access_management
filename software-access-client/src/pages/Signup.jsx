import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';

const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Employee'
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/signup', form);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2>Sign Up</h2>
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
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
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
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option> {/* to check only later remove this */}
          </select>
          <button type="submit" style={styles.button}>Sign Up</button>
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
  select: {
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    backgroundColor: 'white',
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

export default Signup;
