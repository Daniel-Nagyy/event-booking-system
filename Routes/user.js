const express = require('express');
const bookingController = require('../Controllers/bookingController');
const eventsController = require('../Controllers/eventscontroller');
const userController = require("../Controllers/userController");
const UserModel = require("../Models/user");
const eventModel = require("../Models/Event");
const bookingModel = require("../Models/Booking");
const organizermodel = require("../Models/Organizer");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");

router.get("/users", authorizationMiddleware('Admin'), userController.getAllUsers);
router.put("/users/profile/:id", userController.updateUser);
router.get("/users/:id", authorizationMiddleware('Admin'), userController.getUserById);
router.post("/bookings", authorizationMiddleware('User'), bookingController.createBooking);
router.delete("/bookings/:id", authorizationMiddleware('User'), bookingController.deleteBooking);
router.put("/events/:id",authorizationMiddleware(['Admin', 'Organizer']),eventsController.updateEvent);
  module.exports = router;