const express = require("express");
const router = express.Router();
const bookingController= require("../Controllers/bookingController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

//user
router.get("/api/v1/bookings/:id",authorizationMiddleware('User'), bookingController.getBooking)