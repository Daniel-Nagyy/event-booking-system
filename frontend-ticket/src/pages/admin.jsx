import React, { useState } from 'react';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import DashboardPage from './adminDashboard';
import UsersPage from './adminUser';
import EventPage from './eventPage';
import EventAnalyticsPage from './EventAnalyticsPage';
import './admin.css';

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'users':
        return <UsersPage />;
      case 'events':
        return <EventPage />;
      case 'analytics':
        return <EventAnalyticsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'users':
        return 'User Management';
      case 'events':
        return 'Event Management';
      case 'analytics':
        return 'Event Analytics';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <FaTachometerAlt />
            Dashboard
          </button>
          
          <button
            className={`nav-item ${currentPage === 'users' ? 'active' : ''}`}
            onClick={() => setCurrentPage('users')}
          >
            <FaUsers />
            Users
          </button>
          
          <button
            className={`nav-item ${currentPage === 'events' ? 'active' : ''}`}
            onClick={() => setCurrentPage('events')}
          >
            <FaCalendarAlt />
            Events
          </button>
          
          <button
            className={`nav-item ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analytics')}
          >
            <FaChartBar />
            Analytics
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <h1>{getPageTitle()}</h1>
        </div>
        
        <div className="admin-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
