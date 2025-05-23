import axios from 'axios';

// Create an axios instance with custom config
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Only clear user info and redirect if the request required authentication
      const publicRoutes = ['/events', '/events/'];
      if (!publicRoutes.includes(error.config.url)) {
        localStorage.removeItem('user');
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service endpoints
export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  viewprofile: () => api.get('/users/profile'),
  forgotPassword: (email) => api.post('/forgotPassword', { email })
};

// Events service endpoints
export const eventService = {
  getAllEvents: () => api.get('/events/all'),
  getApprovedEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`)
};

// Booking service endpoints
export const bookingService = {
  createBooking: async (bookingData) => {
    return await api.post('/bookings', bookingData);
  },
  getUserBookings: async () => {
    return await api.get('/bookings/user');
  },
  getBookingById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },
  cancelBooking: async (bookingId) => {
    console.log('Cancelling booking:', bookingId);
    return await api.put(`/bookings/${bookingId}/cancel`);
  },
  updateBooking: async (bookingId, updateData) => {
    console.log('Updating booking:', bookingId, 'with data:', updateData);
    return await api.put(`/bookings/${bookingId}/update`, updateData);
  }
};

export const profileService={
  viewprofile:()=> api.get('users/profile'),
  editProfile:(dataToSend)=> api.put('users/profile',dataToSend)
}

export default api;