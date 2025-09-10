import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthWrapper from "../components/AuthWrapper";
import Dashboard from "../pages/Dashboard";
import EditResume from "../components/EditResume";
import ProtectedRoute from "../components/ProtectedRoute";
import ATSAnalyzer from "../pages/ATSAnalyzer";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthWrapper />} />
      <Route path="/signup" element={<AuthWrapper />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/resume/:resumeId" element={
        <ProtectedRoute>
          <EditResume />
        </ProtectedRoute>
      } />
      <Route path="/ats" element={
        <ProtectedRoute>
          <ATSAnalyzer />
        </ProtectedRoute>
      } />
      
      {/* Redirect old signup route */}
      <Route path="/signUp" element={<Navigate to="/signup" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
