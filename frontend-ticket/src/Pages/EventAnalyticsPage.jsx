import { useState, useEffect } from 'react';
import './EventAnalyticsPage.css'; // We'll create this CSS file next
import { eventService } from '../services/api';

function EventAnalyticsPage() {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await eventService.getEventsAnalytics();
                
                if (response.data && response.data.analysis && Array.isArray(response.data.analysis)) {
                    setAnalytics(response.data.analysis);
                } else if (response.data && Array.isArray(response.data)) {
                    setAnalytics(response.data);
                } else {
                    setAnalytics([]);
                    console.warn("Analytics data received is not in the expected format:", response.data);
                }
            } catch (err) {
                console.error('Error fetching event analytics:', err);
                if (err.response) {
                    if (err.response.status === 403) {
                        setError('Access Denied: You do not have permission to view these analytics. (Admin or Organizer access required)');
                    } else if (err.response.status === 404) {
                        setError('No analytics data found. Ensure there are events to analyze.');
                    } else {
                        setError(`Failed to load analytics: ${err.response.data.message || err.message}`);
                    }
                } else {
                    setError('Failed to load analytics. An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="analytics-loading">Loading event analytics...</div>;
    }

    if (error) {
        return (
            <div className="analytics-container">
                <div className="analytics-error-message">{error}</div>
                <button 
                    onClick={() => window.location.reload()} 
                    style={{marginTop: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            <h1>Event Analytics</h1>

            {analytics.length === 0 && !error && (
                <p className="no-analytics-data">No analytics data available at the moment.</p>
            )}
            {analytics.length > 0 && (
                <div>
                    <p className="analytics-success-message">✅ Found {analytics.length} events with analytics data!</p>
                    <table className="analytics-table">
                        <thead>
                            <tr>
                                <th>Event Title</th>
                                <th>Event ID</th>
                                <th>Percentage Booked</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.map((event, index) => (
                                <tr key={event.eventId || index}>
                                    <td>{event.title || 'N/A'}</td>
                                    <td>{event.eventId || 'N/A'}</td>
                                    <td>{event.percentageBooked !== undefined ? `${event.percentageBooked}%` : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default EventAnalyticsPage; 