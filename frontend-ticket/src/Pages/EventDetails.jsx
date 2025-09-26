import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import BookingForm from '../Components/BookingForm';
import './EventDetails.css';

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                console.log('Fetching event with ID:', id);
                const response = await eventService.getEventById(id);
                console.log('Event data received:', response.data);
                setEvent(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Failed to load event details. Please try again later.');
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    if (loading) {
        return <div className="event-details-loading">Loading event details...</div>;
    }

    if (error) {
        return <div className="event-details-error">{error}</div>;
    }

    if (!event) {
        return <div className="event-details-error">Event not found</div>;
    }

    console.log('Rendering event details with event:', event);

    // Determine if current user can book (only regular users)
    const userString = localStorage.getItem('user');
    let canBook = false;
    try {
        const currentUser = userString ? JSON.parse(userString) : null;
        canBook = currentUser?.role === 'User';
    } catch (e) {
        canBook = false;
    }

    return (
        <div className="event-details-container">
            <div className="event-details-content">
                <div className="event-details-header">
                    <h1>{event.title}</h1>
                    <div className="event-meta">
                        <span className="event-date">
                            {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="event-location">{event.location}</span>
                    </div>
                </div>

                <div className="event-details-body">
                    <div className="event-description">
                        <h2>About this event</h2>
                        <p>{event.description}</p>
                    </div>

                    {canBook && (
                        <div className="event-booking">
                            {console.log('Rendering BookingForm with props:', { eventId: event._id, eventTitle: event.title, pricePerTicket: event.price })}
                            <BookingForm 
                                eventId={event._id} 
                                eventTitle={event.title} 
                                pricePerTicket={event.price}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventDetails; 