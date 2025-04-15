const express = require('express');
const userController = require("../Controllers/userController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");

router.get("/allUsers",authorizationMiddleware('Admin'),userController.getAllUsers);

module.exports = router;