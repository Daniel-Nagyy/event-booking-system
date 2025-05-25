import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UsersPage from './adminUser';
import EventPage from './eventPage';

function Admin() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // vertical centering
        alignItems: 'center',     // horizontal centering
        height: '100vh',          // full viewport height
        textAlign: 'center',      // center text inside children
        gap: '20px',              // spacing between buttons and heading
      }}
    >
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
