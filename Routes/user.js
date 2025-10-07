const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const  authenticationMiddleware  = require('../Middleware/authenticationMiddleware');
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');

// ✅ Get user profile
router.get('/profile', authenticationMiddleware, userController.getUserProfile);

// ✅ Update user profile (basic info + password)
router.put('/profile', authenticationMiddleware, userController.updateUser);

// ✅ Upload profile picture
router.post('/profile/picture', 
  authenticationMiddleware, 
  userController.uploadProfilePicture, 
  userController.updateProfilePicture
);

// ✅ Delete profile picture
router.delete('/profile/picture', 
  authenticationMiddleware, 
  userController.deleteProfilePicture
);

// ✅ Get user's events (Organizer only)
router.get('/events', 
  authenticationMiddleware, 
  authorizationMiddleware(['Organizer']), 
  userController.getUserEvents
);

// ✅ Get analytics (Organizer only)
router.get('/events/analytics', 
  authenticationMiddleware, 
  authorizationMiddleware(['Organizer']), 
  async (req, res) => {
    try {
      const Event = require('../Models/Event');
      const Booking = require('../Models/Booking');
      
      const events = await Event.find({ organizer: req.user._id });
      
      const analysis = await Promise.all(
        events.map(async (event) => {
          const bookings = await Booking.countDocuments({ event: event._id });
          const percentageBooked = event.totalTickets > 0 
            ? Math.round((bookings / event.totalTickets) * 100)
            : 0;
          
          return {
            eventId: event._id,
            title: event.title,
            totalTickets: event.totalTickets,
            bookings,
            percentageBooked,
          };
        })
      );

      res.json({ analysis });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ message: 'Error fetching analytics' });
    }
  }
);

// ✅ Admin routes - Get all users
router.get('/', 
  authenticationMiddleware, 
  authorizationMiddleware(['Admin']), 
  userController.getAllUsers
);

// ✅ Admin - Get user by ID
router.get('/:id', 
  authenticationMiddleware, 
  authorizationMiddleware(['Admin']), 
  userController.getUserById
);

// ✅ Admin - Create user
router.post('/', 
  authenticationMiddleware, 
  authorizationMiddleware(['Admin']), 
  userController.createUser
);

// ✅ Admin - Update user
router.put('/:id', 
  authenticationMiddleware, 
  authorizationMiddleware(['Admin']), 
  userController.adminUpdateUser
);

// ✅ Admin - Delete user
router.delete('/:id', 
  authenticationMiddleware, 
  authorizationMiddleware(['Admin']), 
  userController.deleteUser
);

// ✅ Admin - Update user role
router.patch('/:id/role', 
  authenticationMiddleware, 
  authorizationMiddleware(['Admin']), 
  userController.updateRole
);

module.exports = router;