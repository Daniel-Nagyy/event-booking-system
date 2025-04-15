const mongoose = require('mongoose');
const Booking = require('./Booking');
const Organizer = require("./Organizer")
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
    category:{
        type: String,
        required : true
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
        ref: 'Organizer'
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    totalTickets: {
         type: Number, required: true
         },
    remainingTickets: {
         type: Number, default: function () { return this.totalTickets; } 
        },

    image: {
        type: String,
        default: "default.jpg"
    },
},
    
    {
        timestamps:true
 
    
});

eventSchema.methods.updateRemainingTickets = function (bookings) {
    this.remainingTickets = this.totalTickets - bookings;
    return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
