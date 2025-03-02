const mongoose = require('mongoose');
const OrganizerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

const Organizer = Person.discriminator("Organizer", OrganizerSchema);