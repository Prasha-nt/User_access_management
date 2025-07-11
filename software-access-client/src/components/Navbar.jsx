import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth >= 768) setMenuOpen(false); // Close menu on desktop
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>StaffSecure</div>

      {isMobile && (
        <div style={styles.hamburger} onClick={toggleMenu}>
          <div style={styles.bar}></div>
          <div style={styles.bar}></div>
          <div style={styles.bar}></div>
        </div>
      )}

      <ul style={{ 
        ...styles.navLinks, 
        ...(isMobile 
          ? (menuOpen ? styles.navLinksMobileActive : styles.navLinksMobileHidden) 
          : styles.navLinksDesktop) 
      }}>
        {!token ? (
          <>
            <li><Link to="/login" onClick={() => setMenuOpen(false)} style={styles.link}>Login</Link></li>
            <li><Link to="/signup" onClick={() => setMenuOpen(false)} style={styles.link}>Signup</Link></li>
          </>
        ) : (
          <>
            {role === 'Admin' && (
              <li><Link to="/create-software" onClick={() => setMenuOpen(false)} style={styles.link}>Create Software</Link></li>
            )}
            {(role === 'Employee' || role === 'Admin') && (
              <li><Link to="/request-access" onClick={() => setMenuOpen(false)} style={styles.link}>Request Access</Link></li>
            )}
            {(role === 'Manager' || role === 'Admin') && (
              <li><Link to="/pending-requests" onClick={() => setMenuOpen(false)} style={styles.link}>Pending Requests</Link></li>
            )}
            <li>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    height: '70px',
    background: 'rgba(93, 0, 118, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#fff',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 999,
  },
  logo: {
    fontSize: '1.6rem',
    fontWeight: '700',
    cursor: 'pointer',
    color: '#fff',
  },
  hamburger: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    gap: '5px',
  },
  bar: {
    width: '25px',
    height: '3px',
    backgroundColor: '#fff',
    borderRadius: '4px',
  },
  navLinks: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    transition: 'all 0.3s ease-in-out',
  },
  navLinksDesktop: {
    display: 'flex',
    gap: '18px',
    alignItems: 'center',
  },
  navLinksMobileHidden: {
    display: 'none',
  },
  navLinksMobileActive: {
    position: 'absolute',
    top: '70px',
    right: 0,
    left: 0,
    background: 'rgba(93, 0, 118, 0.95)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    gap: '10px',
    zIndex: 998,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '16px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.1)',
    margin: '0 10px',
  },
  logoutButton: {
    background: 'linear-gradient(145deg, #ff4b2b, #ff416c)',
    border: 'none',
    color: 'white',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    margin: '0 10px',
  },
};

export default Navbar;
