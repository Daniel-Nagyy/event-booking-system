 
 const express = require("express");
 const bookingController = require("../Controllers/bookingController");
 const router = express.Router();
 const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
 const authenticationMiddleware=require("../Middleware/authenticationMiddleware")
 
<<<<<<< HEAD
 router.post("/bookings", authorizationMiddleware('User'), bookingController.createBooking);
 router.delete("/bookings/:id", authorizationMiddleware('User'), bookingController.deleteBooking);
=======
 router.delete("/:id", authorizationMiddleware('User'), bookingController.deleteBooking);
 router.get("/:id", bookingController.getUserBookings);
 router.post("/", authorizationMiddleware('User'), bookingController.createBooking);
>>>>>>> origin/Daniel-Branch

 
module.exports = router;


