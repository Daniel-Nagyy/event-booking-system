const express = require('express');
const bookingController = require('../Controllers/bookingController');
const eventsController = require('../Controllers/eventscontroller');
const userController = require("../Controllers/userController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");

router.get("/users", authorizationMiddleware(['admin']), userController.getAllUsers);
router.put("/users/profile/:id", userController.updateUser);
router.get("/users/:id", authorizationMiddleware(['admin']), userController.getUserById);
router.post("/bookings", authorizationMiddleware(['StandardUser']), bookingController.createBooking);
router.delete("/bookings/:id", authorizationMiddleware(['StandardUser']), bookingController.deleteBooking);
router.put("/events/:id",authorizationMiddleware(['admin', 'Organizer']),eventsController.updateEvent);
  module.exports = router;