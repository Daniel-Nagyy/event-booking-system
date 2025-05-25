import './UserEventCard.css';
import eventImage from '../elements/event-pic.jpeg';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';

function UserEventCard({ id, title, description, location, date }) {
    return (
        <Link to={`/events/${id}`} className="card-link-content">
            <div className="card">
                <img src={eventImage} alt={title} />
                <div className="card__content">
                    <p className="card__title">{title}</p>
                    <p className="card__description">{description}</p>
                    <p className="card__description">{location}</p>
                    <p className="card__description">{date}</p>
                </div>
            </div>
        </Link>
    );
}

export default UserEventCard; 