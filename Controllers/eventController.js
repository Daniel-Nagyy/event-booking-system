const jwt = require("jsonwebtoken");
const eventModel = require('../models/Event');
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const eventController = {
 createEvent: async (req, res) => {
    const organizerId = req.user.id; 
    const event = new eventModel({
        EventID: req.body.EventID,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        category: req.body.category,
        date: req.body.date,
        time: req.body.time, // <- this was missing in your original post
        totalTickets: req.body.totalTickets,
        organizer: organizerId
    });

    try {
        await event.save(); // fixed line
        return res.status(201).json(event);
    } catch (error) {
        console.error(error); // helpful for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
  },
  deleteEvent: async (req, res) => {
    const eventId = req.params.id;
    eventModel.findByIdAndDelete(eventId)
      try{
        res.status(200).json({ message: 'Event deleted successfully' });
      }
      catch(error) {
        res.status(500).json({ message: 'Internal server error' });
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
            const updatedEvent = await eventModel.findByIdAndUpdate(eventId,
                { $set: req.body },
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
  }


};

module.exports = eventController;
