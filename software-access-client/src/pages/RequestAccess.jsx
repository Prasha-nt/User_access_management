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

  useEffect(() => {
    const fetchSoftwares = async () => {
      try {
        const res = await api.get('/software');
        setSoftwares(res.data.software);
      } catch {
        setMessage('Error fetching software list');
      }
    };
    fetchSoftwares();
  }, []);

  useEffect(() => {
    if (selectedSoftware) {
      const software = softwares.find(s => s.id === parseInt(selectedSoftware));
      setAccessLevels(software ? software.accessLevels : []);
      setAccessType('');
    }
  }, [selectedSoftware, softwares]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSoftware || !accessType || !reason) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      await api.post('/requests', {
        softwareId: selectedSoftware,
        accessType,
        reason,
      });
      setMessage('✅ Access request submitted!');
      setSelectedSoftware('');
      setAccessType('');
      setReason('');
      setAccessLevels([]);
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Error submitting request');
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
      setMessage('Error fetching your requests');
    }
  };

  if (role === undefined) return <p>Loading...</p>;
  if (!['Admin', 'Employee'].includes(role)) return <p>Access Denied</p>;

  return (
    <div style={styles.pageWrapper}>
      {message && (
        <p style={message.includes('submitted') ? styles.success : styles.error}>
          {message}
        </p>
      )}

      {/* Access Request Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Request Access</h2>

        <label style={styles.label}>Software</label>
        <select
          value={selectedSoftware}
          onChange={e => setSelectedSoftware(e.target.value)}
          required
          style={styles.select}
        >
          <option value="">-- Select Software --</option>
          {softwares.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <label style={styles.label}>Access Type</label>
        <select
          value={accessType}
          onChange={e => setAccessType(e.target.value)}
          required
          disabled={!accessLevels.length}
          style={{
            ...styles.select,
            opacity: accessLevels.length ? 1 : 0.6,
            cursor: accessLevels.length ? 'pointer' : 'not-allowed',
          }}
        >
          <option value="">-- Select Access Type --</option>
          {accessLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <label style={styles.label}>Reason</label>
        <textarea
          placeholder="Why do you need access?"
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={4}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.submitButton}>
          🚀 Submit Request
        </button>
      </form>

      {/* View Requests Button */}
      <button onClick={fetchMyRequests} style={styles.refreshButton}>
        {showRequests ? '🔄 Refresh My Requests' : '📄 View My Requests'}
      </button>

      {/* All Previous Requests in Table */}
      {showRequests && (
        <div style={styles.cardTableWrapper}>
          <h3 style={styles.tableHeading}>📑 My Access Requests</h3>
          {myRequests.length === 0 ? (
            <p style={styles.noData}>No access requests found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Software</th>
                    <th style={styles.th}>Access Type</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map(req => (
                    <tr key={req.id}>
                      <td style={styles.td}>{req.id}</td>
                      <td style={styles.td}>{req.software?.name || 'N/A'}</td>
                      <td style={styles.td}>{req.accessType}</td>
                      <td style={styles.td}>{req.reason}</td>
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: '600',
                          color:
                            req.status === 'Approved'
                              ? '#2ecc71'
                              : req.status === 'Rejected'
                              ? '#e74c3c'
                              : '#f39c12',
                        }}
                      >
                        {req.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  pageWrapper: {
    padding: '30px 16px',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px 24px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '30px',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '10px',
  },
  label: {
    fontWeight: '600',
    color: '#555',
  },
  select: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    backgroundColor: 'white',
    color: '#333',
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    backgroundColor: 'white',
    color: '#333',
    resize: 'vertical',
  },
  submitButton: {
    marginTop: '10px',
    padding: '14px',
    backgroundColor: '#5d0076',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  refreshButton: {
    padding: '12px 24px',
    background: 'linear-gradient(to right, #00c6ff, #0072ff)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '40px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  cardTableWrapper: {
    width: '100%',
    maxWidth: '1000px',
  },
  tableHeading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#222',
    fontSize: '22px',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    color: '#333',
    marginBottom: '30px',
  },
  th: {
    backgroundColor: '#f4f4f4',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'top',
    whiteSpace: 'normal',
  },
  noData: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  success: {
    color: '#2ecc71',
    fontWeight: '600',
    marginBottom: '20px',
  },
  error: {
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: '20px',
  },
};

export default RequestAccess;
