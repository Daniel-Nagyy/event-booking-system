const express = require("express");
const bookingController = require("../Controllers/bookingController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");

// Apply authentication middleware to all routes
router.use(authenticationMiddleware);

// Booking routes
router.get("/user", bookingController.getUserBookings);
router.post("/", bookingController.createBooking);
router.get("/:id", bookingController.getBookingById);
router.delete("/:id", authorizationMiddleware('User'), bookingController.deleteBooking);
router.put("/:id/cancel", bookingController.cancelBooking);
router.put("/:id/update", bookingController.updateBooking);

module.exports = router;


