import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RequestAccess = () => {
  const { role, user } = useAuth();
  const [softwares, setSoftwares] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [accessType, setAccessType] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [accessLevels, setAccessLevels] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/software')
      .then(res => setSoftwares(res.data.software))
      .catch(() => setMessage('error:Error fetching software list'));
  }, []);

  useEffect(() => {
    if (selectedSoftware) {
      const sw = softwares.find(s => s.id === parseInt(selectedSoftware));
      setAccessLevels(sw?.accessLevels || []);
      setAccessType('');
    }
  }, [selectedSoftware, softwares]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSoftware || !accessType || !reason) {
      setMessage('error:Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/requests', { softwareId: selectedSoftware, accessType, reason });
      setMessage('success:Access request submitted successfully!');
      setSelectedSoftware('');
      setAccessType('');
      setReason('');
      setAccessLevels([]);
    } catch (error) {
      setMessage('error:' + (error.response?.data?.message || 'Error submitting request'));
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/my-requests');
      const filtered = role === 'Employee' && user?.email
        ? res.data.requests.filter(req => req.user?.email === user.email)
        : res.data.requests;
      setMyRequests(filtered);
      setShowRequests(true);
    } catch {
      setMessage('error:Error fetching your requests');
    }
  };

  if (role === undefined) return <p style={{ color: 'var(--text-muted)' }}>Loading…</p>;
  if (!['Admin', 'Employee'].includes(role)) return <div className="alert alert-error">Access Denied</div>;

  const isError = message.startsWith('error:');
  const msgText = message.replace(/^(error|success):/, '');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Request Access</h1>
        <p className="page-subtitle">Submit a request to access software tools you need for your work.</p>
      </div>

      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>{msgText}</div>
      )}

      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Request form */}
        <div className="form-section" style={{ flex: '0 0 340px' }}>
          <div className="form-section-title">New Request</div>
          <form onSubmit={handleSubmit} className="form-stack">
            <div className="form-field">
              <label>Software</label>
              <select
                className="form-select"
                value={selectedSoftware}
                onChange={e => setSelectedSoftware(e.target.value)}
                required
              >
                <option value="">Select software…</option>
                {softwares.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Access Type</label>
              <select
                className="form-select"
                value={accessType}
                onChange={e => setAccessType(e.target.value)}
                required
                disabled={!accessLevels.length}
                style={{ opacity: accessLevels.length ? 1 : 0.5, cursor: accessLevels.length ? 'pointer' : 'not-allowed' }}
              >
                <option value="">Select access type…</option>
                {accessLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Reason for Access</label>
              <textarea
                className="form-textarea"
                placeholder="Explain why you need access to this software…"
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* My requests panel */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 16,
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
              My Requests
            </h2>
            <button className="btn btn-ghost btn-sm" onClick={fetchMyRequests}>
              {showRequests ? '↻ Refresh' : 'Load'}
            </button>
          </div>

          {!showRequests ? (
            <div className="empty-state" style={{
              background: 'white', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
            }}>
              <div className="empty-icon">📄</div>
              <div className="empty-title">No requests loaded</div>
              <div className="empty-desc">Click "Load" to view your submissions.</div>
            </div>
          ) : myRequests.length === 0 ? (
            <div className="empty-state" style={{
              background: 'white', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
            }}>
              <div className="empty-icon">📭</div>
              <div className="empty-title">No requests yet</div>
              <div className="empty-desc">Submit your first access request using the form.</div>
            </div>
          ) : (
            <div className="req-cards">
              {myRequests.map(req => (
                <div key={req.id} className="req-card">
                  <div className="req-card-top">
                    <div>
                      <div className="req-card-name">{req.software?.name || 'N/A'}</div>
                      <div className="req-card-type">{req.accessType} access</div>
                    </div>
                    <span className={`badge badge-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="req-card-reason">{req.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RequestAccess;
