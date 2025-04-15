const bookingModel = require('../models/Booking');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const bookingController = {
  getUserBookings: async (req, res) => {
    console.log("Fetching user bookings");
    try{
      const userId = req.user.id;
      const bookings = await bookingModel.find({ userId: userId }).populate('event');
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found for this user' });
      }
      return res.status(200).json(bookings);
    } 
    catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  }
module.exports = bookingController;
