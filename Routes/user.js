const express = require('express');
const bookingController = require('../Controllers/bookingController');
const eventsController = require('../Controllers/eventController');
const userController = require("../Controllers/userController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware=require("../Middleware/authenticationMiddleware")



router.get("/",userController.getAllUsers);
router.get("/:id", authorizationMiddleware('Admin'), userController.getUserById);
router.put("/:id", userController.updateRole);
router.delete("/:id", userController.deleteUser);

router.get("/bookings",bookingController.getUserBookings);

router.get('/events',authorizationMiddleware('Organizer'),userController.getUserEvents);
router.get('/events/analytics',authorizationMiddleware('Admin'),eventsController.getEventAnalysis);

router.get('/profile',userController.getUserProfile);

router.put('/profile',userController.updateUser);


module.exports = router;
