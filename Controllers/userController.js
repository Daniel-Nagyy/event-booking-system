const usermodel = require('../models/user');
const organizerModel = require('../models/Organizer');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const userController = {
  getOrganizerAnalytics: async (req, res) => {
    try{
        const Organizer = await organizerModel.findById(req.params.id).populate('events');
        return res.status(200).json(Organizer.events);
    }
    catch(error){
        return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = userController;



