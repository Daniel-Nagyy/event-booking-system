// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const userController = require("../Controllers/userController");
const eventController = require("../Controllers/eventController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
// Create a new eventModel
router.get('/all/', eventController.getAllEvents);
 router.delete('/:id', authorizationMiddleware(['Organizer','Admin']), eventController.deleteEvent);
// //delete an event 
// // GET /api/v1/events/:id - Get details of a single event (public)
 router.put('/:id',authorizationMiddleware(['Admin', 'Organizer']),eventController.updateEvent);
 router.get('/:id',eventController.getEventDetails);


router.post('/', authorizationMiddleware(['Organizer']), eventController.createEvent);
router.get('/', eventController.getApprovedEvents);

router.patch('/approveevent/:eventId',authorizationMiddleware(['Admin']),eventController.approveEvent);

module.exports = router;
