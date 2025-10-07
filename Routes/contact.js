const express = require('express');
const router = express.Router();
const contactController = require('../Controllers/contactController');

// POST /api/v1/contact - Send contact form message (public route)
router.post('/', contactController.sendMessage);

module.exports = router;