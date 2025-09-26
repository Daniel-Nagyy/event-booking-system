import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EventCard from '../Components/EventCard';
import { eventService } from '../services/api';
import './Events.css';

function Events() {
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log("Events component mounted");

        const fetchEvents = async () => {
            try {
                console.log("Fetching events...");
                const response = await eventService.getApprovedEvents();
                console.log("Events response:", response);
                setAllEvents(response.data);
                setFilteredEvents(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError('Failed to load events. Please try again later.');
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('search');
        console.log("Search term from URL:", searchTerm);

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filtered = allEvents.filter(event =>
                event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                event.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                event.location.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setFilteredEvents(filtered);
        } else {
            setFilteredEvents(allEvents);
        }
    }, [allEvents, location.search]);

    if (loading) {
        return <div className="events-loading">Loading events...</div>;
    }

    if (error) {
        return <div className="events-error">{error}</div>;
    }

    return (
        <div className="events-container">
            <section className="events-hero">
                <h1>Discover and book tickets for the best events</h1>
                <p>Concerts, sports, festivals, and more near you</p>
                <div className="events-search">
                    <input
                        type="text"
                        placeholder="Search for events, artists, or venues"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const value = e.currentTarget.value.trim();
                                if (value) navigate(`/events?search=${encodeURIComponent(value)}`);
                            }
                        }}
                    />
                    <button onClick={() => navigate('/events')}>Search</button>
                </div>
            </section>
            <section className="events-section">
            <h2 className="events-title">Upcoming Events</h2>
            <div className="events-grid">
                {filteredEvents.map((event) => (
                    <EventCard
                        key={event._id}
                        id={event._id}
                        title={event.title}
                        description={event.description}
                        location={event.location}
                        date={new Date(event.date).toLocaleDateString()}
                        organizerId={event.organizer}
                        price={event.price}
                    />
                ))}
            </div>
            </section>
        </div>
    );
}

export default Events; 