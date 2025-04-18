const express = require('express');
const bookingController = require('../Controllers/bookingController');
const eventsController = require('../Controllers/eventscontroller');
const userController = require("../Controllers/userController");
const bookingController = require("../Controllers/bookingController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

router.get("/users/bookings", authorizationMiddleware(['User']), bookingController.getUserBookings);

router.get("/Users",authorizationMiddleware(['Admin']),userController.getAllUsers);

router.get("/users", authorizationMiddleware('Admin'), userController.getAllUsers);
router.put("/users/profile/:id", userController.updateUser);
router.get("/users/:id", authorizationMiddleware('Admin'), userController.getUserById);
router.post("/bookings", authorizationMiddleware('User'), bookingController.createBooking);
router.delete("/bookings/:id", authorizationMiddleware('User'), bookingController.deleteBooking);
router.put("/events/:id",authorizationMiddleware(['Admin', 'Organizer']),eventsController.updateEvent);
  module.exports = router;
router.get('/profile',authorizationMiddleware(['Admin ,Organizer,User']),userController.getUserProfile);

router.put("/Users/profile/:id",authorizationMiddleware(['Admin ,Organizer,User']),userController.updateUser);

router.delete('/:id', authorizationMiddleware(['Admin']),userController.deleteUser);

module.exports = router;

