const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    UserID: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255    
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    role: {
        type: String,
        enum: ["User", "Organizer", "Admin"], 
        default: "User",
      },
    profilePicture: {
      type: String,
      default: "Resources\default.jpg",
    },
    Booking: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    timestamps: true 

});
const User = mongoose.model('User', UserSchema);
module.exports = User;