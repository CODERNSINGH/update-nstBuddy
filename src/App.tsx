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
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Initialize Google Analytics
ReactGA.initialize('G-P95H63YPVW');

const AppRoutes: React.FC = () => {
  usePageTracking(); // Track page views

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/assignmentsSem3" element={<AssigenmentSem2 />} />
      <Route path="/assignmentsSem4" element={<AssignmentsSem4 />} />
      <Route path="/100days" element={<Days100 />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
