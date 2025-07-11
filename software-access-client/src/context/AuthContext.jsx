import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const getInitialAuth = () => {
  const token = localStorage.getItem('token') || null;
  const role = localStorage.getItem('role') || null;

  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (err) {
    console.error('Error parsing user from localStorage:', err);
  }

  return { token, role, user };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getInitialAuth);

  const login = (token, role, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, role, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setAuth({ token: null, role: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Correct export of useAuth hook
export const useAuth = () => useContext(AuthContext);
