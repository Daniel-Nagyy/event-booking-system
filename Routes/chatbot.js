const express = require('express');
const router = express.Router();
const chatbotController = require('../Controllers/chatbotController');
const authenticationMiddleware = require('../Middleware/authenticationMiddleware');

// Public routes
router.get('/quick-responses', chatbotController.getQuickResponses);
router.get('/event-help/:eventId', chatbotController.getEventHelp);

// Authenticated routes (optional - works for both logged in and guests)
router.post('/chat', (req, res, next) => {
  // Try to authenticate, but don't fail if not authenticated
  if (req.cookies.token) {
    return authenticationMiddleware(req, res, next);
  }
  next();
}, chatbotController.chat);

module.exports = router;