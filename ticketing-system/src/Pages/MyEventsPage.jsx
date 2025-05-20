import EventCard from '../Components/EventCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './MyEventsPage.css';
import { useNavigate, Link } from 'react-router-dom';


function MyEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch events
        const fetchEvents = async () => {
            try {
                setLoading(true);
                // Make API call with credentials to include cookies for auth
                const response = await axios.get('/api/v1/users/events', {
                    withCredentials: true
                });
                
                // Ensure response.data is an array before setting events
                if (Array.isArray(response.data)) {
                    setEvents(response.data);
                } else {
                    // If it's not an array (e.g., a message object when no events),
                    // set events to an empty array to prevent .map error
                    setEvents([]); 
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching events:', err);
                // Handle unauthorized or other errors
                if (err.response?.status === 403) {
                    setError('You are not authorized to view these events. Only organizers can access this page.');
                } else {
                    setError('Failed to load events. Please try again later.' + err);
                }
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Loading state
    if (loading) {
        return <div className="loading">Loading events...</div>;
    }

    // Error state
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Empty state
    if (events.length === 0) {
        return (
            <div className="my-events-container">
                <h1>My Events</h1>
                <p className="no-events">You haven't created any events yet.</p>
            </div>
        );
    }

    // Render events
    return (
        <div className="my-events-container">
            <div className="page-header">
                <h1>My Events</h1>
                <Link to="/my-events/new" className="create-event-button">
                    Create New Event
                </Link>
            </div>
            <div className="events-grid">
                {events.map(event => (
                    <EventCard 
                        key={event._id}
                        id={event._id}
                        title={event.title}
                        description={event.description}
                        location={event.location}
                        date={new Date(event.date).toLocaleDateString()}
                    />
                ))}
            </div>
        </div>
    );
}

export default MyEventsPage;