const express = require('express');
const bookingController = require('../Controllers/bookingController');
const eventsController = require('../Controllers/eventController');
const userController = require("../Controllers/userController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");

// Specific routes FIRST
router.get("/",authorizationMiddleware('Admin'),userController.getAllUsers);
router.post("/",authorizationMiddleware('Admin'),userController.createUser);
router.put("/:id",authorizationMiddleware('Admin'),userController.adminUpdateUser);
router.get("/bookings",bookingController.getUserBookings);
router.get('/events',authorizationMiddleware('Organizer'),userController.getUserEvents);
router.get('/events/analytics',authorizationMiddleware(['Admin','Organizer']),eventsController.getEventAnalysis);
router.get('/profile',userController.getUserProfile);
router.put('/profile',userController.updateUser);

// Parameterized routes LAST
router.get("/:id", authorizationMiddleware('Admin'), userController.getUserById);
router.put("/:id", authorizationMiddleware('Admin'), userController.updateRole);
router.delete("/:id", authorizationMiddleware('Admin'), userController.deleteUser);

module.exports = router;
