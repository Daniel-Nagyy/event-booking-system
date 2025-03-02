const mongoose = require('mongoose');
const Booking = require('./Booking');
const Schema = mongoose.Schema;


const eventSchema = Schema({
    EventID: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    description: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    location: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    tickets: [{
        type: Number,
        price: Number,
        totalNumber: Number,
        remainingTickets: totalNumber-Booking.length.,
        required: true
    }],
    image = {
        type: String,
        default: "default.jpg"
    }
});


module.exports = mongoose.model('Event', eventSchema);