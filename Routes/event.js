// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const userController = require("../Controllers/userController");
const eventController = require("../Controllers/eventController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
// Create a new eventModel
router.delete('/:id', authorizationMiddleware(['Organizer','Admin']), eventController.deleteEvent);
//delete an event 
// GET /api/v1/events/:id - Get details of a single event (public)
router.put("/:id",authorizationMiddleware(['Admin', 'Organizer']),eventController.updateEvent);
router.get('/:id',eventController.getEventDetails);


router.post('/', authorizationMiddleware(['Admin']), eventController.createEvent);
module.exports = router;
