import React, { useState } from 'react';
import Dashboard from '../components/dashboard';

function AdminPage() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div>
      <h1>Admin Page</h1>


      {showDashboard && <Dashboard />}
    </div>
  );
}

export default AdminPage;
