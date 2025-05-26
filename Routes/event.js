// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const userController = require("../Controllers/userController");
const eventController = require("../Controllers/eventController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");

// Public routes (no authentication required)
router.get('/', eventController.getApprovedEvents);


router.get('/all', authorizationMiddleware('Admin'), eventController.getAllEvents);
/*
leave the getEventDetails down i spent more than 1 hour tring to understand 
why does the database take all as a parameter for a func that doesnt take parameters 
the code routes "/all" to "/:id" so leave the /:id routes down
*/

router.post('/', authorizationMiddleware(['Organizer']), eventController.createEvent);
router.patch('/approveevent/:eventId', authorizationMiddleware(['Admin']), eventController.approveEvent);
router.patch('/decline/:eventId',authorizationMiddleware(['Admin']),eventController.declineEvent);
router.get('/:id', eventController.getEventDetails);
router.delete('/:id', authorizationMiddleware(['Organizer','Admin']), eventController.deleteEvent);
router.put('/:id', authorizationMiddleware(['Admin', 'Organizer']), eventController.updateEvent);
module.exports = router;
