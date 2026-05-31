import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import public page modules
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ExploreProjects from '../pages/ExploreProjects';
import SuccessGallery from '../pages/SuccessGallery';
import SuccessStoryDetails from '../pages/SuccessStoryDetails';
import StartupShowcase from '../pages/StartupShowcase';
import SearchPage from '../pages/SearchPage';

// Import protected page modules
import Dashboard from '../pages/Dashboard';
import StartupRegister from '../pages/StartupRegister';
import ProposalForm from '../pages/ProposalForm';
import IncubationApply from '../pages/IncubationApply';
import ProgressSubmit from '../pages/ProgressSubmit';
import ProgressTimeline from '../pages/ProgressTimeline';

// Import admin/mentor page modules
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import MentorDashboard from '../pages/MentorDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2">
        <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-slate-500 font-sans">Validating user security credentials...</span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // If not logged in, redirect to matching login view (Admin/Mentor vs Student)
    const isAdminPath = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/mentor');
    return <Navigate to={isAdminPath ? '/admin/login' : '/login'} replace />;
  }
  
  // Resolve user role mapping
  const userRole = user?.role || 'student';

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'mentor') return <Navigate to="/mentor/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = ({ onTriggerComingSoon }) => {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route path="/" element={<Home onTriggerComingSoon={onTriggerComingSoon} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explore" element={<ExploreProjects />} />
      <Route path="/gallery" element={<SuccessGallery />} />
      <Route path="/gallery/:id" element={<SuccessStoryDetails />} />
      <Route path="/startup/:id" element={<StartupShowcase />} />
      <Route path="/search" element={<SearchPage />} />

      {/* 2. Admin & Mentor login routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 3. Protected Student Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/startup-register" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StartupRegister />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/startup-register/edit/:id" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StartupRegister />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/proposal-form" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ProposalForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/proposal/edit/:id" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ProposalForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/incubation-apply" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <IncubationApply />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/progress-submit" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ProgressSubmit />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/progress-timeline/:startupId" 
        element={
          <ProtectedRoute allowedRoles={['student', 'mentor', 'admin']}>
            <ProgressTimeline />
          </ProtectedRoute>
        } 
      />

      {/* 4. Protected Mentor Hub Routes */}
      <Route 
        path="/mentor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['mentor']}>
            <MentorDashboard />
          </ProtectedRoute>
        } 
      />

      {/* 5. Protected Admin Hub Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Redirect all unmatched routes back to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
