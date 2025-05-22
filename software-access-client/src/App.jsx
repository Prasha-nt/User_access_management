import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateSoftware from './pages/CreateSoftware';
import RequestAccess from './pages/RequestAccess';
import PendingRequests from './pages/PendingRequests';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
 


        {/* Protected routes */}
        <Route
          path="/create-software"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <CreateSoftware />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-access"
          element={
            <ProtectedRoute allowedRoles={['Employee', 'Admin']}>
              <RequestAccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending-requests"
          element={
            <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
              <PendingRequests />
            </ProtectedRoute>
          }
        />

        {/* Redirect all unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
