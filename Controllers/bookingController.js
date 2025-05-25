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
      const bookings = await bookingModel.find({ user: userId })
        .populate('event', 'title date location price')
        .sort({ createdAt: -1 });
      res.json(bookings);
    }
    catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  },
  
  createBooking: async (req, res) => {
    try {
      // Check if the authenticated user has the 'User' role
      if (req.user.role !== 'User') {
        return res.status(403).json({ message: 'Forbidden: Only regular users can create bookings' });
      }

      const { event, ticketsBooked, totalPrice, specialRequirements } = req.body;
      const userId = req.user._id;

      // Validate event exists
      const eventExists = await eventModel.findById(event);
      if (!eventExists) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Check if enough tickets are available
      if (ticketsBooked > eventExists.remainingTickets) {
        return res.status(400).json({ 
          message: `Not enough tickets available. Only ${eventExists.remainingTickets} tickets remaining.` 
        });
      }

      // Create booking
      const booking = new bookingModel({
        user: userId,
        event,
        ticketsBooked,
        totalPrice,
        specialRequirements,
        bookingStatus: 'Pending'
      });

      // Update event's remaining tickets
      eventExists.remainingTickets -= ticketsBooked;
      await eventExists.save();

      // Save the booking
      await booking.save();
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Error creating booking' });
    }
  },
  
  deleteBooking: async (req, res) => {
    try {
      const booking = await bookingModel.findById(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if the booking belongs to the user
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this booking' });
      }

      // Return the tickets to the event's remaining tickets
      const event = await eventModel.findById(booking.event);
      if (event) {
        event.remainingTickets += booking.ticketsBooked;
        await event.save();
      }

      await bookingModel.findByIdAndDelete(req.params.id);
      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ message: 'Error deleting booking' });
    }
  },

  getBookingById: async (req, res) => {
    try {
      const booking = await bookingModel.findById(req.params.id)
        .populate('event', 'title date location')
        .populate('user', 'name email');
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if the booking belongs to the user
      if (booking.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this booking' });
      }

      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ message: 'Error fetching booking' });
    }
  },

  approveBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      // Find the booking by ID
      const booking = await bookingModel.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.bookingStatus === "approved") {
        return res.status(400).json({ message: "Booking is already approved" });
      }

      // Update status to approved
      booking.bookingStatus = "approved";
      await booking.save();

      res.status(200).json({ message: "Booking approved successfully", booking });
    } catch (error) {
      console.error("Error approving booking:", error);
      res.status(500).json({ message: "Error approving booking" });
    }
  },

  cancelBooking: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const userId = req.user._id;

      // Find the booking and check ownership
      const booking = await bookingModel.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Check if the user owns this booking
      if (booking.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized to cancel this booking" });
      }

      // Find the associated event
      const event = await eventModel.findById(booking.event);
      if (!event) {
        return res.status(404).json({ message: "Associated event not found" });
      }

      // Return all tickets to the event
      event.remainingTickets += booking.ticketsBooked;
      await event.save();

      // Delete the booking
      await bookingModel.findByIdAndDelete(bookingId);
      
      res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
  },

  updateBooking: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const { ticketsBooked: ticketsBookedString } = req.body;
      const ticketsBooked = Number(ticketsBookedString);
      const userId = req.user._id;

      console.log('Update Booking Request:', { bookingId, ticketsBooked_from_request: ticketsBooked });

      // Find the booking and check ownership
      const booking = await bookingModel.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      console.log('Update Booking: Original booking ticketsBooked:', booking.ticketsBooked);

      // Check if the user owns this booking
      if (booking.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized to update this booking" });
      }

      // Find the associated event
      const event = await eventModel.findById(booking.event);
      if (!event) {
        return res.status(404).json({ message: "Associated event not found" });
      }
      console.log('Update Booking: Event remainingTickets before:', event.remainingTickets);

      // Calculate ticket difference
      const ticketDifference = ticketsBooked - booking.ticketsBooked;
      console.log('Update Booking: Calculated ticketDifference:', ticketDifference);

      // Check if there are enough remaining tickets
      if (event.remainingTickets < ticketDifference) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }

      // Update remaining tickets
      event.remainingTickets -= ticketDifference;
      console.log('Update Booking: Event remainingTickets after:', event.remainingTickets);
      await event.save();

      // Update booking
      booking.ticketsBooked = ticketsBooked;
      booking.totalPrice = event.price * ticketsBooked;
      console.log('Update Booking: Booking ticketsBooked before save:', booking.ticketsBooked);
      console.log('Update Booking: Booking totalPrice before save:', booking.totalPrice);
      await booking.save();

      res.status(200).json({ 
        message: "Booking updated successfully", 
        booking: {
          ...booking.toObject(),
          event: {
            ...event.toObject(),
            price: event.price
          }
        }
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Error updating booking", error: error.message });
    }
  }
};

module.exports = bookingController;

