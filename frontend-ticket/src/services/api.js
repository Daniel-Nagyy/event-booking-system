import axios from 'axios';

// Create an axios instance with custom config
const api = axios.create({
  baseURL: 'http://localhost:3001/api',// el port el ana sha8al 3aleh
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Clear user info from localStorage
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service endpoints
export const authService = {
  login: (credentials) => api.post('/v1/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  viewprofile:()=> api.get('v1/users/profile'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email })
};

// Events service endpoints
export const eventService = {
    getAllEvents: () => api.get('/events'),
    getEventById: (id) => api.get(`/v1/events/${id}`),
    createEvent: (eventData) => api.post('/v1/events', eventData, { withCredentials: true }),
    updateEvent: (id, eventData) => api.put(`/v1/events/${id}`, eventData, { withCredentials: true }),
    deleteEvent: (id) => api.delete(`/events/${id}`),
    getUserEvents: () => api.get('/v1/users/events', {
            withCredentials: true
        }),
    getEventsAnalytics: () => api.get('/v1/users/events/analytics', {
            withCredentials: true
        })
};

export const profileService={
  viewprofile:()=> api.get('v1/users/profile'),
  editProfile:(dataToSend)=> api.put('v1/users/profile',dataToSend)
}

export default api;