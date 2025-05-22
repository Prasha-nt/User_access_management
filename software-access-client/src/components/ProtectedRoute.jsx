import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { token, role } = useAuth();

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
