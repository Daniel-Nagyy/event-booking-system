const bookingModel = require('../models/Booking');

const bookingController = {
  getUserBookings: async (req, res) => {
    try{
      const userId = req.params.id;
      const bookings = await bookingModel.find({ userId: userId });
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found for this user' });
      }
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  }
module.exports = bookingController;
