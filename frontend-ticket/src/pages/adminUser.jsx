import React from 'react';
import { useNavigate } from 'react-router-dom';

function UsersPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Users Page</h2>
      <p>Display all user-related content here.</p>
      <button onClick={() => navigate('/admin')}>← Back to Admin Menu</button>
    </div>
  );
}

export default UsersPage;
