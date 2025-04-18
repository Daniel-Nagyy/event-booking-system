const UserModel = require("../Models/user");
const eventModel = require("../Models/Event");
const bookingModel = require("../Models/Booking");
const organizermodel = require("../Models/Organizer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
require("dotenv").config();

const secretKey = process.env.secretKey;

const eventController = {
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
    }
};

module.exports = eventController;
