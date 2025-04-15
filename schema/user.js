const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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

const User = Person.discriminator("User", userSchema);
module.exports = User;
