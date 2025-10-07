const express = require('express');
const router = express.Router();
const eventController = require("../Controllers/eventController");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

// ==========================================
// ADMIN ROUTES - MUST BE ABSOLUTELY FIRST!
// ==========================================
router.get('/all', 
  authenticationMiddleware,
  authorizationMiddleware(['Admin']),
  eventController.getAllEvents
);

router.patch('/approveevent/:eventId', 
  authenticationMiddleware,
  authorizationMiddleware(['Admin']),
  eventController.approveEvent
);

router.patch('/decline/:eventId', 
  authenticationMiddleware,
  authorizationMiddleware(['Admin']),
  eventController.declineEvent
);

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get('/', eventController.getApprovedEvents);

// ==========================================
// PROTECTED ROUTES
// ==========================================
router.post('/', 
  authenticationMiddleware,
  authorizationMiddleware(['Organizer']),
  eventController.createEvent
);

router.put('/:id', 
  authenticationMiddleware,
  authorizationMiddleware(['Admin', 'Organizer']),
  eventController.updateEvent
);

router.delete('/:id', 
  authenticationMiddleware,
  authorizationMiddleware(['Organizer', 'Admin']),
  eventController.deleteEvent
);

// ==========================================
// DYNAMIC ROUTE - MUST BE ABSOLUTELY LAST!
// ==========================================
router.get('/:id', eventController.getEventDetails);

module.exports = router;