const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = require('./Event');
const User = require('./User');
const bookingSchema = new Schema({
    BookingID: {
        type: Number,
        required: true,
        unique: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bookingStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
    }
    
});