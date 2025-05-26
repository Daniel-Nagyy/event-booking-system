function EventTable({ events = [], onApprove, onDecline }) {
  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    

    <table>
      <thead>
        <tr>
          <th>Event title</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event._id}>
            <td>{event.title}</td>
            <td>{event.date}</td>
            <td>{event.status}</td>
            <td>
              <button onClick={() => onApprove(event._id)}>Approve</button>
              <button onClick={() => onDecline(event._id)}>Decline</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  );
        }

export default EventTable;