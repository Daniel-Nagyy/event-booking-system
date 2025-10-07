const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  description: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  location: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  // ✅ REMOVE single price field
  // price: { type: Number, required: true, default: 0 },
  
  // ✅ ADD ticket types array
  ticketTypes: [{
    name: {
      type: String,
      required: true,
      enum: ['Standard', 'VIP', 'Premium', 'Early Bird', 'Student', 'General Admission']
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    remaining: {
      type: Number,
      required: true,
      default: function() {
        return this.quantity;
      }
    }
  }],
  
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Organizer",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  
  // ✅ KEEP these for backward compatibility/quick stats
  totalTickets: {
    type: Number,
    required: true,
  },
  remainingTickets: {
    type: Number,
    required: true,
    default: function() {
      return this.totalTickets;
    }
  },
  
  image: {
    type: String,
    default: "default.jpg",
  },
  status: {
    type: String,
    enum: ["Pending", "approved", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save middleware
eventSchema.pre('save', function(next) {
  if (this.isNew) {
    this.remainingTickets = this.totalTickets;
    
    // Set remaining tickets for each ticket type
    if (this.ticketTypes && this.ticketTypes.length > 0) {
      this.ticketTypes.forEach(ticketType => {
        if (ticketType.remaining === undefined) {
          ticketType.remaining = ticketType.quantity;
        }
      });
    }
  }
  next();
});

eventSchema.methods.updateRemainingTickets = function (bookings) {
  this.remainingTickets = this.totalTickets - bookings;
  return this.save();
};

module.exports = mongoose.model("Event", eventSchema);