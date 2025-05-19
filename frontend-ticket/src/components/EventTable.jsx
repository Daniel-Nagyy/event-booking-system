// components/EventTable.jsx

function EventTable({ events, onApprove, onDecline }) {
  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <table>
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
        {events.map(event => (
          <tr key={event.id}>
            <td>{event.name}</td>
            <td>{event.date}</td>
            <td>{event.location}</td>
            <td>{event.status}</td>
            <td>
              <button onClick={() => onApprove(event.id)}>Approve</button>
              <button onClick={() => onDecline(event.id)}>Decline</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EventTable;
