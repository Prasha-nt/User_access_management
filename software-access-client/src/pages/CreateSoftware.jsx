import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateSoftware = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevels, setAccessLevels] = useState([]);
  const [message, setMessage] = useState('');

  const { role } = useAuth();
  const navigate = useNavigate();

  if (!role || role !== 'Admin') {
    return (
      <div style={styles.pageWrapper}>
        <p style={{ color: '#e74c3c', fontSize: '18px' }}>
          Access denied. Only Admins can access this page.
        </p>
      </div>
    );
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAccessLevels(prev => [...prev, value]);
    } else {
      setAccessLevels(prev => prev.filter(level => level !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!name || !description || accessLevels.length === 0) {
      setMessage('Please fill all fields and select at least one access level.');
      return;
    }

    try {
      await api.post('/software', { name, description, accessLevels });
      setMessage('Software created successfully!');
      setName('');
      setDescription('');
      setAccessLevels([]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating software');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Create New Software</h2>
        {message && <p style={message.includes('successfully') ? styles.success : styles.error}>{message}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Name:
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Description:
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              style={{ ...styles.input, height: '100px', resize: 'vertical' }}
            />
          </label>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Access Levels:</legend>
            {['Read', 'Write', 'Admin'].map(level => (
              <label key={level} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={level}
                  checked={accessLevels.includes(level)}
                  onChange={handleCheckboxChange}
                  style={styles.checkbox}
                />
                {level}
              </label>
            ))}
          </fieldset>

          <button type="submit" style={styles.button}>Create Software</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    height: '100vh',
    width: '98vw',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  container: {
    backgroundColor: '#fff',
    padding: '40px 50px',
    borderRadius: '10px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    maxWidth: '600px',
    marginTop: '30px',
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    marginBottom: '25px',
    fontWeight: '700',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    textAlign: 'left',
  },
  label: {
    fontWeight: '600',
    color: '#555',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',
  },
  input: {
    marginTop: '8px',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#4a90e2',
  },
  fieldset: {
    border: 'none',
    padding: 0,
    marginTop: '10px',
  },
  legend: {
    fontWeight: '600',
    marginBottom: '10px',
    fontSize: '16px',
    color: '#555',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
    fontSize: '15px',
    color: '#333',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
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
  success: {
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: '15px',
  },
  error: {
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: '15px',
  },
};

export default CreateSoftware;
