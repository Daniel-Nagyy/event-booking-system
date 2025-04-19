// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require("../Controllers/eventController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
// Create a new eventModel
router.post('/events', authorizationMiddleware(['Organizer']), eventController.createEvent);
//delete an event 
router.delete('/events/:id', authorizationMiddleware(['Organizer','Admin']), eventController.deleteEvent);
// GET /api/v1/events/:id - Get details of a single event (public)
router.get('/:id',eventController.getEventDetails);

module.exports = router;
