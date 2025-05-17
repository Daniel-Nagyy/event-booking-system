const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Event = require("./Event");
const User = require("./user");

const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  ticketsBooked: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["Pending", "approved", "Cancelled"],
    default: "Pending",
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
