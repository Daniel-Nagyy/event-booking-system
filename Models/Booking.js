const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    ticketType: {
      type: String,
      required: true,
      enum: ['Standard', 'VIP', 'Premium', 'Early Bird', 'Student', 'General Admission']
    },
    
    ticketsBooked: {
      type: Number,
      required: true,
      min: 1,
    },
    
    totalPrice: {
      type: Number,
      required: true,
    },
    
    pricePerTicket: {
      type: Number,
      required: true,
    },
    
    bookingStatus: {
      type: String,
      enum: ["Booked", "Attended", "Cancelled"],
      default: "Booked",
    },

    // ✅ NEW QR CODE FIELDS
    qrCode: {
      type: String, // Base64 encoded QR code image
      required: false
    },
    
    qrToken: {
      type: String, // Unique verification token
      required: false,
      unique: true,
      sparse: true // Allows null values while maintaining uniqueness
    },
    
    qrCodeUsed: {
      type: Boolean,
      default: false
    },
    
    qrCodeScannedAt: {
      type: Date,
      default: null
    },
    
    qrCodeScannedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Organizer who scanned it
      default: null
    }
  },
  { timestamps: true }
);

// Index for faster QR token lookups
bookingSchema.index({ qrToken: 1 });

module.exports = mongoose.model("Booking", bookingSchema);