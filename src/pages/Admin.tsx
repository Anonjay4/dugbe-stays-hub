import React from 'react';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  // Redirect to new admin login
  return <Navigate to="/admin/login" replace />;
};

export default Admin;