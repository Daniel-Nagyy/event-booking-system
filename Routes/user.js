const express = require('express');
const bookingController = require('../Controllers/bookingController');
const eventsController = require('../Controllers/eventController');
const userController = require("../Controllers/userController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware=require("../Middleware/authenticationMiddleware")

router.get("/bookings", authorizationMiddleware('User'), bookingController.getUserBookings);

router.get("/",authorizationMiddleware('Admin'), userController.getAllUsers);


router.get("/bookings", authorizationMiddleware('User'), bookingController.getUserBookings);

router.get('/profile',authorizationMiddleware('Admin ,Organizer,User'),userController.getUserProfile);

router.put("/profile",authorizationMiddleware('Admin ,Organizer,User'),userController.updateUser);

router.get('/events',userController.getUserEvents);

//get event analysis
router.get('/events/analysis', authorizationMiddleware('Organizer'), eventsController.getEventAnalysis);
//leave the routes that have :id after the routes that does not have :id
//it doesnt allow the static routes to go through 
router.put("/events/:id",authorizationMiddleware('Admin', 'Organizer'),eventsController.updateEvent);
router.delete('/:id', authorizationMiddleware('Admin'),userController.deleteUser);
router.get("/:id", authorizationMiddleware('Admin'), userController.getUserById);


module.exports = router;
