import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './MyBookings.css';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            console.log('User not logged in, redirecting from MyBookings');
            navigate('/login', { 
                state: { 
                    message: 'Please log in to view your bookings.',
                    from: '/my-bookings'
                } 
            });
            return;
        }

        try {
            const userData = JSON.parse(user);
            if (userData && userData._id) {
                fetchBookings();
            } else {
                throw new Error('Invalid user data');
            }
        } catch (error) {
            console.error('Error with user data:', error);
            localStorage.removeItem('user');
            navigate('/login', { 
                state: { 
                    message: 'Please log in to view your bookings.',
                    from: '/my-bookings'
                } 
            });
        }
    }, [navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await bookingService.getUserBookings();
            console.log("Bookings response:", response);

            if (Array.isArray(response.data)) {
                setBookings(response.data);
            } else {
                console.error("Unexpected response format:", response.data);
                setBookings([]);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            if (err.response?.status === 401 || err.response?.status === 405) {
                localStorage.removeItem('user');
                navigate('/login', { 
                    state: { 
                        message: 'Your session has expired. Please log in again.',
                        from: '/my-bookings'
                    } 
                });
            } else {
                setError(err.response?.data?.message || 'Failed to load bookings');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await bookingService.cancelBooking(bookingId);
            
            if (response.data) {
                setSuccess('Booking cancelled successfully!');
                await fetchBookings();
            }
        } catch (err) {
            console.error('Error cancelling booking:', err);
            setError(err.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="bookings-loading">Loading your bookings...</div>;
    }

    return (
        <div className="bookings-container">
            <h1>My Bookings</h1>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            {bookings.length === 0 ? (
                <div className="no-bookings">You haven't made any bookings yet.</div>
            ) : (
                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <h2>{booking.event?.title || 'Event Title Not Available'}</h2>
                            <div className="booking-details">
                                <p>Date: {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'Date not available'}</p>
                                <p>Location: {booking.event?.location || 'Location not available'}</p>
                                <p>Tickets Booked: {booking.ticketsBooked}</p>
                                <p>Price per Ticket: ${booking.event?.price?.toFixed(2) || '0.00'}</p>
                                <p>Total Price: ${booking.totalPrice?.toFixed(2) || '0.00'}</p>
                                <p className={`booking-status status-${booking.bookingStatus?.toLowerCase()}`}>
                                    Status: {booking.bookingStatus || 'Pending'}
                                </p>
                                
                                <div className="booking-actions">
                                    <button 
                                        className="cancel-button"
                                        onClick={() => handleCancelBooking(booking._id)}
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBookings; 