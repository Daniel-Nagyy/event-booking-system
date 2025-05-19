import React, { useState, useEffect } from 'react';
import EventTable from '../components/EventTable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventPage() {
  const [events, setEvents] = useState([]); // ✅ Start with empty array to avoid .length error
  const navigate = useNavigate();

  // ✅ Fetch all events
  const fetchEvents = () => {
    axios.get('http://localhost:3000/api/v1/events/all/')
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
    axios.patch(`http://localhost:3000/api/v1/events/approveevent/${id}`)
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
    axios.patch(`http://localhost:3000/api/v1/events/decline/${id}`)
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
