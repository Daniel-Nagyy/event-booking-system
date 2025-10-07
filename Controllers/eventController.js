const eventModel = require('../Models/Event');
const bookingModel = require('../Models/Booking');
require("dotenv").config();
const mongoose = require("mongoose");

const eventController = {
  createEvent: async (req, res) => {
    try {
      const {
        title, description, location, category, 
        date, time, ticketTypes, image
      } = req.body;

      const organizerId = req.user._id;

      // Validate ticket types
      if (!ticketTypes || ticketTypes.length === 0) {
        return res.status(400).json({ message: "At least one ticket type is required" });
      }

      // Calculate total tickets
      const totalTickets = ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0);

      // Check for duplicate event
      const existingEvent = await eventModel.findOne({ title, date, time });
      if (existingEvent) {
        return res.status(409).json({ message: "An event with the same title, date, and time already exists." });
      }

      // Create new event
      const event = new eventModel({
        title,
        description,
        location,
        category,
        date,
        time,
        ticketTypes,
        totalTickets,
        remainingTickets: totalTickets,
        image: image || 'default.jpg',
        organizer: organizerId,
        status: 'Pending' // Awaits admin approval
      });

      await event.save();
      return res.status(201).json({ 
        message: 'Event created successfully! Awaiting admin approval.',
        event 
      });
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const eventId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      // Find existing event
      const existingEvent = await eventModel.findById(eventId);
      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Enforce ownership
      if (req.user.role === 'Organizer' && String(existingEvent.organizer) !== String(req.user._id)) {
        return res.status(403).json({ message: "You are not allowed to modify this event" });
      }

      const { 
        title, description, date, time, location, category, 
        ticketTypes, image 
      } = req.body;

      // Prepare update data
      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (date) updateData.date = date;
      if (time) updateData.time = time;
      if (location) updateData.location = location;
      if (category) updateData.category = category;
      if (image) updateData.image = image;

      // Update ticket types if provided
      if (ticketTypes && Array.isArray(ticketTypes)) {
        updateData.ticketTypes = ticketTypes;
        updateData.totalTickets = ticketTypes.reduce((sum, t) => sum + t.quantity, 0);
        
        // Recalculate remaining based on existing bookings
        const ticketsSold = existingEvent.totalTickets - existingEvent.remainingTickets;
        updateData.remainingTickets = updateData.totalTickets - ticketsSold;
      }

      const updatedEvent = await eventModel.findByIdAndUpdate(
        eventId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      res.status(200).json({ 
        message: 'Event updated successfully',
        event: updatedEvent 
      });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Error updating event", error: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    const eventId = req.params.id;
    try {
      // Enforce ownership
      if (req.user && req.user.role === 'Organizer') {
        const existingEvent = await eventModel.findById(eventId).select('organizer');
        if (!existingEvent) {
          return res.status(404).json({ message: 'Event not found' });
        }
        if (String(existingEvent.organizer) !== String(req.user._id)) {
          return res.status(403).json({ message: 'You are not allowed to delete this event' });
        }
      }

      const deletedEvent = await eventModel.findByIdAndDelete(eventId);
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getEventAnalysis: async (req, res) => {
    try {
      const organizerId = req.user._id;

      const events = await eventModel.find({ organizer: organizerId });

      if (!events.length) {
        return res.status(404).json({ message: 'No events found for this organizer' });
      }

      const analysis = events.map(event => {
        const booked = event.totalTickets - event.remainingTickets;
        const percentageBooked = (booked / event.totalTickets) * 100;

        return {
          title: event.title,
          eventId: event._id,
          percentageBooked: Math.round(percentageBooked),
        };
      });

      res.status(200).json({ analysis });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getEventDetails: async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await eventModel.findById(eventId).populate('organizer', 'name email');
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  approveEvent: async (req, res) => {
    try {
      const { eventId } = req.params;

      const event = await eventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.status === "approved") {
        return res.status(400).json({ message: "Event is already approved" });
      }

      event.status = "approved";
      await event.save();

      res.status(200).json({ message: "Event approved successfully", event });
    } catch (error) {
      console.error("Error approving event:", error);
      res.status(500).json({ message: "Error approving event" });
    }
  },

  declineEvent: async (req, res) => {
    try {
      const { eventId } = req.params;

      const event = await eventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.status === "Cancelled") {
        return res.status(400).json({ message: "Event is already Cancelled" });
      }

      event.status = "Cancelled";
      await event.save();

      res.status(200).json({ message: "Event declined successfully", event });
    } catch (error) {
      console.error("Error declining event:", error);
      res.status(500).json({ message: "Error declining event" });
    }
  },

  getApprovedEvents: async (req, res) => {
    try {
      const approvedEvents = await eventModel.find({ status: "approved" })
        .populate('organizer', 'name email')
        .sort({ date: 1 });

      res.status(200).json(approvedEvents);
    } catch (error) {
      console.error("Error fetching approved events:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getAllEvents: async (req, res) => {
    try {
      const events = await eventModel.find().populate('organizer', 'name email').sort({ createdAt: -1 });
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching all events:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getUserEvents: async (req, res) => {
    try {
      const organizerId = req.user._id;
      const events = await eventModel.find({ organizer: organizerId }).sort({ createdAt: -1 });
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching user events:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = eventController;