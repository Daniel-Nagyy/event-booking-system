const bookingModel = require("../Models/Booking");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");
const secretKey = process.env.SECRET_KEY;
const eventModel = require('../Models/Event');
const bcrypt = require("bcrypt");
const bookingController = {
  getUserBookings: async (req, res) => {
    console.log("Fetching user bookings");
    try{
      const userId = req.user._id;
      const bookings = await bookingModel.find({ user: userId }).populate('event');
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found for this user' });
      }
      return res.status(200).json(bookings);
    } 
    catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  createBooking: async (req, res) => {
    try {
      const userId = req.user._id;
      const { event, bookingDate, totalPrice, ticketsBooked } = req.body;
  
      // Check if event exists
      const eventData = await eventModel.findById(event);
      if (!eventData) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Check if enough tickets are available
      if (ticketsBooked > eventData.remainingTickets) {
        return res.status(400).json({
          message: `Only ${eventData.remainingTickets} tickets remaining. Cannot book ${ticketsBooked}.`
        });
      }
  
      // Check if user has already booked the event
      const existingBooking = await bookingModel.findOne({ event, user: userId });
      if (existingBooking) {
        return res.status(409).json({ message: "Booking already exists" });
      }
  
      // Create the new booking
      const newBooking = new bookingModel({
        event,
        user: userId,
        bookingDate,
        totalPrice,
        ticketsBooked
      });
  
      await newBooking.save();
  
      // Update remaining tickets in the event
      eventData.remainingTickets -= ticketsBooked;
      await eventData.save();
  
      res.status(201).json({
        message: "Booking created successfully",
        booking: newBooking
      });
  
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Error creating booking" });
    }
  },
  
deleteBooking: async (req, res) => {
  try {
    const bookingId = req.params.id;
    let deletedBooking;

    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      deletedBooking = await bookingModel.findByIdAndDelete(bookingId);
    }

    if (!deletedBooking && !isNaN(bookingId)) {
      deletedBooking = await bookingModel.findOneAndDelete({ BookingID: Number(bookingId) });
    }

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });

  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Error deleting booking" });
  }
}
};


module.exports = bookingController;

