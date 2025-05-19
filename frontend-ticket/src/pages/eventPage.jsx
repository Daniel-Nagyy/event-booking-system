import React from 'react';
import { useNavigate } from 'react-router-dom';

function EventPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Events Page</h2>
      <p>Display all event-related content here.</p>
      <button onClick={() => navigate('/admin')}>← Back to Admin Menu</button>
    </div>
  );
}

export default EventPage;
