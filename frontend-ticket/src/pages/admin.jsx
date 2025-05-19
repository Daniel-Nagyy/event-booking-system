import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UsersPage from './adminUser';
import EventPage from './eventPage';

function Admin() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Admin Menu</h1>

      <Routes>
        {/* Main menu with buttons */}
        <Route
          path="/"
          element={
            <div>
              <button onClick={() => navigate('/admin/user')}>Users</button>
              <button onClick={() => navigate('/admin/event')}>Events</button>
            </div>
          }
        />
        {/* Users page */}
        <Route path="user" element={<UsersPage />} />
        {/* Events page */}
        <Route path="event" element={<EventPage />} />
      </Routes>
    </div>
  );
}

export default Admin;
