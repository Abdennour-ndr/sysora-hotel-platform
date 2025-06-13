import React from 'react';
import AdminDashboardEN from '../pages/admin/AdminDashboardEN';

const AdminDashboardWrapper = () => {
  // Only English language supported for now
  const renderDashboard = () => {
    return <AdminDashboardEN />;
  };

  return (
    <div className={`admin-dashboard-wrapper ${isTransitioning ? 'language-transition' : 'language-transition active'}`}>
      {renderDashboard()}
    </div>
  );
};

export default AdminDashboardWrapper;
