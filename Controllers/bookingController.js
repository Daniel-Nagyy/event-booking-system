const UserModel = require("../Models/user");
const eventModel = require("../Models/Event");
const bookingModel = require("../Models/Booking");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.secretKey;
const bookingController = {
    createBooking: async (req, res) => {
        try {
            const { eventId, userId, bookingDate } = req.body;
            const existingBooking = await bookingModel.findOne({ eventId, userId });
            if (existingBooking) {
                return res.status(409).json({ message: "Booking already exists" });
            }

            const newBooking = new bookingModel({
                eventId,
                userId,
                bookingDate,
            });
            await newBooking.save();
            res.status(201).json({ message: "Booking created successfully" });
        } catch (error) {
            console.error("Error creating booking:", error);
            res.status(500).json({ message: "Error creating booking" });
        }
    },
    deleteBooking: async (req, res) => {
        try {
            const bookingId = req.params.id;
            const deletedBooking = await bookingModel.findByIdAndDelete(bookingId);
            if (!deletedBooking) {
                return res.status(404).json({message:"Booking not found" }); }
            res.status(200).json({message:"Booking deleted successfully" });
        } catch (error) {
            console.error("Error deleting booking:", error);
            res.status(500).json({ message: "Error deleting booking" });
        }
    },
};
module.exports = bookingController;