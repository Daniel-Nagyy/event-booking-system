import './EventCard.css';
import eventImage from '../elements/event-pic.jpeg';
function EventCard(props) {
    return (
        <div className="card">
            <img src={eventImage} alt="Event 1" />
            <div className="card__content">
                <p className="card__title">{props.title}</p>
                <p className="card__description">{props.description}</p>
                <p className="card__description">{props.location}</p>
                <p className="card__description">{props.date}</p>
            </div>
        </div>
    );
}

export default EventCard;