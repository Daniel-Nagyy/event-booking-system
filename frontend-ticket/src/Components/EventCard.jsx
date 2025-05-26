import './EventCard.css';
import eventImage from '../elements/event-pic.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventCard({ id, title, description, location, date, organizerId, onDelete }) {
    const navigate = useNavigate();

    // Get current user from localStorage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user?.role === 'Admin';
    const isOrganizer = user?._id === organizerId;
    
    // Show delete button only if user is admin or the organizer of this event
    const canDelete = isAdmin || isOrganizer;

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await axios.delete(`/api/v1/events/${id}`, { withCredentials: true });
                alert("Event deleted successfully!");
                if (onDelete) {
                    onDelete(id);
                }
            } catch (err) {
                console.error("Error deleting event:", err);
                alert(`Failed to delete event: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    return (
        <div className="card">
            <Link to={`/my-events/${id}/edit`} className="card-link-content">
                <img src={eventImage} alt={title} />
                <div className="card__content">
                    <p className="card__title">{title}</p>
                    <p className="card__description">{description}</p>
                    <p className="card__description">{location}</p>
                    <p className="card__description">{date}</p>
                </div>
            </Link>
            {canDelete && (
                <button onClick={handleDelete} className="delete-event-button">
                    Delete
                </button>
            )}
        </div>
    );
}

export default EventCard;