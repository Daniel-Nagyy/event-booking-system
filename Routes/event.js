// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require("../Controllers/eventController").default;
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
// Create a new eventModel
router.post('/events', authorizationMiddleware(['organizer']), eventController.createEvent);
//delete an event 
router.delete('/events/:id', authorizationMiddleware(["organizer,admin"]), eventController.deleteEvent);
// GET /api/v1/events/:id - Get details of a single event (public)
router.get('/:id',eventController.getEventDetails);

module.exports = router;
