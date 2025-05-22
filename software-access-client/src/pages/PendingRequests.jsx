import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PendingRequests = () => {
  const { role } = useAuth();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [showAll, setShowAll] = useState(false);

  if (!role || !['Manager', 'Admin', 'Employee'].includes(role)) {
    return (
      <div style={styles.pageWrapper}>
        <p style={styles.accessDenied}>Access denied.</p>
      </div>
    );
  }

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      if (showAll) {
        setRequests(res.data.requests);
      } else {
        setRequests(res.data.requests.filter(r => r.status === 'Pending'));
      }
      setMessage('');
    } catch (error) {
      setMessage('Error fetching requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [showAll]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/requests/${id}`, { status });
      setRequests(prev =>
        showAll
          ? prev.map(r => (r.id === id ? { ...r, status } : r))
          : prev.filter(r => r.id !== id)
      );
      setMessage(`Request ${status.toLowerCase()} successfully`);
    } catch (error) {
      setMessage('Error updating request');
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#f1c40f', color: '#333' };
      case 'Approved':
        return { backgroundColor: '#27ae60', color: 'white' };
      case 'Rejected':
        return { backgroundColor: '#e74c3c', color: 'white' };
      default:
        return {};
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>{showAll ? 'All Requests' : 'Pending Requests'}</h2>

        <button
          onClick={() => setShowAll(!showAll)}
          style={styles.toggleButton}
          aria-label="Toggle request view"
        >
          {showAll ? 'Show Pending Requests' : 'Show All Requests'}
        </button>

        {message && (
          <p
            style={
              message.toLowerCase().includes('error')
                ? styles.errorMessage
                : styles.successMessage
            }
          >
            {message}
          </p>
        )}

        {requests.length === 0 ? (
          <p style={styles.noDataMessage}>
            {showAll ? 'No requests found' : 'No pending requests'}
          </p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table} aria-label="Requests table">
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Software</th>
                  <th style={styles.th}>Access Type</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} style={styles.tr}>
                    <td style={styles.td}>{req.id}</td>
                    <td style={styles.td}>{req.user?.username || req.user?.id}</td>
                    <td style={styles.td}>{req.software?.name}</td>
                    <td style={styles.td}>{req.accessType}</td>
                    <td style={styles.td}>{req.reason}</td>
                    <td style={{ ...styles.td, ...styles.statusBadge, ...getStatusBadgeStyle(req.status) }}>
                      {req.status}
                    </td>
                    <td style={styles.td}>
                      {(role === 'Admin' || role === 'Manager') && req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'Approved')}
                            style={{ ...styles.actionButton, ...styles.approveButton }}
                            aria-label={`Approve request ${req.id}`}
                          >
                            Approve
                          </button>{' '}
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                            style={{ ...styles.actionButton, ...styles.rejectButton }}
                            aria-label={`Reject request ${req.id}`}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span style={styles.readOnlyText}>Read-only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f7fafc',
    padding: '40px 60px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box',
  },
  container: {
    width: '100%',
    maxWidth: '100%', // full width container
    backgroundColor: 'white',
    borderRadius: 10,
    padding: '30px 40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    overflowX: 'auto', // allow horizontal scroll if needed on small screens
  },
  title: {
    marginBottom: 20,
    color: '#34495e',
    fontWeight: '700',
    fontSize: '28px',
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#5d0076',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: 20,
    transition: 'background-color 0.3s ease',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  errorMessage: {
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  successMessage: {
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  noDataMessage: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#7f8c8d',
    marginTop: 30,
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto', // horizontal scroll if table is too wide
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '15px',
    color: '#2c3e50',
    minWidth: 800, // ensure min width so table columns don't get too narrow
  },
  th: {
    borderBottom: '2px solid #bdc3c7',
    padding: '12px 15px',
    textAlign: 'left',
    backgroundColor: '#ecf0f1',
    whiteSpace: 'nowrap',
  },
  tr: {
    transition: 'background-color 0.3s ease',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #ecf0f1',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  },
  actionButton: {
    padding: '6px 14px',
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    marginRight: 8,
    transition: 'background-color 0.3s ease',
  },
  approveButton: {
    backgroundColor: '#27ae60',
    color: 'white',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: 10,
    display: 'inline-block',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,  // <-- add this line

    minWidth: 80,
  },
  readOnlyText: {
    color: '#7f8c8d',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  accessDenied: {
    color: '#e74c3c',
    fontSize: '18px',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 50,
  },
};

export default PendingRequests;
