const express = require('express');
const userController = require("../Controllers/userController");
const bookingController = require("../Controllers/bookingController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

router.get("/users/bookings", authorizationMiddleware(['user']), bookingController.getUserBookings);

router.get("/Users",authorizationMiddleware(['admin']),userController.getAllUsers);

router.get('/profile',authorizationMiddleware(['admin ,organizer,user']),userController.getUserProfile);

router.put("/Users/profile/:id",authorizationMiddleware(['admin ,organizer,user']),userController.updateUser);

router.delete('/:id', authorizationMiddleware(['admin']),userController.deleteUser);

module.exports = router;

