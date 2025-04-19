 
 const express = require('express');
 const eventsController = require('../Controllers/eventController');
 const userController = require("../Controllers/userController");
 const bookingController = require("../Controllers/bookingController");
 const router = express.Router();
 const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
 const authenticationMiddleware=require("../Middleware/authenticationMiddleware")
 
 router.post("/bookings", authorizationMiddleware('User'), bookingController.createBooking);
 router.delete("/bookings/:id", authorizationMiddleware('User'), bookingController.deleteBooking);

 
module.exports = router;


