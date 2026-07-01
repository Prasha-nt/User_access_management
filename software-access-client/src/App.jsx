import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateSoftware from './pages/CreateSoftware';
import RequestAccess from './pages/RequestAccess';
import PendingRequests from './pages/PendingRequests';

const DashboardLayout = () => (
  <div className="app-layout">
    <Navbar />
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<DashboardLayout />}>
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
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
