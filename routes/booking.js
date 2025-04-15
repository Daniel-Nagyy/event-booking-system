const express = require('express');
const userController = require('../Controllers/userController');
const bookingController = require('../Controllers/bookingController');
const authorizationMiddleware= require('../Middleware/authorizationMiddleware');
const router = express.Router();

module.exports = router;
