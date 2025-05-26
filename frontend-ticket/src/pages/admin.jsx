import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import UsersPage from './adminUser.jsx';
import EventPage from './eventPage.jsx';
import './admin.css';

function Admin() {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const height =
    path === '/admin/user' ? '120vh' :
    (path === '/admin' || path === '/admin/event') ? '100vh' :
    'auto'; // fallback
  return (
    <div
      style={{  
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // vertical centering
        alignItems: 'center',     // horizontal centering
        height,        // full viewport height
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
