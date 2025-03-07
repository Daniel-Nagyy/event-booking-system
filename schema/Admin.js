const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Permissions: [{
        type: String,
        description: Text
    }]

});

const Admin = User.discriminator("Organizer", OrganizerSchema);