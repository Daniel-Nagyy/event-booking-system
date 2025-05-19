import React, { useState } from 'react';
import EventTable from '../components/EventTable';
import { useNavigate } from 'react-router-dom';

function EventPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    { id: 1, name: 'Hackathon', date: '2024-06-01', location: 'Online', status: 'pending' },
    { id: 2, name: 'Workshop', date: '2024-07-10', location: 'Cairo', status: 'approved' },
  ]);

  const approveEvent = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
  };

  const declineEvent = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'declined' } : e));
  };

  return (
    <div>
      <button onClick={() => navigate('/admin')}>← Back to Admin</button>
      <h2>Events</h2>
      <EventTable events={events} onApprove={approveEvent} onDecline={declineEvent} />
    </div>
  );
}

export default EventPage;
