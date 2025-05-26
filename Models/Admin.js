const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    Permissions: [{
        type: String,
        description: Text
    }]

});