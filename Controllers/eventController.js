const eventModel = require('../models/Event');
const jwt = require("jsonwebtoken");
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
  }
};

module.exports = eventController;
