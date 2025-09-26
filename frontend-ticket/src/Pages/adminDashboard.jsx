import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarAlt, FaTicketAlt, FaExclamationTriangle, FaCheckCircle, FaClock, FaChartBar } from 'react-icons/fa';
import { admin } from '../services/api';
import './admin.css';

export default function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users and events
      const [usersResponse, eventsResponse] = await Promise.all([
        admin.getUsers(),
        admin.getEvents()
      ]);

      const users = usersResponse.data;
      const events = eventsResponse.data;

      // Calculate statistics
      setStats({
        totalUsers: users.length,
        totalEvents: events.length,
        pendingEvents: events.filter(e => e.status === 'pending').length,
        approvedEvents: events.filter(e => e.status === 'approved').length
      });

      // Get recent users (last 5)
      setRecentUsers(users.slice(-5).reverse());

      // Get recent events (last 5)
      setRecentEvents(events.slice(-5).reverse());

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon events">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>{stats.totalEvents}</h3>
            <p>Total Events</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>{stats.pendingEvents}</h3>
            <p>Pending Events</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon approved">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.approvedEvents}</h3>
            <p>Approved Events</p>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="dashboard-sections">
        {/* Recent Users */}
        <div className="dashboard-section">
          <h3>Recent Users</h3>
          <div className="recent-list">
            {recentUsers.map((user) => (
              <div key={user._id} className="recent-item">
                <div className="recent-icon">
                  <FaUsers />
                </div>
                <div className="recent-content">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <span className="recent-role">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="dashboard-section">
          <h3>Recent Events</h3>
          <div className="recent-list">
            {recentEvents.map((event) => (
              <div key={event._id} className="recent-item">
                <div className="recent-icon">
                  <FaCalendarAlt />
                </div>
                <div className="recent-content">
                  <h4>{event.title}</h4>
                  <p>{event.location}</p>
                  <span className="recent-status">
                    <span className={`status-badge ${event.status}`}>
                      {event.status}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => handleQuickAction('users')}
          >
            <FaUsers />
            Manage Users
          </button>
          <button 
            className="action-btn primary"
            onClick={() => handleQuickAction('events')}
          >
            <FaCalendarAlt />
            Manage Events
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => handleQuickAction('analytics')}
          >
            <FaChartBar />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
