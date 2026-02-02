// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Assignments from './pages/Assignments';
import Days100 from './pages/Days100';
import ReactGA from 'react-ga4';
import usePageTracking from './hooks/usePageTracking';
import AssigenmentSem2 from './pages/AssigenmentSem2';
import AssignmentsSem4 from './pages/AssignmentsSem4';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Initialize Google Analytics
ReactGA.initialize('G-P95H63YPVW');

const AppRoutes: React.FC = () => {
  usePageTracking(); // Track page views

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
      <Route path="/assignmentsSem3" element={<ProtectedRoute><AssigenmentSem2 /></ProtectedRoute>} />
      <Route path="/assignmentsSem4" element={<ProtectedRoute><AssignmentsSem4 /></ProtectedRoute>} />
      <Route path="/100days" element={<ProtectedRoute><Days100 /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
