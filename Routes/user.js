const express = require('express');
const eventsController = require('../Controllers/eventController');
const userController = require("../Controllers/userController");
const bookingController = require("../Controllers/bookingController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware=require("../Middleware/authenticationMiddleware")

 router.get("/users/bookings", authorizationMiddleware(['User']), bookingController.getUserBookings);

router.get("/users",authenticationMiddleware,authorizationMiddleware('Admin'),userController.getAllUsers);
router.put("/users/profile/:id",authenticationMiddleware, userController.updateUser);
router.get("/users/:id", authorizationMiddleware('Admin'), userController.getUserById);
router.post("/bookings", authorizationMiddleware('User'), bookingController.createBooking);
router.delete("/bookings/:id", authorizationMiddleware('User'), bookingController.deleteBooking);
router.put("/events/:id",authorizationMiddleware(['Admin', 'Organizer']),eventsController.updateEvent);
router.get('/profile',userController.getUserProfile);

router.put("/Users/profile/:id",authorizationMiddleware(['Admin ,Organizer,User']),userController.updateUser);

router.delete('/:id', authorizationMiddleware(['Admin']),userController.deleteUser);

module.exports = router;
