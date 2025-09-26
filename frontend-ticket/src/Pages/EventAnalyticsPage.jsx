import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine, 
  FaChartBar, 
  FaChartPie,
  FaEye,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaDollarSign
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { eventService } from '../services/api';
import './admin.css';

export default function EventAnalyticsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Fetch only the organizer's own events for analytics
      const response = await eventService.getUserEvents();
      setEvents(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalEvents = events.length;
  const approvedEvents = events.filter(e => e.status === 'approved').length;
  const pendingEvents = events.filter(e => e.status === 'pending').length;
  const declinedEvents = events.filter(e => e.status === 'declined').length;
  
  // Calculate total capacity and average price
  const totalCapacity = events.reduce((sum, event) => sum + (event.totalTickets || 0), 0);
  const averagePrice = events.length > 0 
    ? events.reduce((sum, event) => sum + (event.price || 0), 0) / events.length 
    : 0;

  // Get unique categories
  const categories = [...new Set(events.map(e => e.category).filter(Boolean))];

  // Filter events based on selected category
  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  // Prepare data for charts
  const statusData = [
    { name: 'Approved', value: approvedEvents, color: '#10b981' },
    { name: 'Pending', value: pendingEvents, color: '#f59e0b' },
    { name: 'Declined', value: declinedEvents, color: '#ef4444' }
  ];

  const categoryData = categories.map(category => {
    const categoryEvents = events.filter(e => e.category === category);
    return {
      name: category,
      events: categoryEvents.length,
      approved: categoryEvents.filter(e => e.status === 'approved').length,
      pending: categoryEvents.filter(e => e.status === 'pending').length
    };
  });

  // Top events by capacity

  // Price distribution data
  const priceRanges = [
    { range: 'Free', min: 0, max: 0, color: '#10b981' },
    { range: '$1-$25', min: 1, max: 25, color: '#3b82f6' },
    { range: '$26-$50', min: 26, max: 50, color: '#8b5cf6' },
    { range: '$51-$100', min: 51, max: 100, color: '#f59e0b' },
    { range: '$100+', min: 101, max: Infinity, color: '#ef4444' }
  ];

  const priceDistribution = priceRanges.map(range => ({
    range: range.range,
    count: events.filter(e => e.price >= range.min && e.price <= range.max).length,
    color: range.color
  }));

  // Filter events based on time range and category
  const getFilteredEvents = () => {
    let filtered = events;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    
    // Apply time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        quarter: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      };
      
      const cutoffDate = timeRanges[timeRange];
      filtered = filtered.filter(e => {
        if (!e.date) return false;
        const eventDate = new Date(e.date);
        return eventDate >= cutoffDate;
      });
    }
    
    return filtered;
  };

  const filteredEventsForCharts = getFilteredEvents();
  
  // Recalculate statistics based on filtered data
  const totalEventsFiltered = filteredEventsForCharts.length;
  const approvedEventsFiltered = filteredEventsForCharts.filter(e => e.status === 'approved').length;
  const pendingEventsFiltered = filteredEventsForCharts.filter(e => e.status === 'pending').length;
  const declinedEventsFiltered = filteredEventsForCharts.filter(e => e.status === 'declined').length;
  
  const totalCapacityFiltered = filteredEventsForCharts.reduce((sum, event) => sum + (event.totalTickets || 0), 0);
  const averagePriceFiltered = filteredEventsForCharts.length > 0 
    ? filteredEventsForCharts.reduce((sum, event) => sum + (event.price || 0), 0) / filteredEventsForCharts.length 
    : 0;

  // Update chart data based on filters
  const statusDataFiltered = [
    { name: 'Approved', value: approvedEventsFiltered, color: '#10b981' },
    { name: 'Pending', value: pendingEventsFiltered, color: '#f59e0b' },
    { name: 'Declined', value: declinedEventsFiltered, color: '#ef4444' }
  ];

  const categoryDataFiltered = categories.map(category => {
    const categoryEvents = filteredEventsForCharts.filter(e => e.category === category);
    return {
      name: category,
      events: categoryEvents.length,
      approved: categoryEvents.filter(e => e.status === 'approved').length,
      pending: categoryEvents.filter(e => e.status === 'pending').length
    };
  });

  // Update price distribution based on filters
  const priceDistributionFiltered = priceRanges.map(range => ({
    range: range.range,
    count: filteredEventsForCharts.filter(e => e.price >= range.min && e.price <= range.max).length,
    color: range.color
  }));

  // Debug logging
  console.log('Events:', events);
  console.log('Filtered Events:', filteredEventsForCharts);
  console.log('Status Data Filtered:', statusDataFiltered);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-analytics-page">
      <div className="page-header">
        <h2>Event Analytics Dashboard</h2>
        <div className="header-controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button 
            onClick={fetchEvents}
            className="filter-select"
            style={{ 
              cursor: 'pointer', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none',
              padding: '0.75rem 1rem'
            }}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon events">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>{totalEventsFiltered}</h3>
            <p>Total Events</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon approved">
            <FaCheck />
          </div>
          <div className="stat-content">
            <h3>{approvedEventsFiltered}</h3>
            <p>Approved Events</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{pendingEventsFiltered}</h3>
            <p>Pending Events</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{totalCapacityFiltered.toLocaleString()}</h3>
            <p>Total Capacity</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Event Status Distribution */}
        <div className="chart-container">
          <h3>Event Status Distribution</h3>
          {statusDataFiltered.some(item => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDataFiltered}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : ''
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDataFiltered.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '300px',
              color: '#64748b',
              fontSize: '1.1rem'
            }}>
              No events data available
            </div>
          )}
        </div>

        {/* Category Performance */}
        <div className="chart-container">
          <h3>Events by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryDataFiltered}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="events" fill="#3b82f6" name="Total Events" />
              <Bar dataKey="approved" fill="#10b981" name="Approved" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Price Distribution */}
        <div className="chart-container">
          <h3>Price Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceDistributionFiltered}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="additional-stats">
        <div className="stat-section">
          <h3>Quick Insights</h3>
          <div className="insights-grid">
            <div className="insight-item">
              <FaDollarSign className="insight-icon" />
              <div>
                <h4>Average Price</h4>
                <p>${averagePriceFiltered.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="insight-item">
              <FaUsers className="insight-icon" />
              <div>
                <h4>Average Capacity</h4>
                <p>{totalEventsFiltered > 0 ? Math.round(totalCapacityFiltered / totalEventsFiltered) : 0}</p>
              </div>
            </div>
            
            <div className="insight-item">
              <FaCheck className="insight-icon" />
              <div>
                <h4>Approval Rate</h4>
                <p>{totalEventsFiltered > 0 ? ((approvedEventsFiltered / totalEventsFiltered) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
            
            <div className="insight-item">
              <FaMapMarkerAlt className="insight-icon" />
              <div>
                <h4>Unique Locations</h4>
                <p>{[...new Set(filteredEventsForCharts.map(e => e.location).filter(Boolean))].length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 