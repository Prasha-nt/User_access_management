import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!role || role !== 'Admin') {
    return (
      <div style={styles.wrapper}>
        <p style={{ color: '#e74c3c', fontSize: '18px' }}>
          Access denied. Only Admins can access this page.
        </p>
      </div>
    );
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setAccessLevels(prev =>
      checked ? [...prev, value] : prev.filter(level => level !== value)
    );
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
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create New Software</h2>
        {message && (
          <p style={message.includes('successfully') ? styles.success : styles.error}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Name
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Description
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              style={styles.textarea}
            />
          </label>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Access Levels</legend>
            {['Read', 'Write', 'Admin'].map(level => (
              <label key={level} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={level}
                  checked={accessLevels.includes(level)}
                  onChange={handleCheckboxChange}
                  style={{
                    ...styles.checkbox,
                    ...(accessLevels.includes(level) ? styles.checkedCheckbox : {})
                  }}
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
  wrapper: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    boxSizing: 'border-box',
    fontFamily: 'Poppins, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#fff',
    borderRadius: '14px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '36px 30px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  success: {
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: '15px',
    textAlign: 'center',
  },
  error: {
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: '15px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  label: {
    fontWeight: '500',
    fontSize: '16px',
    color: '#555',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  input: {
    padding: '12px 16px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1.5px solid #ccc',
    backgroundColor: '#fff',
    outline: 'none',
    color: '#333',
    transition: 'border 0.2s ease',
  },
  textarea: {
    padding: '12px 16px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1.5px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
  },
  fieldset: {
    border: 'none',
    padding: '0',
    marginTop: '5px',
  },
  legend: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#555',
    marginBottom: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    color: '#333',
    marginBottom: '10px',
    position: 'relative',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    appearance: 'none',
    width: '20px',
    height: '20px',
    border: '2px solid #5d0076',
    borderRadius: '4px',
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  checkedCheckbox: {
    backgroundColor: '#5d0076',
    borderColor: '#5d0076',
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='20 6 9 17 4 12' /%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '14px',
  },
  button: {
    padding: '14px',
    background: 'linear-gradient(to right, #9b1d9b, #5d0076)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};

export default CreateSoftware;
