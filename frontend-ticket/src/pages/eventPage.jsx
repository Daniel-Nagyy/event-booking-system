import React, { useState, useEffect } from 'react';
import EventTable from '../components/EventTable';
import { useNavigate } from 'react-router-dom';
import {admin} from '../services/api'

function EventPage() {
  const [events, setEvents] = useState([]); // ✅ Start with empty array to avoid .length error
  const navigate = useNavigate();

  // ✅ Fetch all events
  const fetchEvents = () => {
    admin.getEvents()
      .then(res => {
        setEvents(res.data); // Adjust this if your backend returns { events: [...] }
      })
      .catch(err => {
        console.error('Error fetching events:', err);
      });
  };

  useEffect(() => {
    fetchEvents(); // ✅ Call on mount
  }, []);

  // ✅ Approve event then refresh
  const approveEvent = (id) => {
    admin.approveEvents(id)
      .then((res) => {
        console.log('Event approved:', res.data);
        fetchEvents(); // ✅ Refresh the table
      })
      .catch((err) => {
        console.error('Error approving event:', err);
      });
  };

  // ✅ Decline event then refresh
  const declineEvent = (id) => {
    admin.declineEvents(id)
      .then((res) => {
        console.log('Event declined:', res.data);
        fetchEvents(); // ✅ Refresh the table
      })
      .catch((err) => {
        console.error('Error declining event:', err);
      });
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
