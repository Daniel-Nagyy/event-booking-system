const express = require('express');
const eventsController = require('../Controllers/eventController');
const userController = require("../Controllers/userController");
const bookingController = require("../Controllers/bookingController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware=require("../Middleware/authenticationMiddleware")



router.get("/users",authenticationMiddleware,authorizationMiddleware('Admin'),userController.getAllUsers);
router.put("/users/profile/:id",authenticationMiddleware, userController.updateUser);
router.get("/:id", authorizationMiddleware('Admin'), userController.getUserById);

router.get('/events',userController.getUserEvents);

router.get('/profile',userController.getUserProfile);
router.put("/Users/profile/:id",authorizationMiddleware(['Admin ,Organizer,User']),userController.updateUser);

router.delete('/:id', authorizationMiddleware(['Admin']),userController.deleteUser);

module.exports = router;
