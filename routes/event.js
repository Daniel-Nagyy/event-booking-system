const express = require('express');
const eventController = require('../Controllers/eventController');
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const eventModel = require('../models/Event');
const router = express.Router();

// Create a new eventModel
router.post('/events', authorizationMiddleware(["organizer"]), eventController.createEvent);
//delete an event 
router.delete('/events/:id', authorizationMiddleware(["organizer,admin"]), eventController.deleteEvent);


module.exports = router;
