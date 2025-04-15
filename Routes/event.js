// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { getEventDetails } = require("../Controllers/eventController");

// GET /api/v1/events/:id - Get details of a single event (public)
router.get('/:id', getEventDetails);

module.exports = router;
