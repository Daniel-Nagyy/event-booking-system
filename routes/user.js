const express = require('express');
const userController = require('../Controllers/userController');
const bookingController = require('../Controllers/bookingController');
const router = express.Router();
const authorizationMiddleware= require('../middleware/authorizationMiddleware');

//get current user bookings
router.get('/:id/bookings', authorizationMiddleware['user'], bookingController.getUserBookings);

module.exports = router;
