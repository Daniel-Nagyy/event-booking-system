import './EventCard.css';
import eventImage from '../elements/event-pic.jpeg';
import { Link } from 'react-router-dom';

function EventCard({ id, title, description, location, date }) {
    return (
        <Link to={`/my-events/${id}/edit`} className="card-link">
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

export default EventCard;