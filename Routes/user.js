const express = require('express');
const userController = require("../Controllers/userController");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");
//Admin roles
router.get("/Users",authorizationMiddleware('Admin'),userController.getAllUsers);
router.put("/api/v1/users/:id",authorizationMiddleware('Admin'),userController.updateRole);
//User specific roles
router.put("/Users/profile/:id",authorizationMiddleware('User'),userController.updateUser);


module.exports = router;