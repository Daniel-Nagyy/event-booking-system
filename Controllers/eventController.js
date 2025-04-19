const eventModel = require('../models/Event');
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();


const eventController = {
  createEvent: async (req, res) => {
    const {
      EventID, title, description, location,
      category, date, time, totalTickets
    } = req.body;

    const organizerId = req.user._id;
    const event = new eventModel({
      EventID,
      title,
      description,
      location,
      category,
      date,
      time,
      totalTickets,
      organizer: organizerId
    });

    try {
      await event.save();
      return res.status(201).json(event);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteEvent: async (req, res) => {
    const eventId = req.params.id;
    try {
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
      const organizerId = req.user.id; // Organizer's ID from token/session

      // Find all events organized by this user
      const events = await eventModel.find({ organizer: organizerId });

      if (!events.length) {
        return res.status(404).json({ message: 'No events found for this organizer' });
      }

      // Prepare analysis data
      const analysis = events.map(event => {
        const booked = event.totalTickets - event.remainingTickets;
        const percentageBooked = (booked / event.totalTickets) * 100;

        return {
          title: event.title,
          eventId: event.EventID,
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
      const event = await eventModel.findById(eventId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const eventId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const allowedFields = ["title", "description", "date", "location", "price"];
      const updateData = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      const updatedEvent = await eventModel.findByIdAndUpdate(
        eventId,
        { $set: updateData },
        { new: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Error updating event", error: error.message });
    }
  }
};

module.exports = eventController;
