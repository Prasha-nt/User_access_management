import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LEVELS = ['Read', 'Write', 'Admin'];

const CreateSoftware = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevels, setAccessLevels] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { role } = useAuth();

  if (!role || role !== 'Admin') {
    return <div className="alert alert-error" style={{ maxWidth: 400 }}>Access denied. Admins only.</div>;
  }

  const toggleLevel = (level) => {
    setAccessLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!name || !description || accessLevels.length === 0) {
      setMessage('error:Please fill all fields and select at least one access level.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/software', { name, description, accessLevels });
      setMessage('success:Software created successfully!');
      setName('');
      setDescription('');
      setAccessLevels([]);
    } catch (error) {
      setMessage('error:' + (error.response?.data?.message || 'Error creating software'));
    } finally {
      setLoading(false);
    }
  };

  const isError = message.startsWith('error:');
  const isSuccess = message.startsWith('success:');
  const msgText = message.replace(/^(error|success):/, '');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Create Software</h1>
        <p className="page-subtitle">Add a new software entry to the catalog with access levels for employees to request.</p>
      </div>

      {message && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'}`}>
          {msgText}
        </div>
      )}

      <div className="form-section">
        <div className="form-section-title">Software Details</div>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-field">
            <label>Software Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Jira, Salesforce, Slack"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              className="form-textarea"
              placeholder="Brief description of this software and its purpose…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Access Levels</label>
            <div className="checkbox-group">
              {LEVELS.map(level => (
                <label
                  key={level}
                  className={`checkbox-item ${accessLevels.includes(level) ? 'checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={accessLevels.includes(level)}
                    onChange={() => toggleLevel(level)}
                  />
                  <span className="checkbox-item-label">{level} Access</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? 'Creating…' : '+ Create Software'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSoftware;
