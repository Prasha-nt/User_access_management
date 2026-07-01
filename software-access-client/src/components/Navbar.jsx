import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!token) return null;

  const links = [
    role === 'Admin' && { to: '/create-software', icon: '⚙️', label: 'Create Software' },
    (role === 'Employee' || role === 'Admin') && { to: '/request-access', icon: '📋', label: 'Request Access' },
    (role === 'Manager' || role === 'Admin') && { to: '/pending-requests', icon: '🔔', label: 'Pending Requests' },
  ].filter(Boolean);

  const roleLabel = { Admin: 'Administrator', Manager: 'Team Manager', Employee: 'Team Member' };

  return (
    <>
      <div className="mobile-bar">
        <span className="mobile-bar-logo">StaffSecure</span>
        <button className="mobile-bar-btn" onClick={() => setOpen(o => !o)}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      <div
        className={`sidebar-overlay ${open ? 'visible' : ''}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-row">
            <div className="sidebar-brand-icon">🔐</div>
            <span className="sidebar-brand-name">StaffSecure</span>
          </div>
          <div className="sidebar-brand-sub">Access Management</div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {links.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{role?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div className="user-chip-name">{role}</div>
              <div className="user-chip-role">{roleLabel[role] || role}</div>
            </div>
          </div>
          <button className="btn-signout" onClick={handleLogout}>
            <span>⎋</span> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
