 
 const express = require("express");
 const bookingController = require("../Controllers/bookingController");
 const router = express.Router();
 const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
 const authenticationMiddleware=require("../Middleware/authenticationMiddleware")
 
 router.delete("/:id", authorizationMiddleware('User'), bookingController.deleteBooking);
 router.get("/:id", bookingController.getUserBookings);
 router.post("/",bookingController.createBooking);

 
module.exports = router;


