import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import { admin } from '../services/api';
import './admin.css';

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(8);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await admin.getEvents();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleApproveEvent = async (eventId) => {
    try {
      await admin.approveEvents(eventId);
      // Update local state
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: 'approved' } : event
      ));
    } catch (err) {
      setError('Failed to approve event');
      console.error('Error approving event:', err);
    }
  };

  const handleDeclineEvent = async (eventId) => {
    try {
      await admin.declineEvents(eventId);
      // Update local state
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: 'declined' } : event
      ));
    } catch (err) {
      setError('Failed to decline event');
      console.error('Error declining event:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await admin.deleteEvent(eventId);
        // Remove event from local state
        setEvents(events.filter(event => event._id !== eventId));
        setError(null);
      } catch (err) {
        setError('Failed to delete event');
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent({ ...event });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingEvent) return;
    
    try {
      console.log('Sending update request for event:', editingEvent._id);
      console.log('Update data:', editingEvent);
      
      const response = await admin.updateEvent(editingEvent._id, editingEvent);
      console.log('Update response:', response);
      
      // Update local state
      setEvents(events.map(event => 
        event._id === editingEvent._id ? editingEvent : event
      ));
      setShowEditModal(false);
      setEditingEvent(null);
      setError(null);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingEvent(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge approved">Approved</span>;
      case 'pending':
        return <span className="status-badge pending">Pending</span>;
      case 'declined':
        return <span className="status-badge declined">Declined</span>;
      default:
        return <span className="status-badge unknown">{status}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheck className="status-icon approved" />;
      case 'pending':
        return <FaCalendarAlt className="status-icon pending" />;
      case 'declined':
        return <FaTimes className="status-icon declined" />;
      default:
        return <FaCalendarAlt className="status-icon" />;
    }
  };

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-events-page">
      <div className="page-header">
        <h2>Event Management</h2>
        <div className="header-stats">
          <span className="stat-item">
            <FaCalendarAlt />
            Total: {events.length}
          </span>
          <span className="stat-item">
            <FaCheck />
            Approved: {events.filter(e => e.status === 'approved').length}
          </span>
          <span className="stat-item">
            <FaTimes />
            Pending: {events.filter(e => e.status === 'pending').length}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search events by title, description, or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {currentEvents.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-header">
              <div className="event-status">
                {getStatusIcon(event.status)}
                {getStatusBadge(event.status)}
              </div>
              <div className="event-actions-header">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="edit-btn"
                  title="Edit Event"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleViewEvent(event)}
                  className="view-btn"
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="delete-btn"
                  title="Delete Event"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            
            <div className="event-content">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">
                {event.description?.substring(0, 100)}...
              </p>
              
              <div className="event-details">
                <div className="detail-item">
                  <FaUser />
                  <span>{event.organizer?.name || 'Unknown Organizer'}</span>
                </div>
                <div className="detail-item">
                  <FaCalendarAlt />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                {event.location && (
                  <div className="detail-item">
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.totalTickets && (
                  <div className="detail-item">
                    <FaUser />
                    <span>Capacity: {event.totalTickets}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="event-actions">
              {event.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApproveEvent(event._id)}
                    className="approve-btn"
                  >
                    <FaCheck />
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeclineEvent(event._id)}
                    className="decline-btn"
                  >
                    <FaTimes />
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`page-btn ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="summary-stats">
        <p>Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events</p>
      </div>

      {/* Event View Modal */}
      {showEventModal && selectedEvent && (
        <div className="modal-overlay" onClick={closeEventModal}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedEvent.title}</h3>
              <button onClick={closeEventModal} className="close-btn">&times;</button>
            </div>
            
            <div className="modal-content">
              <div className="event-info">
                <p><strong>Description:</strong> {selectedEvent.description}</p>
                <p><strong>Organizer:</strong> {selectedEvent.organizer?.name || 'Unknown'}</p>
                <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedEvent.time || 'N/A'}</p>
                <p><strong>Location:</strong> {selectedEvent.location || 'N/A'}</p>
                <p><strong>Price:</strong> ${selectedEvent.price || 'Free'}</p>
                <p><strong>Capacity:</strong> {selectedEvent.totalTickets || 'Unlimited'}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedEvent.status)}</p>
              </div>
              
              {selectedEvent.status === 'pending' && (
                <div className="modal-actions">
                  <button
                    onClick={() => {
                      handleApproveEvent(selectedEvent._id);
                      closeEventModal();
                    }}
                    className="approve-btn large"
                  >
                    <FaCheck />
                    Approve Event
                  </button>
                  <button
                    onClick={() => {
                      handleDeclineEvent(selectedEvent._id);
                      closeEventModal();
                    }}
                    className="decline-btn large"
                  >
                    <FaTimes />
                    Decline Event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Event: {editingEvent.title}</h3>
              <button onClick={closeEditModal} className="close-btn">&times;</button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editingEvent.title || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={editingEvent.description || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={editingEvent.date ? new Date(editingEvent.date).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={editingEvent.time || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editingEvent.location || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={editingEvent.price || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="totalTickets">Total Tickets</label>
                <input
                  type="number"
                  id="totalTickets"
                  name="totalTickets"
                  value={editingEvent.totalTickets || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  min="1"
                />
              </div>
              
              <div className="modal-actions">
                <button onClick={handleSaveEdit} className="save-btn large">
                  <FaEdit />
                  Save Changes
                </button>
                <button onClick={closeEditModal} className="cancel-btn large">
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 