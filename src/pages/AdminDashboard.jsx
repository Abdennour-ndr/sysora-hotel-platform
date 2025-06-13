import React from 'react';
import AdminDashboardEN from './admin/AdminDashboardEN';

// Import CSS files for English only
import '../styles/admin-en.css';

const AdminDashboard = () => {
  // Only English language supported for now
  return <AdminDashboardEN />;
};

export default AdminDashboard;
