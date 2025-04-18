const mongoose = require("mongoose");
const User = require("./user");

const OrganizerSchema = new mongoose.Schema({
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

const Organizer = User.discriminator("Organizer", OrganizerSchema);

module.exports = Organizer;
