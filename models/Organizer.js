const mongoose = require('mongoose');
const User = require('./user');
const OrganizerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

// Prevent redefining the discriminator
const Organizer = mongoose.models.Organizer || User.discriminator("Organizer", OrganizerSchema);

module.exports = Organizer;
