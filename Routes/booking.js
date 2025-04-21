 
 const express = require("express");
 const bookingController = require("../Controllers/bookingController");
 const router = express.Router();
 const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
 const authenticationMiddleware=require("../Middleware/authenticationMiddleware")
 
 router.delete("/:id", authorizationMiddleware('User'), bookingController.deleteBooking);
 router.get("/:id", bookingController.getBookingbyid);
 router.post("/",bookingController.createBooking);
router.patch("/approvebooking/:bookingId",authorizationMiddleware(['Admin', 'Organizer']),bookingController.approveBooking);


 
module.exports = router;


