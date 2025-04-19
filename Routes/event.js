// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require("../Controllers/eventController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
// Create a new eventModel
router.post('/', authorizationMiddleware('Organizer'), eventController.createEvent);
//delete an event 
router.delete('/:id', authorizationMiddleware('Organizer,Admin'), eventController.deleteEvent);
// GET /api/v1/events/:id - Get details of a single event (public)
router.get('/:id',eventController.getEventDetails);

//update an event
router.put("/:id",authorizationMiddleware('Admin', 'Organizer'),eventController.updateEvent);

module.exports = router;
