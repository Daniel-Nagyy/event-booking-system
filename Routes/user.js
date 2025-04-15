const express = require('express');
const userController = require("../Controllers/userController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");

router.get("/Users",authorizationMiddleware('Admin'),userController.getAllUsers);
router.put("/Users/profile/:id",userController.updateUser);
module.exports = router;

const { getUserProfile } = require("../Controllers/userController");
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);

module.exports = router;
// routes/userRoutes.js

const { deleteUser } = require("../Controllers/userController");
const { protect, isAdmin } = require('../middleware/authMiddleware');

// DELETE /api/v1/users/:id - Admins can delete users
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;
