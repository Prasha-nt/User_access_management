import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PendingRequests = () => {
  const { role } = useAuth();
  const [allRequests, setAllRequests] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [message, setMessage] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      const reqs = res.data.requests;
      setAllRequests(reqs);
      setDisplayed(reqs.filter(r => r.status === 'Pending'));
      setMessage('');
    } catch {
      setMessage('error:Error fetching requests');
    }
  };

  const handleTab = (tab) => {
    setActiveTab(tab);
    setDisplayed(tab === 'pending' ? allRequests.filter(r => r.status === 'Pending') : allRequests);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/requests/${id}`, { status });
      const updated = allRequests.map(r => r.id === id ? { ...r, status } : r);
      setAllRequests(updated);
      setDisplayed(activeTab === 'pending' ? updated.filter(r => r.status === 'Pending') : updated);
      setMessage(`success:Request ${status.toLowerCase()} successfully`);
    } catch {
      setMessage('error:Error updating request');
    }
  };

  const total    = allRequests.length;
  const pending  = allRequests.filter(r => r.status === 'Pending').length;
  const approved = allRequests.filter(r => r.status === 'Approved').length;
  const rejected = allRequests.filter(r => r.status === 'Rejected').length;

  const isError = message.startsWith('error:');
  const msgText = message.replace(/^(error|success):/, '');

  if (!role || !['Manager', 'Admin'].includes(role)) {
    return <div className="alert alert-error">Access denied.</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Access Requests</h1>
        <p className="page-subtitle">Review and manage software access requests from employees.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value clr-warn">{pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved</div>
          <div className="stat-value clr-success">{approved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-value clr-err">{rejected}</div>
        </div>
      </div>

      {message && (
        <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>{msgText}</div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="tab-bar">
            <button
              className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => handleTab('pending')}
            >
              Pending ({pending})
            </button>
            <button
              className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTab('all')}
            >
              All ({total})
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          {displayed.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-title">No requests found</div>
              <div className="empty-desc">
                {activeTab === 'pending'
                  ? 'All caught up — no pending requests.'
                  : 'No requests have been submitted yet.'}
              </div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Software</th>
                  <th>Access Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(req => (
                  <tr key={req.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
                      #{req.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {req.user?.username || req.user?.id}
                    </td>
                    <td>{req.software?.name}</td>
                    <td>
                      <span className="pill-tag">{req.accessType}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 220, fontSize: '0.82rem' }}>
                      {req.reason}
                    </td>
                    <td>
                      <span className={`badge badge-${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {(role === 'Admin' || role === 'Manager') && req.status === 'Pending' ? (
                        <div className="action-btns">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdateStatus(req.id, 'Approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="read-only-label">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;
