// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Navbar = () => {
//   const { token, role, logout } = useAuth(); 
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav>
//       <ul>
//         {!token ? (
//           <>
//             <li><Link to="/login">Login</Link></li>
//             <li><Link to="/signup">Signup</Link></li>
//           </>
//         ) : (
//           <>
//             {role === 'Admin' && <li><Link to="/create-software">Create Software</Link></li>}

//             {(role === 'Employee' || role === 'Admin') && (
//               <li><Link to="/request-access">Request Access</Link></li>
//             )}
//             {(role === 'Manager' || role === 'Admin') && (
//               <li><Link to="/pending-requests">Pending Requests</Link></li>
//             )}
//             <li><button onClick={handleLogout}>Logout</button></li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Leucine</div>
      <ul style={styles.navLinks}>
        {!token ? (
          <>
            <li>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" style={styles.link}>
                Signup
              </Link>
            </li>
          </>
        ) : (
          <>
            {role === 'Admin' && (
              <li>
                <Link to="/create-software" style={styles.link}>
                  Create Software
                </Link>
              </li>
            )}
            {(role === 'Employee' || role === 'Admin') && (
              <li>
                <Link to="/request-access" style={styles.link}>
                  Request Access
                </Link>
              </li>
            )}
            {(role === 'Manager' || role === 'Admin') && (
              <li>
                <Link to="/pending-requests" style={styles.link}>
                  Pending Requests
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    height: '60px',
    backgroundColor: '#5d0076',
    color: 'white',
    padding: '0 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '600',
    fontSize: '18px',
  },
  logo: {
    cursor: 'pointer',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0,
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  },
};

export default Navbar;
