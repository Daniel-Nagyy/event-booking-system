import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import './BookingForm.css';

const BookingForm = ({ eventId, eventTitle, pricePerTicket = 0 }) => {
    console.log('BookingForm rendered with props:', { eventId, eventTitle, pricePerTicket });
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        numberOfTickets: 1,
        specialRequirements: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const calculateTotalPrice = (tickets) => {
        return tickets * (pricePerTicket || 0);
    };

    useEffect(() => {
        console.log('BookingForm mounted with eventId:', eventId);
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if user is logged in
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login', { 
                state: { 
                    message: 'Please log in to book this event.',
                    from: `/events/${eventId}`
                } 
            });
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const totalPrice = calculateTotalPrice(Number(formData.numberOfTickets));
            const bookingData = {
                event: eventId,
                ticketsBooked: Number(formData.numberOfTickets),
                totalPrice: totalPrice,
                bookingDate: new Date(),
                specialRequirements: formData.specialRequirements
            };
            console.log('Submitting booking data:', bookingData);

            const response = await bookingService.createBooking(bookingData);
            console.log('Booking successful:', response.data);
            
            setSuccess(true);
            // Wait for 2 seconds to show success message before redirecting
            setTimeout(() => {
                navigate('/my-bookings');
            }, 2000);
        } catch (err) {
            console.error('Booking error:', err);
            if (err.response?.status === 401) {
                navigate('/login', { 
                    state: { 
                        message: 'Your session has expired. Please log in again.',
                        from: `/events/${eventId}`
                    } 
                });
            } else {
                setError(err.response?.data?.message || 'Failed to book event. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!eventId || !eventTitle) {
        console.error('Missing required props:', { eventId, eventTitle });
        return null;
    }

    return (
        <div className="booking-form-container">
            <h2>Book Event: {eventTitle}</h2>
            {error && <div className="booking-error">{error}</div>}
            {success && <div className="booking-success">Booking created successfully! Redirecting...</div>}
            
            <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                    <label htmlFor="numberOfTickets">Number of Tickets</label>
                    <input
                        type="number"
                        id="numberOfTickets"
                        name="numberOfTickets"
                        min="1"
                        max="10"
                        value={formData.numberOfTickets}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="price-summary">
                    <p>Price per ticket: ${pricePerTicket || 0}</p>
                    <p className="total-price">Total price: ${calculateTotalPrice(formData.numberOfTickets)}</p>
                </div>

                <div className="form-group">
                    <label htmlFor="specialRequirements">Special Requirements (Optional)</label>
                    <textarea
                        id="specialRequirements"
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleChange}
                        placeholder="Any special requirements or notes..."
                        rows="4"
                        disabled={loading}
                    />
                </div>

                <button 
                    type="submit" 
                    className={`booking-button ${loading ? 'loading' : ''}`}
                    disabled={loading || success}
                >
                    {loading ? 'Processing...' : success ? 'Booking Successful!' : 'Book Now'}
                </button>
            </form>
        </div>
    );
};

export default BookingForm; 