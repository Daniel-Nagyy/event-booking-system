import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EventPage() {
  const navigate = useNavigate();

  // Sample event data with status
  const initialEvents = [
    { id: 1, name: 'Hackathon', date: '2024-06-01', location: 'Online', status: 'pending' },
    { id: 2, name: 'Tech Summit', date: '2024-07-15', location: 'Cairo', status: 'approved' },
    { id: 3, name: 'Workshop', date: '2024-08-20', location: 'Alexandria', status: 'declined' },
    { id: 4, name: 'AI Expo', date: '2024-09-10', location: 'Giza', status: 'pending' }
  ];

  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState('all');

  // Filter events based on status
  const filteredEvents = filter === 'all'
    ? events
    : events.filter(event => event.status === filter);

  const handleApprove = (id) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, status: 'approved' } : event
      )
    );
  };

  const handleDecline = (id) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, status: 'declined' } : event
      )
    );
  };

  return (
    <div>
      <h2>Events</h2>

      <button onClick={() => navigate('/admin')}>← Back to Admin Menu</button>

      {/* Filter buttons */}
      <div style={{ marginTop: '20px' }}>
        <strong>Filter: </strong>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('approved')}>Approved</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('declined')}>Declined</button>
      </div>

      {/* Event table */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.length === 0 ? (
            <tr><td colSpan="5">No events to display.</td></tr>
          ) : (
            filteredEvents.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td>{event.status}</td>
                <td>
                  <button
                    onClick={() => handleApprove(event.id)}
                    disabled={event.status === 'approved'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecline(event.id)}
                    disabled={event.status === 'declined'}
                    style={{ marginLeft: '10px' }}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EventPage;
