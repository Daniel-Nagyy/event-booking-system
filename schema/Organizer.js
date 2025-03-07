const mongoose = require('mongoose');
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

const Organizer = User.discriminator("Organizer", OrganizerSchema);