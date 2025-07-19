// src/components/common/ProtectedRoute.jsx - Updated for Redux
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 1. Import useSelector

const ProtectedRoute = ({ children, adminOnly = false }) => {
  // 2. Get authentication state from the Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 3. Use the isAuthenticated flag for the primary check
  if (!isAuthenticated) {
    // If not authenticated, redirect to the appropriate login page
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace />;
  }

  // 4. If the route is for admins only, check the user's role
  if (adminOnly && !user?.is_admin) {
    // If a non-admin tries to access an admin route, redirect to home
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child components
  return children;
};

export default ProtectedRoute;
