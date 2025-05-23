// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const userController = require("../Controllers/userController");
const eventController = require("../Controllers/eventController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");

// Public routes (no authentication required)
router.get('/', eventController.getApprovedEvents);
router.get('/:id', eventController.getEventDetails);

// Protected routes (authentication required)
router.use(authenticationMiddleware);
router.get('/all/', authorizationMiddleware('Admin'), eventController.getAllEvents);
router.delete('/:id', authorizationMiddleware(['Organizer','Admin']), eventController.deleteEvent);
router.put('/:id', authorizationMiddleware(['Admin', 'Organizer']), eventController.updateEvent);
router.post('/', authorizationMiddleware(['Organizer']), eventController.createEvent);
router.patch('/approveevent/:eventId', authorizationMiddleware(['Admin']), eventController.approveEvent);

module.exports = router;
