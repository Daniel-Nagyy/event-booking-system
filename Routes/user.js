const express = require('express');
const bookingController = require('../Controllers/bookingController');
const eventsController = require('../Controllers/eventscontroller');
const userController = require("../Controllers/userController");
const bookingController = require("../Controllers/bookingController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

router.get("/users/bookings", authorizationMiddleware(['user']), bookingController.getUserBookings);

router.get("/Users",authorizationMiddleware(['admin']),userController.getAllUsers);

router.get("/users", authorizationMiddleware('Admin'), userController.getAllUsers);
router.put("/users/profile/:id", userController.updateUser);
router.get("/users/:id", authorizationMiddleware('Admin'), userController.getUserById);
router.post("/bookings", authorizationMiddleware('User'), bookingController.createBooking);
router.delete("/bookings/:id", authorizationMiddleware('User'), bookingController.deleteBooking);
router.put("/events/:id",authorizationMiddleware(['Admin', 'Organizer']),eventsController.updateEvent);
  module.exports = router;
router.get('/profile',authorizationMiddleware(['admin ,organizer,user']),userController.getUserProfile);

router.put("/Users/profile/:id",authorizationMiddleware(['admin ,organizer,user']),userController.updateUser);

router.delete('/:id', authorizationMiddleware(['admin']),userController.deleteUser);

module.exports = router;

