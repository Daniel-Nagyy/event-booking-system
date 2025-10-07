const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const  authenticationMiddleware  = require('../Middleware/authenticationMiddleware');
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');

console.log('🔍 bookingController functions:', Object.keys(bookingController));

// Get user's bookings
router.get('/user', authenticationMiddleware, bookingController.getUserBookings);

// Create booking (Users only)
router.post('/', authenticationMiddleware, authorizationMiddleware(['User']), bookingController.createBooking);

// Get single booking
router.get('/:id', authenticationMiddleware, bookingController.getBookingById);

// Mark booking as attended
router.put('/:id/attended', authenticationMiddleware, bookingController.markAsAttended);

// Cancel booking
router.put('/:id/cancel', authenticationMiddleware, bookingController.cancelBooking);

// ✅ NEW: Verify QR code (Organizers and Admins)
router.post('/verify/:token', 
  authenticationMiddleware, 
  authorizationMiddleware(['Organizer', 'Admin']), 
  bookingController.verifyQRCode
);

// ✅ NEW: Get booking details by token (public - for verification page)
router.get('/token/:token', bookingController.getBookingByToken);

module.exports = router;